const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketToken", function () {
  async function deployFixture() {
    const [owner, vendor, buyer] = await ethers.getSigners();
    const ticketPrice = ethers.parseEther("0.01");
    const TicketToken = await ethers.getContractFactory("TicketToken");
    const token = await TicketToken.deploy(
      "Event Ticket",
      "ETIX",
      ticketPrice,
      vendor.address,
      owner.address
    );
    return { token, owner, vendor, buyer, ticketPrice };
  }

  it("sets constructor values and ownership correctly", async function () {
    const { token, owner, vendor, ticketPrice } = await deployFixture();

    expect(await token.name()).to.equal("Event Ticket");
    expect(await token.symbol()).to.equal("ETIX");
    expect(await token.owner()).to.equal(owner.address);
    expect(await token.vendor()).to.equal(vendor.address);
    expect(await token.ticketPriceWei()).to.equal(ticketPrice);
  });

  it("reverts deploy when vendor is zero address", async function () {
    const [owner] = await ethers.getSigners();
    const TicketToken = await ethers.getContractFactory("TicketToken");

    await expect(
      TicketToken.deploy("Event Ticket", "ETIX", ethers.parseEther("0.01"), ethers.ZeroAddress, owner.address)
    ).to.be.revertedWith("TicketToken: vendor is zero address");
  });

  it("mints when buyer pays exact ETH", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();

    await expect(token.connect(buyer).buyTickets(1, { value: ticketPrice }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, 1n, ticketPrice);

    const bal = await token.balanceOf(buyer.address);
    expect(bal).to.equal(ethers.parseUnits("1", 18));
  });

  it("mints the right amount for multiple tickets", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const count = 3n;
    const totalCost = ticketPrice * count;

    await expect(token.connect(buyer).buyTickets(count, { value: totalCost }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, count, totalCost);

    expect(await token.balanceOf(buyer.address)).to.equal(ethers.parseUnits("3", 18));
    expect(await ethers.provider.getBalance(await token.getAddress())).to.equal(totalCost);
  });

  it("reverts when buying zero tickets", async function () {
    const { token, buyer } = await deployFixture();

    await expect(token.connect(buyer).buyTickets(0, { value: 0n })).to.be.revertedWith(
      "TicketToken: zero ticket count"
    );
  });

  it("reverts on wrong ETH amount", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const wrong = ticketPrice - 1n;

    await expect(token.connect(buyer).buyTickets(1, { value: wrong })).to.be.revertedWith(
      "TicketToken: incorrect ETH amount"
    );
  });

  it("allows owner to withdraw ETH from purchases", async function () {
    const { token, owner, buyer, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });

    const addr = await token.getAddress();
    expect(await ethers.provider.getBalance(addr)).to.equal(ticketPrice);

    await token.connect(owner).withdrawEth();

    expect(await ethers.provider.getBalance(addr)).to.equal(0n);
  });

  it("reverts withdrawEth when called by non-owner", async function () {
    const { token, buyer, ticketPrice, vendor } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });
    await expect(token.connect(vendor).withdrawEth()).to.be.revertedWithCustomError(
      token,
      "OwnableUnauthorizedAccount"
    );
  });

  it("allows owner to update ticket price and enforces new price", async function () {
    const { token, owner, buyer } = await deployFixture();
    const newPrice = ethers.parseEther("0.02");

    await expect(token.connect(owner).setTicketPriceWei(newPrice))
      .to.emit(token, "TicketPriceUpdated")
      .withArgs(newPrice);
    expect(await token.ticketPriceWei()).to.equal(newPrice);

    await expect(token.connect(buyer).buyTickets(1, { value: ethers.parseEther("0.01") })).to.be.revertedWith(
      "TicketToken: incorrect ETH amount"
    );

    await expect(token.connect(buyer).buyTickets(1, { value: newPrice }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, 1n, newPrice);
  });

  it("reverts setTicketPriceWei when called by non-owner", async function () {
    const { token, buyer } = await deployFixture();

    await expect(token.connect(buyer).setTicketPriceWei(1n)).to.be.revertedWithCustomError(
      token,
      "OwnableUnauthorizedAccount"
    );
  });

  it("allows owner to update vendor", async function () {
    const { token, owner, buyer } = await deployFixture();

    await expect(token.connect(owner).setVendor(buyer.address))
      .to.emit(token, "VendorUpdated")
      .withArgs(buyer.address);
    expect(await token.vendor()).to.equal(buyer.address);
  });

  it("reverts setVendor when new vendor is zero address", async function () {
    const { token, owner } = await deployFixture();

    await expect(token.connect(owner).setVendor(ethers.ZeroAddress)).to.be.revertedWith(
      "TicketToken: vendor is zero address"
    );
  });

  it("reverts setVendor when called by non-owner", async function () {
    const { token, buyer } = await deployFixture();

    await expect(token.connect(buyer).setVendor(buyer.address)).to.be.revertedWithCustomError(
      token,
      "OwnableUnauthorizedAccount"
    );
  });

  it("reverts when purchase would exceed the 100-ticket cap", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const one = ethers.parseUnits("1", 18);

    await token.connect(buyer).buyTickets(100, { value: ticketPrice * 100n });
    expect(await token.totalSupply()).to.equal(one * 100n);

    await expect(
      token.connect(buyer).buyTickets(1, { value: ticketPrice })
    ).to.be.revertedWith("TicketToken: ticket cap exceeded");
  });

  it("lets holder transfer tokens to vendor", async function () {
    const { token, buyer, vendor, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });
    const oneToken = ethers.parseUnits("1", 18);

    await token.connect(buyer).transfer(vendor.address, oneToken);
    expect(await token.balanceOf(vendor.address)).to.equal(oneToken);
    expect(await token.balanceOf(buyer.address)).to.equal(0n);
  });
});

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
    expect(await token.decimals()).to.equal(0n);
  });

  it("reverts deploy when vendor is zero address", async function () {
    const [owner] = await ethers.getSigners();
    const TicketToken = await ethers.getContractFactory("TicketToken");

    await expect(
      TicketToken.deploy("Event Ticket", "ETIX", ethers.parseEther("0.01"), ethers.ZeroAddress, owner.address)
    ).to.be.revertedWith("TicketToken: vendor is zero address");
  });

  it("reverts deploy when ticket price is zero", async function () {
    const [owner, vendor] = await ethers.getSigners();
    const TicketToken = await ethers.getContractFactory("TicketToken");

    await expect(
      TicketToken.deploy("Event Ticket", "ETIX", 0n, vendor.address, owner.address)
    ).to.be.revertedWith("TicketToken: price is zero");
  });

  it("mints when buyer pays exact ETH", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();

    await expect(token.connect(buyer).buyTickets(1, { value: ticketPrice }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, 1n, ticketPrice);

    expect(await token.balanceOf(buyer.address)).to.equal(1n);
  });

  it("mints the right amount for multiple tickets", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const count = 3n;
    const totalCost = ticketPrice * count;

    await expect(token.connect(buyer).buyTickets(count, { value: totalCost }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, count, totalCost);

    expect(await token.balanceOf(buyer.address)).to.equal(count);
    expect(await ethers.provider.getBalance(await token.getAddress())).to.equal(totalCost);
  });

  it("refunds ETH when buyer overpays", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const overpay = ticketPrice + ethers.parseEther("0.005");
    const buyerBefore = await ethers.provider.getBalance(buyer.address);

    const tx = await token.connect(buyer).buyTickets(1, { value: overpay });
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * receipt.gasPrice;
    const buyerAfter = await ethers.provider.getBalance(buyer.address);

    expect(await token.balanceOf(buyer.address)).to.equal(1n);
    expect(buyerBefore - buyerAfter - gasCost).to.equal(ticketPrice);
  });

  it("reverts when buying zero tickets", async function () {
    const { token, buyer } = await deployFixture();

    await expect(token.connect(buyer).buyTickets(0, { value: 0n })).to.be.revertedWith(
      "TicketToken: zero ticket count"
    );
  });

  it("reverts on insufficient ETH", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const wrong = ticketPrice - 1n;

    await expect(token.connect(buyer).buyTickets(1, { value: wrong })).to.be.revertedWith(
      "TicketToken: insufficient ETH"
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

  it("reverts withdrawEth when contract balance is zero", async function () {
    const { token, owner } = await deployFixture();

    await expect(token.connect(owner).withdrawEth()).to.be.revertedWith("TicketToken: nothing to withdraw");
  });

  it("allows owner to update ticket price and enforces new price", async function () {
    const { token, owner, buyer } = await deployFixture();
    const newPrice = ethers.parseEther("0.02");

    await expect(token.connect(owner).setTicketPriceWei(newPrice))
      .to.emit(token, "TicketPriceUpdated")
      .withArgs(newPrice);
    expect(await token.ticketPriceWei()).to.equal(newPrice);

    await expect(token.connect(buyer).buyTickets(1, { value: ethers.parseEther("0.01") })).to.be.revertedWith(
      "TicketToken: insufficient ETH"
    );

    await expect(token.connect(buyer).buyTickets(1, { value: newPrice }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, 1n, newPrice);
  });

  it("reverts setTicketPriceWei when price is zero", async function () {
    const { token, owner } = await deployFixture();

    await expect(token.connect(owner).setTicketPriceWei(0n)).to.be.revertedWith("TicketToken: price is zero");
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

    await token.connect(buyer).buyTickets(100, { value: ticketPrice * 100n });
    expect(await token.totalSupply()).to.equal(100n);

    await expect(
      token.connect(buyer).buyTickets(1, { value: ticketPrice })
    ).to.be.revertedWith("TicketToken: ticket cap exceeded");
  });

  it("returns tickets to vendor via transferTicketsToVendor", async function () {
    const { token, buyer, vendor, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });

    await expect(token.connect(buyer).transferTicketsToVendor(1))
      .to.emit(token, "TicketsReturnedToVendor")
      .withArgs(buyer.address, 1n);

    expect(await token.balanceOf(vendor.address)).to.equal(1n);
    expect(await token.balanceOf(buyer.address)).to.equal(0n);
  });

  it("reverts transferTicketsToVendor with zero count", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });
    await expect(token.connect(buyer).transferTicketsToVendor(0)).to.be.revertedWith(
      "TicketToken: zero ticket count"
    );
  });

  it("exposes MAX_TICKETS and standard ERC-20 metadata", async function () {
    const { token } = await deployFixture();

    expect(await token.MAX_TICKETS()).to.equal(100n);
    expect(await token.decimals()).to.equal(0n);
    expect(await token.totalSupply()).to.equal(0n);
  });

  it("allows buying exactly up to the cap in one purchase", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(100, { value: ticketPrice * 100n });
    expect(await token.totalSupply()).to.equal(100n);
    expect(await token.balanceOf(buyer.address)).to.equal(100n);
  });

  it("reverts when buyer underpays for multiple tickets", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const count = 2n;

    await expect(
      token.connect(buyer).buyTickets(count, { value: ticketPrice })
    ).to.be.revertedWith("TicketToken: insufficient ETH");
  });

  it("allows peer-to-peer ERC-20 transfer between holders", async function () {
    const { token, buyer, owner, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(2, { value: ticketPrice * 2n });
    await token.connect(buyer).transfer(owner.address, 1n);

    expect(await token.balanceOf(owner.address)).to.equal(1n);
    expect(await token.balanceOf(buyer.address)).to.equal(1n);
  });

  it("withdrawEth sends accumulated ETH to the owner", async function () {
    const { token, owner, buyer, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });
    const ownerBefore = await ethers.provider.getBalance(owner.address);

    const tx = await token.connect(owner).withdrawEth();
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * receipt.gasPrice;
    const ownerAfter = await ethers.provider.getBalance(owner.address);

    expect(ownerAfter + gasCost - ownerBefore).to.equal(ticketPrice);
    expect(await ethers.provider.getBalance(await token.getAddress())).to.equal(0n);
  });

  it("accumulates ETH from multiple purchases until withdrawn", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();
    const addr = await token.getAddress();

    await token.connect(buyer).buyTickets(2, { value: ticketPrice * 2n });
    expect(await ethers.provider.getBalance(addr)).to.equal(ticketPrice * 2n);
  });
});

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

  it("mints when buyer pays exact ETH", async function () {
    const { token, buyer, ticketPrice } = await deployFixture();

    await expect(token.connect(buyer).buyTickets(1, { value: ticketPrice }))
      .to.emit(token, "TicketPurchased")
      .withArgs(buyer.address, 1n, ticketPrice);

    const bal = await token.balanceOf(buyer.address);
    expect(bal).to.equal(ethers.parseUnits("1", 18));
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

  it("lets holder transfer tokens to vendor (return flow)", async function () {
    const { token, buyer, vendor, ticketPrice } = await deployFixture();

    await token.connect(buyer).buyTickets(1, { value: ticketPrice });
    const oneToken = ethers.parseUnits("1", 18);

    await token.connect(buyer).transfer(vendor.address, oneToken);
    expect(await token.balanceOf(vendor.address)).to.equal(oneToken);
    expect(await token.balanceOf(buyer.address)).to.equal(0n);
  });
});

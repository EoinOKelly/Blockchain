const hre = require("hardhat");

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("Set CONTRACT_ADDRESS to the deployed TicketToken address.");
  }

  const ticketPriceEth = process.env.TICKET_PRICE_ETH || "0.01";
  const ticketPriceWei = hre.ethers.parseEther(ticketPriceEth);

  const [deployer] = await hre.ethers.getSigners();
  const vendorAddress =
    process.env.VENDOR_ADDRESS && process.env.VENDOR_ADDRESS.startsWith("0x")
      ? process.env.VENDOR_ADDRESS
      : deployer.address;

  await hre.run("verify:verify", {
    address,
    constructorArguments: ["Event Ticket", "ETIX", ticketPriceWei, vendorAddress, deployer.address],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

"use strict";

/**
 * Base app config. After deploying to Sepolia, run `backend` deploy script or edit
 * `deployed.inc.js` with your contract address and vendor address.
 */
window.TICKET_APP_CONFIG = {
  chainIdHex: "0xaa36a7",
  chainId: 11155111,
  chainName: "Sepolia",
  readOnlyRpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  explorerTxUrlPrefix: "https://sepolia.etherscan.io/tx/",
  ticketTokenAddress: "",
  vendorAddress: "",
  ticketPriceWei: "",
};

/** Minimal ABI for purchase and on-chain price. */
window.TICKET_CONTRACT_ABI = [
  "function buyTickets(uint256 ticketCount) payable",
  "function ticketPriceWei() view returns (uint256)",
  "function vendor() view returns (address)",
  "function decimals() view returns (uint8)",
];

/** ERC-20 reads + transfer back to vendor. */
window.TICKET_ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

window.getTicketRuntimeConfig = function () {
  const base = window.TICKET_APP_CONFIG || {};
  const dep = window.TICKET_DEPLOYMENT || {};
  return {
    chainIdHex: base.chainIdHex,
    chainId: base.chainId,
    chainName: base.chainName,
    readOnlyRpcUrl: base.readOnlyRpcUrl,
    explorerTxUrlPrefix: base.explorerTxUrlPrefix,
    ticketTokenAddress: dep.ticketTokenAddress || base.ticketTokenAddress || "",
    vendorAddress: dep.vendorAddress || base.vendorAddress || "",
    ticketPriceWei: dep.ticketPriceWei || base.ticketPriceWei || "",
  };
};

window.formatTxExplorerLink = function (txHash, label) {
  const prefix =
    window.getTicketRuntimeConfig().explorerTxUrlPrefix || "https://sepolia.etherscan.io/tx/";
  const url = prefix + txHash;
  const text = label || txHash;
  return `${text} — ${url}`;
};

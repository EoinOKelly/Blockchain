"use strict";

function el(id) {
  return document.getElementById(id);
}

let browserProvider = null;
let signer = null;
let connectedWalletAddress = "";
let transferInProgress = false;

function setStatus(message, isError = false) {
  const statusMessage = el("statusMessage");
  if (!statusMessage) {
    return;
  }
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setResult(text) {
  const resultValue = el("resultValue");
  if (resultValue) {
    resultValue.textContent = text;
  }
}

function formatAddress(address) {
  if (!address) {
    return "Not connected";
  }
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

async function getReadOnlyProvider() {
  const cfg = window.getTicketRuntimeConfig();
  return new ethers.JsonRpcProvider(cfg.readOnlyRpcUrl);
}

async function ensureSepolia(provider) {
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 11155111) {
    throw new Error("Please switch your wallet to the Sepolia network.");
  }
}

function getInjectedEthereum() {
  const eth = window.ethereum;
  if (!eth) {
    return null;
  }
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    return (
      eth.providers.find((p) => p.isMetaMask) ||
      eth.providers.find((p) => p.isCoinbaseWallet) ||
      eth.providers[0]
    );
  }
  return eth;
}

function renderVendorAddress() {
  const cfg = window.getTicketRuntimeConfig();
  const vendorAddressValue = el("vendorAddressValue");
  if (vendorAddressValue) {
    vendorAddressValue.textContent =
      cfg.vendorAddress || "Not configured (deploy & fill deployed.inc.js)";
  }
}

async function connectWallet() {
  const injected = getInjectedEthereum();
  if (!injected) {
    setStatus(
      "No injected wallet. Serve the site over HTTP and use a browser with MetaMask (or similar).",
      true,
    );
    return;
  }
  try {
    browserProvider = new ethers.BrowserProvider(injected);
    await browserProvider.send("eth_requestAccounts", []);
    await ensureSepolia(browserProvider);
    signer = await browserProvider.getSigner();
    connectedWalletAddress = await signer.getAddress();
    const senderWalletValue = el("senderWalletValue");
    if (senderWalletValue) {
      senderWalletValue.textContent = connectedWalletAddress;
    }
    setStatus(`Connected: ${formatAddress(connectedWalletAddress)}`);
    setResult("Connected. Check balance or transfer one ticket to the vendor.");
    await refreshTicketBalance();
  } catch (error) {
    setStatus(error.message || "Failed to connect wallet.", true);
  }
}

async function refreshTicketBalance() {
  const cfg = window.getTicketRuntimeConfig();
  const ticketBalanceValue = el("ticketBalanceValue");
  if (!ticketBalanceValue) {
    return;
  }
  if (!cfg.ticketTokenAddress || !connectedWalletAddress) {
    ticketBalanceValue.textContent = cfg.ticketTokenAddress ? "-" : "Not configured";
    return;
  }
  try {
    const provider = await getReadOnlyProvider();
    const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, provider);
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(connectedWalletAddress),
      contract.decimals().catch(() => 0),
    ]);
    ticketBalanceValue.textContent = ethers.formatUnits(raw, decimals);
  } catch (error) {
    ticketBalanceValue.textContent = "-";
    setStatus(error.message || "Could not read ticket balance.", true);
  }
}

async function transferOneTicketToVendor() {
  if (transferInProgress) {
    return;
  }
  const cfg = window.getTicketRuntimeConfig();
  if (!signer) {
    setStatus("Connect your wallet first.", true);
    return;
  }
  if (!cfg.ticketTokenAddress || !cfg.vendorAddress) {
    setStatus("Contract or vendor address missing. Update deployed.inc.js.", true);
    return;
  }

  const transferToVendorBtn = el("transferToVendorBtn");
  if (!transferToVendorBtn) {
    return;
  }

  transferInProgress = true;
  transferToVendorBtn.disabled = true;
  setStatus("Submitting token transfer to vendor...");
  setResult("Waiting for wallet confirmation...");

  try {
    const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, signer);
    const tx = await contract.transferTicketsToVendor(1);

    setResult(window.formatTxExplorerLink(tx.hash, "Submitted"));
    await tx.wait();
    setStatus("Transferred 1 ticket token to the vendor (no ETH refund).");
    setResult(window.formatTxExplorerLink(tx.hash, "Confirmed"));
    await refreshTicketBalance();
  } catch (error) {
    setStatus(error.message || "Transfer failed.", true);
    setResult("Transaction failed or was rejected.");
  } finally {
    transferInProgress = false;
    transferToVendorBtn.disabled = false;
  }
}

function init() {
  renderVendorAddress();
  const senderWalletValue = el("senderWalletValue");
  const ticketBalanceValue = el("ticketBalanceValue");
  if (senderWalletValue) {
    senderWalletValue.textContent = "Not connected";
  }
  if (ticketBalanceValue) {
    ticketBalanceValue.textContent = "-";
  }
  setResult("Awaiting action");
}

function bindTransferPage() {
  const connectWalletBtn = el("connectWalletBtn");
  const checkBalanceBtn = el("checkBalanceBtn");
  const transferToVendorBtn = el("transferToVendorBtn");
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", connectWallet);
  }
  if (checkBalanceBtn) {
    checkBalanceBtn.addEventListener("click", refreshTicketBalance);
  }
  if (transferToVendorBtn) {
    transferToVendorBtn.addEventListener("click", transferOneTicketToVendor);
  }
  init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindTransferPage);
} else {
  bindTransferPage();
}

globalThis.__ticketDappTestHooks = globalThis.__ticketDappTestHooks || {};
globalThis.__ticketDappTestHooks.transfer = {
  connectWallet,
  transferOneTicketToVendor,
  refreshTicketBalance,
  bindTransferPage,
};

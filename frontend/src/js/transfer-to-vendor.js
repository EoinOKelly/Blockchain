"use strict";

const connectWalletBtn = document.getElementById("connectWalletBtn");
const checkBalanceBtn = document.getElementById("checkBalanceBtn");
const transferToVendorBtn = document.getElementById("transferToVendorBtn");
const statusMessage = document.getElementById("statusMessage");
const vendorAddressValue = document.getElementById("vendorAddressValue");
const senderWalletValue = document.getElementById("senderWalletValue");
const ticketBalanceValue = document.getElementById("ticketBalanceValue");
const resultValue = document.getElementById("resultValue");

let browserProvider = null;
let signer = null;
let connectedWalletAddress = "";
let transferInProgress = false;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setResult(text) {
  resultValue.textContent = text;
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
  vendorAddressValue.textContent =
    cfg.vendorAddress || "Not configured (deploy & fill deployed.inc.js)";
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
    senderWalletValue.textContent = connectedWalletAddress;
    setStatus(`Connected: ${formatAddress(connectedWalletAddress)}`);
    setResult("Connected. Check balance or transfer one ticket to the vendor.");
    await refreshTicketBalance();
  } catch (error) {
    setStatus(error.message || "Failed to connect wallet.", true);
  }
}

async function refreshTicketBalance() {
  const cfg = window.getTicketRuntimeConfig();
  if (!cfg.ticketTokenAddress || !connectedWalletAddress) {
    ticketBalanceValue.textContent = cfg.ticketTokenAddress ? "-" : "Not configured";
    return;
  }
  try {
    const provider = await getReadOnlyProvider();
    const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, provider);
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(connectedWalletAddress),
      contract.decimals().catch(() => 18),
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

  transferInProgress = true;
  transferToVendorBtn.disabled = true;
  setStatus("Submitting token transfer to vendor...");
  setResult("Waiting for wallet confirmation...");

  try {
    const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, signer);
    const decimals = await contract.decimals().catch(() => 18);
    const one = ethers.parseUnits("1", decimals);
    const tx = await contract.transfer(cfg.vendorAddress, one);

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
  senderWalletValue.textContent = "Not connected";
  ticketBalanceValue.textContent = "-";
  setResult("Awaiting action");
}

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

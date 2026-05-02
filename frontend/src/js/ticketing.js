"use strict";

const APP_CONFIG = window.getTicketRuntimeConfig();

const connectWalletBtn = document.getElementById("connectWalletBtn");
const useConnectedBtn = document.getElementById("useConnectedBtn");
const checkBalancesBtn = document.getElementById("checkBalancesBtn");
const buyTicketBtn = document.getElementById("buyTicketBtn");
const walletAddressInput = document.getElementById("walletAddressInput");
const statusMessage = document.getElementById("statusMessage");
const ticketPriceValue = document.getElementById("ticketPriceValue");
const selectedWalletValue = document.getElementById("selectedWalletValue");
const ethBalanceValue = document.getElementById("ethBalanceValue");
const ticketBalanceValue = document.getElementById("ticketBalanceValue");
const resultValue = document.getElementById("resultValue");

let browserProvider = null;
let signer = null;
let connectedWalletAddress = "";
let checkingInProgress = false;
let buyingInProgress = false;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setResult(message) {
  resultValue.textContent = message;
}

function showConnectedWallet(address) {
  connectedWalletAddress = address;
  selectedWalletValue.textContent = address;
  useConnectedBtn.disabled = false;
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

function noWalletHelpMessage() {
  const hints = [];
  if (window.location.protocol === "file:") {
    hints.push(
      "You opened this page as a local file (file://). Browser extensions usually do not inject window.ethereum there. Serve the folder over HTTP (for example run npx --yes serve src -p 5173 from frontend/src, then open pages via http://localhost:5173/pages/…).",
    );
  }
  hints.push(
    "Use Chrome or Edge with MetaMask (or another Web3 wallet) installed and unlocked. Embedded IDE previews often have no wallet extension.",
  );
  hints.push("Install from https://metamask.io if you do not have a wallet yet.");
  return hints.join(" ");
}

async function connectWallet() {
  const injected = getInjectedEthereum();
  if (!injected) {
    setStatus(noWalletHelpMessage(), true);
    setResult("Cannot connect: no injected wallet.");
    return;
  }

  try {
    browserProvider = new ethers.BrowserProvider(injected);
    await browserProvider.send("eth_requestAccounts", []);
    await ensureSepolia(browserProvider);
    signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    showConnectedWallet(address);
    setStatus(`Connected: ${formatAddress(address)}`);
    setResult("Wallet connected. Ready to check balances.");
    await refreshDisplayedPrice();
  } catch (error) {
    setStatus(error.message || "Failed to connect wallet.", true);
    setResult("Wallet connection failed.");
  }
}

function resolveWalletToCheck() {
  const entered = walletAddressInput.value.trim();
  if (entered) {
    return entered;
  }
  return connectedWalletAddress;
}

async function readTicketBalance(provider, walletAddress) {
  const cfg = window.getTicketRuntimeConfig();
  if (!cfg.ticketTokenAddress) {
    return { display: "Not configured", numeric: null };
  }

  const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, provider);
  const [balanceRaw, decimals] = await Promise.all([
    contract.balanceOf(walletAddress),
    contract.decimals().catch(() => 18),
  ]);

  const balance = Number(ethers.formatUnits(balanceRaw, decimals));
  return { display: `${balance}`, numeric: balance };
}

async function checkBalances() {
  if (checkingInProgress) {
    return;
  }

  const walletAddress = resolveWalletToCheck();
  if (!walletAddress) {
    setStatus("Enter a wallet address or connect your wallet first.", true);
    return;
  }

  if (!ethers.isAddress(walletAddress)) {
    setStatus("Wallet address is invalid.", true);
    return;
  }

  checkingInProgress = true;
  checkBalancesBtn.disabled = true;
  setStatus("Checking balances...");

  try {
    const provider = await getReadOnlyProvider();
    const [ethBalanceRaw, ticketBalance] = await Promise.all([
      provider.getBalance(walletAddress),
      readTicketBalance(provider, walletAddress),
    ]);

    const ethBalance = Number(ethers.formatEther(ethBalanceRaw)).toFixed(6);
    selectedWalletValue.textContent = walletAddress;
    ethBalanceValue.textContent = `${ethBalance} ETH`;
    ticketBalanceValue.textContent = ticketBalance.display;

    const ticketHint =
      ticketBalance.numeric !== null && ticketBalance.numeric > 0
        ? "Wallet currently holds at least one ticket token."
        : "No ticket token currently detected for this wallet.";

    setStatus("Balances refreshed.");
    setResult(ticketHint);
  } catch (error) {
    setStatus(error.message || "Failed to check balances.", true);
    setResult("Balance lookup failed.");
  } finally {
    checkingInProgress = false;
    checkBalancesBtn.disabled = false;
  }
}

async function readOnChainTicketPriceWei() {
  const cfg = window.getTicketRuntimeConfig();
  if (!cfg.ticketTokenAddress) {
    return null;
  }
  const provider = await getReadOnlyProvider();
  const contract = new ethers.Contract(
    cfg.ticketTokenAddress,
    window.TICKET_CONTRACT_ABI,
    provider,
  );
  return contract.ticketPriceWei();
}

async function refreshDisplayedPrice() {
  if (!ticketPriceValue) {
    return;
  }
  try {
    const wei = await readOnChainTicketPriceWei();
    if (wei !== null) {
      ticketPriceValue.textContent = `${ethers.formatEther(wei)} ETH`;
      return;
    }
  } catch {
    /* fall through */
  }
  ticketPriceValue.textContent = "Deploy contract & fill deployed.inc.js";
}

async function buyOneTicket() {
  if (buyingInProgress) {
    return;
  }

  if (!signer) {
    setStatus("Connect a wallet before buying a ticket.", true);
    return;
  }

  const cfg = window.getTicketRuntimeConfig();
  if (!cfg.ticketTokenAddress) {
    setStatus(
      "Ticket contract address is not set. Deploy TicketToken and update deployed.inc.js.",
      true,
    );
    return;
  }

  buyingInProgress = true;
  buyTicketBtn.disabled = true;
  setStatus("Submitting purchase transaction...");
  setResult("Waiting for wallet confirmation...");

  try {
    const contract = new ethers.Contract(
      cfg.ticketTokenAddress,
      window.TICKET_CONTRACT_ABI,
      signer,
    );
    const priceWei = await contract.ticketPriceWei();
    const tx = await contract.buyTickets(1, { value: priceWei });

    const explorerLine = window.formatTxExplorerLink(tx.hash, "Submitted");
    setResult(explorerLine);
    await tx.wait();
    setStatus("Ticket purchase confirmed.");
    setResult(window.formatTxExplorerLink(tx.hash, "Confirmed"));
    await checkBalances();
  } catch (error) {
    setStatus(error.message || "Ticket purchase failed.", true);
    setResult("Transaction failed or was rejected.");
  } finally {
    buyingInProgress = false;
    buyTicketBtn.disabled = false;
  }
}

function useConnectedWallet() {
  if (!connectedWalletAddress) {
    return;
  }
  walletAddressInput.value = connectedWalletAddress;
  setStatus(`Using connected wallet: ${formatAddress(connectedWalletAddress)}`);
}

function init() {
  if (!ticketPriceValue || !selectedWalletValue) {
    return;
  }
  selectedWalletValue.textContent = "Not connected";
  ethBalanceValue.textContent = "-";
  const cfg = window.getTicketRuntimeConfig();
  ticketBalanceValue.textContent = cfg.ticketTokenAddress ? "-" : "Not configured";
  setResult("Awaiting action");
  refreshDisplayedPrice();
}

if (connectWalletBtn) {
  connectWalletBtn.addEventListener("click", connectWallet);
}
if (useConnectedBtn) {
  useConnectedBtn.addEventListener("click", useConnectedWallet);
}
if (checkBalancesBtn) {
  checkBalancesBtn.addEventListener("click", checkBalances);
}
if (buyTicketBtn) {
  buyTicketBtn.addEventListener("click", buyOneTicket);
}

init();

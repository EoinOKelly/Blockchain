"use strict";

function el(id) {
  return document.getElementById(id);
}

let browserProvider = null;
let signer = null;
let connectedWalletAddress = "";
let checkingInProgress = false;
let buyingInProgress = false;

function setStatus(message, isError = false) {
  const statusMessage = el("statusMessage");
  if (!statusMessage) {
    return;
  }
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setResult(message) {
  const resultValue = el("resultValue");
  if (resultValue) {
    resultValue.textContent = message;
  }
}

function showConnectedWallet(address) {
  connectedWalletAddress = address;
  const selectedWalletValue = el("selectedWalletValue");
  const useConnectedBtn = el("useConnectedBtn");
  if (selectedWalletValue) {
    selectedWalletValue.textContent = address;
  }
  if (useConnectedBtn) {
    useConnectedBtn.disabled = false;
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
  const walletAddressInput = el("walletAddressInput");
  const entered = walletAddressInput ? walletAddressInput.value.trim() : "";
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
    contract.decimals().catch(() => 0),
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

  const checkBalancesBtn = el("checkBalancesBtn");
  if (!checkBalancesBtn) {
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
    const selectedWalletValue = el("selectedWalletValue");
    const ethBalanceValue = el("ethBalanceValue");
    const ticketBalanceValue = el("ticketBalanceValue");
    if (selectedWalletValue) {
      selectedWalletValue.textContent = walletAddress;
    }
    if (ethBalanceValue) {
      ethBalanceValue.textContent = `${ethBalance} ETH`;
    }
    if (ticketBalanceValue) {
      ticketBalanceValue.textContent = ticketBalance.display;
    }

    const ticketHint =
      ticketBalance.numeric !== null && ticketBalance.numeric > 0
        ? "Wallet currently holds at least one ticket token."
        : "No ticket token currently detected for this wallet.";

    await refreshTicketsRemaining();

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

async function readTicketsRemaining() {
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
  const [maxTickets, totalSupply, decimals] = await Promise.all([
    contract.MAX_TICKETS(),
    contract.totalSupply(),
    contract.decimals().catch(() => 0),
  ]);
  const oneTicket = 10n ** BigInt(decimals);
  const minted = totalSupply / oneTicket;
  const remaining = Number(maxTickets - minted);
  return Math.max(0, remaining);
}

async function refreshTicketsRemaining() {
  const ticketsRemainingValue = el("ticketsRemainingValue");
  if (!ticketsRemainingValue) {
    return;
  }
  try {
    const remaining = await readTicketsRemaining();
    ticketsRemainingValue.textContent =
      remaining === null ? "-" : String(remaining);
  } catch {
    ticketsRemainingValue.textContent = "-";
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
  const ticketPriceValue = el("ticketPriceValue");
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

  const buyTicketBtn = el("buyTicketBtn");
  if (!buyTicketBtn) {
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
    await refreshTicketsRemaining();
  } catch (error) {
    const msg = error.message || "Ticket purchase failed.";
    setStatus(
      msg.includes("ticket cap exceeded")
        ? "All 100 tickets have been sold. No more can be minted."
        : msg,
      true,
    );
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
  const walletAddressInput = el("walletAddressInput");
  if (walletAddressInput) {
    walletAddressInput.value = connectedWalletAddress;
  }
  setStatus(`Using connected wallet: ${formatAddress(connectedWalletAddress)}`);
}

function init() {
  const ticketPriceValue = el("ticketPriceValue");
  const selectedWalletValue = el("selectedWalletValue");
  if (!ticketPriceValue || !selectedWalletValue) {
    return;
  }
  selectedWalletValue.textContent = "Not connected";
  const ethBalanceValue = el("ethBalanceValue");
  const ticketBalanceValue = el("ticketBalanceValue");
  if (ethBalanceValue) {
    ethBalanceValue.textContent = "-";
  }
  const cfg = window.getTicketRuntimeConfig();
  if (ticketBalanceValue) {
    ticketBalanceValue.textContent = cfg.ticketTokenAddress ? "-" : "Not configured";
  }
  setResult("Awaiting action");
  refreshDisplayedPrice();
  refreshTicketsRemaining();
}

function bindTicketingPage() {
  const connectWalletBtn = el("connectWalletBtn");
  const useConnectedBtn = el("useConnectedBtn");
  const checkBalancesBtn = el("checkBalancesBtn");
  const buyTicketBtn = el("buyTicketBtn");
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindTicketingPage);
} else {
  bindTicketingPage();
}

globalThis.__ticketDappTestHooks = globalThis.__ticketDappTestHooks || {};
globalThis.__ticketDappTestHooks.ticketing = {
  connectWallet,
  checkBalances,
  buyOneTicket,
  useConnectedWallet,
  bindTicketingPage,
};

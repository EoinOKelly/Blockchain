"use strict";

function el(id) {
  return document.getElementById(id);
}

let refreshInProgress = false;

function setStatus(message, isError = false) {
  const statusMessage = el("statusMessage");
  if (!statusMessage) {
    return;
  }
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setBalancePlaceholders() {
  const resolvedAddressValue = el("resolvedAddressValue");
  const ethBalanceValue = el("ethBalanceValue");
  const ticketBalanceValue = el("ticketBalanceValue");
  if (resolvedAddressValue) {
    resolvedAddressValue.textContent = "-";
  }
  if (ethBalanceValue) {
    ethBalanceValue.textContent = "-";
  }
  if (ticketBalanceValue) {
    ticketBalanceValue.textContent = "-";
  }
}

async function getReadOnlyProvider() {
  const cfg = window.getTicketRuntimeConfig();
  return new ethers.JsonRpcProvider(cfg.readOnlyRpcUrl);
}

async function readTicketBalance(provider, walletAddress) {
  const cfg = window.getTicketRuntimeConfig();
  const ticketBalanceValue = el("ticketBalanceValue");
  if (!ticketBalanceValue || !cfg.ticketTokenAddress) {
    return { display: ticketBalanceValue ? "Not configured" : "-", numeric: null };
  }

  const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, provider);
  const [balanceRaw, decimals] = await Promise.all([
    contract.balanceOf(walletAddress),
    contract.decimals().catch(() => 0),
  ]);

  const balance = Number(ethers.formatUnits(balanceRaw, decimals));
  return { display: String(balance), numeric: balance };
}

async function fetchSepoliaBalance() {
  if (refreshInProgress) {
    return;
  }

  const walletAddressInput = el("walletAddressInput");
  const refreshBalanceBtn = el("refreshBalanceBtn");
  if (!walletAddressInput || !refreshBalanceBtn) {
    return;
  }

  const walletAddress = walletAddressInput.value.trim();
  if (!walletAddress) {
    setStatus("Enter a wallet address to check.", true);
    setBalancePlaceholders();
    return;
  }

  if (!ethers.isAddress(walletAddress)) {
    setStatus("Invalid wallet address format.", true);
    setBalancePlaceholders();
    return;
  }

  refreshInProgress = true;
  refreshBalanceBtn.disabled = true;
  setStatus("Checking Sepolia balances...");

  try {
    const provider = await getReadOnlyProvider();
    const [balanceRaw, ticketBalance] = await Promise.all([
      provider.getBalance(walletAddress),
      readTicketBalance(provider, walletAddress),
    ]);
    const balanceEth = Number(ethers.formatEther(balanceRaw)).toFixed(6);

    const resolvedAddressValue = el("resolvedAddressValue");
    const ethBalanceValue = el("ethBalanceValue");
    const ticketBalanceValue = el("ticketBalanceValue");
    if (resolvedAddressValue) {
      resolvedAddressValue.textContent = walletAddress;
    }
    if (ethBalanceValue) {
      ethBalanceValue.textContent = `${balanceEth} ETH`;
    }
    if (ticketBalanceValue) {
      ticketBalanceValue.textContent = ticketBalance.display;
    }
    setStatus("Balances refreshed.");
  } catch (error) {
    setStatus(error.message || "Could not fetch balances right now.", true);
    setBalancePlaceholders();
  } finally {
    refreshInProgress = false;
    refreshBalanceBtn.disabled = false;
  }
}

function bindBalancePage() {
  const refreshBalanceBtn = el("refreshBalanceBtn");
  if (refreshBalanceBtn) {
    refreshBalanceBtn.addEventListener("click", fetchSepoliaBalance);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindBalancePage);
} else {
  bindBalancePage();
}

globalThis.__ticketDappTestHooks = globalThis.__ticketDappTestHooks || {};
globalThis.__ticketDappTestHooks.blockchain = { fetchSepoliaBalance, bindBalancePage };

"use strict";

const walletAddressInput = document.getElementById("walletAddressInput");
const refreshBalanceBtn = document.getElementById("refreshBalanceBtn");
const statusMessage = document.getElementById("statusMessage");
const resolvedAddressValue = document.getElementById("resolvedAddressValue");
const ethBalanceValue = document.getElementById("ethBalanceValue");
const ticketBalanceValue = document.getElementById("ticketBalanceValue");

let refreshInProgress = false;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setBalancePlaceholders() {
  resolvedAddressValue.textContent = "-";
  ethBalanceValue.textContent = "-";
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
  if (!ticketBalanceValue || !cfg.ticketTokenAddress) {
    return { display: ticketBalanceValue ? "Not configured" : "-", numeric: null };
  }

  const contract = new ethers.Contract(cfg.ticketTokenAddress, window.TICKET_ERC20_ABI, provider);
  const [balanceRaw, decimals] = await Promise.all([
    contract.balanceOf(walletAddress),
    contract.decimals().catch(() => 18),
  ]);

  const balance = Number(ethers.formatUnits(balanceRaw, decimals));
  return { display: String(balance), numeric: balance };
}

async function fetchSepoliaBalance() {
  if (refreshInProgress) {
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

    resolvedAddressValue.textContent = walletAddress;
    ethBalanceValue.textContent = `${balanceEth} ETH`;
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

if (refreshBalanceBtn) {
  refreshBalanceBtn.addEventListener("click", fetchSepoliaBalance);
}

"use strict";

const walletAddressInput = document.getElementById("walletAddressInput");
const refreshBalanceBtn = document.getElementById("refreshBalanceBtn");
const statusMessage = document.getElementById("statusMessage");
const resolvedAddressValue = document.getElementById("resolvedAddressValue");
const ethBalanceValue = document.getElementById("ethBalanceValue");

const APP_CONFIG = {
  readOnlyRpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
};

let refreshInProgress = false;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function setBalancePlaceholders() {
  resolvedAddressValue.textContent = "-";
  ethBalanceValue.textContent = "-";
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
  setStatus("Checking Sepolia balance...");

  try {
    const provider = new ethers.JsonRpcProvider(APP_CONFIG.readOnlyRpcUrl);
    const balanceRaw = await provider.getBalance(walletAddress);
    const balanceEth = Number(ethers.formatEther(balanceRaw)).toFixed(6);

    resolvedAddressValue.textContent = walletAddress;
    ethBalanceValue.textContent = `${balanceEth} ETH`;
    setStatus("Balance refreshed.");
  } catch (error) {
    setStatus(error.message || "Could not fetch balance right now.", true);
    setBalancePlaceholders();
  } finally {
    refreshInProgress = false;
    refreshBalanceBtn.disabled = false;
  }
}

if (refreshBalanceBtn) {
  refreshBalanceBtn.addEventListener("click", fetchSepoliaBalance);
}

"use strict";

const createWalletBtn = document.getElementById("createWalletBtn");
const downloadWalletBtn = document.getElementById("downloadWalletBtn");
const statusMessage = document.getElementById("statusMessage");
const walletDetails = document.getElementById("walletDetails");
const walletAddress = document.getElementById("walletAddress");
const walletPrivateKey = document.getElementById("walletPrivateKey");
const walletMnemonic = document.getElementById("walletMnemonic");
const emptyState = document.getElementById("emptyState");

let currentWalletData = null;

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function renderWallet(data) {
  walletAddress.textContent = data.address;
  walletPrivateKey.textContent = data.privateKey;
  walletMnemonic.textContent = data.mnemonic || "Not available";
  walletDetails.classList.remove("hidden");
  emptyState.classList.add("hidden");
  downloadWalletBtn.disabled = false;
}

function createWallet() {
  try {
    const wallet = ethers.Wallet.createRandom();

    currentWalletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : null,
      createdAt: new Date().toISOString(),
      network: "sepolia"
    };

    renderWallet(currentWalletData);
    setStatus("Wallet created successfully.");
  } catch (error) {
    setStatus("Failed to create wallet. Please try again.", true);
    console.error(error);
  }
}

function downloadWallet() {
  if (!currentWalletData) {
    setStatus("Create a wallet first before downloading.", true);
    return;
  }

  const payload = JSON.stringify(currentWalletData, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `wallet-${currentWalletData.address}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  setStatus("Wallet JSON downloaded.");
}

createWalletBtn.addEventListener("click", createWallet);
downloadWalletBtn.addEventListener("click", downloadWallet);

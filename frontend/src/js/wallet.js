"use strict";

const createWalletBtn = document.getElementById("createWalletBtn");
const downloadWalletBtn = document.getElementById("downloadWalletBtn");
const statusMessage = document.getElementById("statusMessage");
const walletDetails = document.getElementById("walletDetails");
const walletAddress = document.getElementById("walletAddress");
const walletPrivateKey = document.getElementById("walletPrivateKey");
const walletMnemonic = document.getElementById("walletMnemonic");
const emptyState = document.getElementById("emptyState");
const copyAddressBtn = document.getElementById("copyAddressBtn");
const copyPrivateKeyBtn = document.getElementById("copyPrivateKeyBtn");
const openFaucetBtn = document.getElementById("openFaucetBtn");
const openExplorerBtn = document.getElementById("openExplorerBtn");

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

async function copyText(value, label) {
  if (!value) {
    setStatus(`No ${label.toLowerCase()} available to copy.`, true);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus(`${label} copied to clipboard.`);
  } catch (error) {
    setStatus(`Could not copy ${label.toLowerCase()}.`, true);
    console.error(error);
  }
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

function openSepoliaFaucet() {
  const url = "https://cloud.google.com/application/web3/faucet/ethereum/sepolia";
  window.open(url, "_blank", "noopener,noreferrer");
}

function openSepoliaExplorer() {
  if (!currentWalletData) {
    setStatus("Create a wallet first before opening the explorer.", true);
    return;
  }

  const url = `https://sepolia.etherscan.io/address/${currentWalletData.address}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

if (createWalletBtn) {
  createWalletBtn.addEventListener("click", createWallet);
}

if (downloadWalletBtn) {
  downloadWalletBtn.addEventListener("click", downloadWallet);
}

if (copyAddressBtn) {
  copyAddressBtn.addEventListener("click", () => copyText(currentWalletData?.address, "Address"));
}

if (copyPrivateKeyBtn) {
  copyPrivateKeyBtn.addEventListener("click", () =>
    copyText(currentWalletData?.privateKey, "Private key")
  );
}

if (openFaucetBtn) {
  openFaucetBtn.addEventListener("click", openSepoliaFaucet);
}

if (openExplorerBtn) {
  openExplorerBtn.addEventListener("click", openSepoliaExplorer);
}

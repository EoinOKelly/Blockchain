"use strict";

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

const APP_CONFIG = {
  chainIdHex: "0xaa36a7", // 11155111 Sepolia
  chainName: "Sepolia",
  readOnlyRpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  ticketPriceEth: "0.01",
  vendorAddress: "", // Fill with the venue treasury wallet to enable buys
  ticketTokenAddress: "", // Fill with deployed ticket token contract address
};

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

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
  return new ethers.JsonRpcProvider(APP_CONFIG.readOnlyRpcUrl);
}

async function ensureSepolia(provider) {
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 11155111) {
    throw new Error("Please switch your wallet to the Sepolia network.");
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("No wallet extension detected. Install MetaMask or similar.", true);
    return;
  }

  try {
    browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    await ensureSepolia(browserProvider);
    signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    showConnectedWallet(address);
    setStatus(`Connected: ${formatAddress(address)}`);
    setResult("Wallet connected. Ready to check balances.");
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
  if (!APP_CONFIG.ticketTokenAddress) {
    return { display: "Not configured", numeric: null };
  }

  const contract = new ethers.Contract(APP_CONFIG.ticketTokenAddress, ERC20_ABI, provider);
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
        ? "Wallet currently holds at least one ticket."
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

async function buyOneTicket() {
  if (buyingInProgress) {
    return;
  }

  if (!signer) {
    setStatus("Connect a wallet before buying a ticket.", true);
    return;
  }

  if (!APP_CONFIG.vendorAddress || !ethers.isAddress(APP_CONFIG.vendorAddress)) {
    setStatus("Vendor address is not configured in ticketing.js.", true);
    return;
  }

  buyingInProgress = true;
  buyTicketBtn.disabled = true;
  setStatus("Submitting purchase transaction...");
  setResult("Waiting for wallet confirmation...");

  try {
    const tx = await signer.sendTransaction({
      to: APP_CONFIG.vendorAddress,
      value: ethers.parseEther(APP_CONFIG.ticketPriceEth),
    });

    setResult(`Transaction submitted: ${tx.hash}`);
    await tx.wait();
    setStatus("Ticket purchase payment confirmed.");
    setResult(`Purchase complete. Tx: ${tx.hash}`);
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
  ticketPriceValue.textContent = `${APP_CONFIG.ticketPriceEth} ETH`;
  selectedWalletValue.textContent = "Not connected";
  ethBalanceValue.textContent = "-";
  ticketBalanceValue.textContent = APP_CONFIG.ticketTokenAddress ? "-" : "Not configured";
  setResult("Awaiting action");
}

connectWalletBtn.addEventListener("click", connectWallet);
useConnectedBtn.addEventListener("click", useConnectedWallet);
checkBalancesBtn.addEventListener("click", checkBalances);
buyTicketBtn.addEventListener("click", buyOneTicket);

init();

import { vi } from "vitest";

const DEFAULT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const VENDOR_ADDRESS = "0x906b4a0773828D6528329ED486ae59F9e08cd5bf";
const CONTRACT_ADDRESS = "0xC624895c31FE16b552ac7966C73039276B95a888";

export function resetTicketRuntime(overrides = {}) {
  window.TICKET_APP_CONFIG = {
    chainIdHex: "0xaa36a7",
    chainId: 11155111,
    chainName: "Sepolia",
    readOnlyRpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorerTxUrlPrefix: "https://sepolia.etherscan.io/tx/",
    ticketTokenAddress: "",
    vendorAddress: "",
    ticketPriceWei: "",
    ...overrides,
  };
  window.TICKET_DEPLOYMENT = {
    ticketTokenAddress: CONTRACT_ADDRESS,
    vendorAddress: VENDOR_ADDRESS,
    ticketPriceWei: "10000000000000000",
    ...(overrides.deployment || {}),
  };
}

export async function loadConfigModule() {
  await import("../../src/js/config.js");
}

function buildEthersUtils() {
  return {
    isAddress: (addr) => typeof addr === "string" && /^0x[a-fA-F0-9]{40}$/.test(addr),
    formatEther: (wei) => String(Number(wei) / 1e18),
    formatUnits: (raw, decimals) => String(Number(raw) / 10 ** Number(decimals)),
    parseUnits: (value, decimals) => BigInt(value) * 10n ** BigInt(decimals),
  };
}

export function installEthersMocks({
  ethBalance = "1000000000000000000",
  ticketBalance = "1",
  ticketDecimals = 0,
  maxTickets = 100n,
  totalSupply = 0n,
  ticketPriceWei = 10000000000000000n,
  readChainId = 11155111n,
  walletChainId = 11155111n,
  walletAddress = DEFAULT_ADDRESS,
  failBalance = false,
  buyRevertsWith = null,
} = {}) {
  const tx = {
    hash: "0xdeadbeef",
    wait: vi.fn().mockResolvedValue({}),
  };

  const readContract = {
    balanceOf: vi.fn(async () => BigInt(ticketBalance)),
    decimals: vi.fn(async () => ticketDecimals),
    totalSupply: vi.fn(async () => totalSupply),
    MAX_TICKETS: vi.fn(async () => maxTickets),
    ticketPriceWei: vi.fn(async () => ticketPriceWei),
  };

  const signerContract = {
    ticketPriceWei: vi.fn(async () => ticketPriceWei),
    buyTickets: buyRevertsWith
      ? vi.fn(async () => {
          throw buyRevertsWith;
        })
      : vi.fn(async () => tx),
    transfer: vi.fn(async () => tx),
    transferTicketsToVendor: vi.fn(async () => tx),
    decimals: vi.fn(async () => ticketDecimals),
    balanceOf: vi.fn(async () => BigInt(ticketBalance)),
  };

  const readProvider = {
    getBalance: vi.fn(async () => {
      if (failBalance) {
        throw new Error("RPC unavailable");
      }
      return BigInt(ethBalance);
    }),
    getNetwork: vi.fn(async () => ({ chainId: readChainId })),
  };

  const signer = {
    getAddress: vi.fn(async () => walletAddress),
  };

  const browserProvider = {
    send: vi.fn(async () => []),
    getNetwork: vi.fn(async () => ({ chainId: walletChainId })),
    getSigner: vi.fn(async () => signer),
  };

  function pickContract(runner) {
    if (runner && typeof runner.getAddress === "function") {
      return signerContract;
    }
    return readContract;
  }

  class JsonRpcProvider {
    constructor() {
      return readProvider;
    }
  }

  class BrowserProvider {
    constructor() {
      return browserProvider;
    }
  }

  class Contract {
    constructor(_addr, _abi, runner) {
      return pickContract(runner);
    }
  }

  const ethersMock = {
    ...buildEthersUtils(),
    JsonRpcProvider,
    BrowserProvider,
    Contract,
  };

  vi.stubGlobal("ethers", ethersMock);
  globalThis.ethers = ethersMock;

  return { readProvider, readContract, signerContract, browserProvider, tx, ethersMock };
}

export function mockReadOnlyProvider(options = {}) {
  return installEthersMocks(options);
}

export function mockBrowserWallet(options = {}) {
  const mocks = installEthersMocks(options);
  window.ethereum = { isMetaMask: true, request: vi.fn() };
  return mocks;
}

export function restoreEthersMocks() {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete globalThis.ethers;
}

export { DEFAULT_ADDRESS, VENDOR_ADDRESS, CONTRACT_ADDRESS };

import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEFAULT_ADDRESS,
  loadConfigModule,
  mockBrowserWallet,
  mockReadOnlyProvider,
  resetTicketRuntime,
  restoreEthersMocks,
} from "../helpers/mock-runtime.js";

function setupBuyTicketDom() {
  document.body.innerHTML = `
    <button id="connectWalletBtn" type="button">Connect</button>
    <button id="useConnectedBtn" type="button" disabled>Use connected</button>
    <button id="checkBalancesBtn" type="button">Check</button>
    <button id="buyTicketBtn" type="button">Buy</button>
    <input id="walletAddressInput" value="" />
    <p id="statusMessage"></p>
    <span id="ticketPriceValue">-</span>
    <code id="selectedWalletValue">-</code>
    <code id="ethBalanceValue">-</code>
    <code id="ticketBalanceValue">-</code>
    <span id="ticketsRemainingValue">-</span>
    <p id="resultValue"></p>
  `;
}

describe("buy ticket page", () => {
  beforeEach(() => {
    vi.resetModules();
    restoreEthersMocks();
    setupBuyTicketDom();
    resetTicketRuntime();
    mockReadOnlyProvider({ totalSupply: 0n, maxTickets: 100n });
  });

  test("rejects purchase when wallet is not connected", async () => {
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.buyOneTicket();
    expect(document.getElementById("statusMessage").textContent).toContain("Connect a wallet");
  });

  test("connects wallet on Sepolia and shows shortened status", async () => {
    mockBrowserWallet();
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();

    expect(document.getElementById("selectedWalletValue").textContent).toBe(DEFAULT_ADDRESS);
    expect(document.getElementById("useConnectedBtn").disabled).toBe(false);
    expect(document.getElementById("statusMessage").textContent).toContain("Connected");
  });

  test("blocks connection on wrong network", async () => {
    mockBrowserWallet({ walletChainId: 1n });
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    expect(document.getElementById("statusMessage").textContent).toContain("Sepolia");
  });

  test("shows helpful message when no injected wallet exists", async () => {
    delete window.ethereum;
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    expect(document.getElementById("statusMessage").textContent).toMatch(/MetaMask|wallet/i);
  });

  test("checks balances for connected wallet", async () => {
    mockBrowserWallet();
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    await globalThis.__ticketDappTestHooks.ticketing.checkBalances();

    expect(document.getElementById("ethBalanceValue").textContent).toContain("ETH");
    expect(document.getElementById("ticketsRemainingValue").textContent).toBe("100");
  });

  test("submits buyTickets and refreshes balances after success", async () => {
    const { signerContract } = mockBrowserWallet();
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    await globalThis.__ticketDappTestHooks.ticketing.buyOneTicket();

    expect(signerContract.buyTickets).toHaveBeenCalledWith(1, expect.objectContaining({ value: expect.any(BigInt) }));
    expect(document.getElementById("statusMessage").textContent).toBe("Balances refreshed.");
    expect(document.getElementById("ticketBalanceValue").textContent).toBe("1");
  });

  test("maps ticket cap revert to a friendly message", async () => {
    mockBrowserWallet({
      buyRevertsWith: new Error("execution reverted: TicketToken: ticket cap exceeded"),
    });
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    await globalThis.__ticketDappTestHooks.ticketing.buyOneTicket();

    expect(document.getElementById("statusMessage").textContent).toContain("100 tickets");
  });

  test("fills address input from connected wallet", async () => {
    mockBrowserWallet({ walletAddress: DEFAULT_ADDRESS });
    await loadConfigModule();
    await import("../../src/js/ticketing.js");

    await globalThis.__ticketDappTestHooks.ticketing.connectWallet();
    await globalThis.__ticketDappTestHooks.ticketing.useConnectedWallet();

    expect(document.getElementById("walletAddressInput").value).toBe(DEFAULT_ADDRESS);
  });
});

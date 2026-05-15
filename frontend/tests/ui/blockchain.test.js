import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  DEFAULT_ADDRESS,
  loadConfigModule,
  mockReadOnlyProvider,
  resetTicketRuntime,
  restoreEthersMocks,
} from "../helpers/mock-runtime.js";

function setupBalancesDom() {
  document.body.innerHTML = `
    <input id="walletAddressInput" value="" />
    <button id="refreshBalanceBtn" type="button">Refresh</button>
    <p id="statusMessage"></p>
    <code id="resolvedAddressValue">-</code>
    <code id="ethBalanceValue">-</code>
    <code id="ticketBalanceValue">-</code>
  `;
}

describe("balances page", () => {
  beforeEach(() => {
    vi.resetModules();
    restoreEthersMocks();
    setupBalancesDom();
    resetTicketRuntime();
    mockReadOnlyProvider();
  });

  test("shows error when address is empty", async () => {
    await loadConfigModule();
    await import("../../src/js/blockchain.js");

    await globalThis.__ticketDappTestHooks.blockchain.fetchSepoliaBalance();

    expect(document.getElementById("statusMessage").textContent).toContain("Enter a wallet");
    expect(document.getElementById("ethBalanceValue").textContent).toBe("-");
  });

  test("shows error for invalid address format", async () => {
    await loadConfigModule();
    await import("../../src/js/blockchain.js");

    document.getElementById("walletAddressInput").value = "not-an-address";
    await globalThis.__ticketDappTestHooks.blockchain.fetchSepoliaBalance();

    expect(document.getElementById("statusMessage").textContent).toContain("Invalid wallet");
  });

  test("loads ETH and ticket balances for a valid address", async () => {
    await loadConfigModule();
    await import("../../src/js/blockchain.js");

    document.getElementById("walletAddressInput").value = DEFAULT_ADDRESS;
    await globalThis.__ticketDappTestHooks.blockchain.fetchSepoliaBalance();

    expect(document.getElementById("statusMessage").textContent).toBe("Balances refreshed.");
    expect(document.getElementById("resolvedAddressValue").textContent).toBe(DEFAULT_ADDRESS);
    expect(document.getElementById("ethBalanceValue").textContent).toContain("ETH");
    expect(document.getElementById("ticketBalanceValue").textContent).toBe("1");
  });

  test("surfaces RPC failures without crashing", async () => {
    vi.resetModules();
    restoreEthersMocks();
    setupBalancesDom();
    resetTicketRuntime();
    mockReadOnlyProvider({ failBalance: true });

    await loadConfigModule();
    await import("../../src/js/blockchain.js");

    document.getElementById("walletAddressInput").value = DEFAULT_ADDRESS;
    await globalThis.__ticketDappTestHooks.blockchain.fetchSepoliaBalance();

    expect(document.getElementById("statusMessage").classList.contains("error")).toBe(true);
    expect(document.getElementById("ethBalanceValue").textContent).toBe("-");
  });
});

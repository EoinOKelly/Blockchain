import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  VENDOR_ADDRESS,
  loadConfigModule,
  mockBrowserWallet,
  mockReadOnlyProvider,
  resetTicketRuntime,
  restoreEthersMocks,
} from "../helpers/mock-runtime.js";

function setupTransferDom() {
  document.body.innerHTML = `
    <button id="connectWalletBtn" type="button">Connect</button>
    <button id="checkBalanceBtn" type="button">Check</button>
    <button id="transferToVendorBtn" type="button">Transfer</button>
    <p id="statusMessage"></p>
    <code id="vendorAddressValue">-</code>
    <code id="senderWalletValue">-</code>
    <code id="ticketBalanceValue">-</code>
    <p id="resultValue"></p>
  `;
}

describe("transfer to vendor page", () => {
  beforeEach(() => {
    vi.resetModules();
    restoreEthersMocks();
    setupTransferDom();
    resetTicketRuntime();
    mockReadOnlyProvider();
  });

  test("renders configured vendor address on load", async () => {
    await loadConfigModule();
    await import("../../src/js/transfer-to-vendor.js");

    expect(document.getElementById("vendorAddressValue").textContent).toBe(VENDOR_ADDRESS);
  });

  test("requires wallet connection before transfer", async () => {
    await loadConfigModule();
    await import("../../src/js/transfer-to-vendor.js");

    await globalThis.__ticketDappTestHooks.transfer.transferOneTicketToVendor();
    expect(document.getElementById("statusMessage").textContent).toContain("Connect");
  });

  test("transfers one ticket unit to vendor", async () => {
    const { signerContract } = mockBrowserWallet();
    await loadConfigModule();
    await import("../../src/js/transfer-to-vendor.js");

    await globalThis.__ticketDappTestHooks.transfer.connectWallet();
    await globalThis.__ticketDappTestHooks.transfer.transferOneTicketToVendor();

    expect(signerContract.transferTicketsToVendor).toHaveBeenCalledWith(1);
    expect(document.getElementById("resultValue").textContent).toContain("sepolia.etherscan.io");
    expect(document.getElementById("statusMessage").textContent).toContain("Transferred");
  });

  test("refreshes ticket balance after connect", async () => {
    mockBrowserWallet();
    await loadConfigModule();
    await import("../../src/js/transfer-to-vendor.js");

    await globalThis.__ticketDappTestHooks.transfer.connectWallet();
    expect(document.getElementById("ticketBalanceValue").textContent).toBe("1");

    await globalThis.__ticketDappTestHooks.transfer.refreshTicketBalance();
    expect(document.getElementById("ticketBalanceValue").textContent).toBe("1");
  });
});

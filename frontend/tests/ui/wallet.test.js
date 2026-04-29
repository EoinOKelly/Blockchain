import { beforeEach, describe, expect, test, vi } from "vitest";

function setupWalletDom() {
  document.body.innerHTML = `
    <button id="createWalletBtn" type="button">Create Wallet</button>
    <button id="downloadWalletBtn" type="button" disabled>Download Wallet JSON</button>
    <p id="statusMessage"></p>
    <div id="walletDetails" class="hidden"></div>
    <code id="walletAddress"></code>
    <code id="walletPrivateKey"></code>
    <code id="walletMnemonic"></code>
    <p id="emptyState"></p>
  `;
}

describe("wallet ui", () => {
  beforeEach(() => {
    vi.resetModules();
    setupWalletDom();

    globalThis.ethers = {
      Wallet: {
        createRandom: vi.fn(() => ({
          address: "0x1234",
          privateKey: "0xprivkey",
          mnemonic: { phrase: "test seed words" }
        }))
      }
    };

    URL.createObjectURL = vi.fn(() => "blob:test-url");
    URL.revokeObjectURL = vi.fn();
    HTMLAnchorElement.prototype.click = vi.fn();
  });

  test("creates wallet and renders details", async () => {
    await import("../../src/js/wallet.js");

    document.getElementById("createWalletBtn").click();

    expect(document.getElementById("walletAddress").textContent).toBe("0x1234");
    expect(document.getElementById("walletPrivateKey").textContent).toBe("0xprivkey");
    expect(document.getElementById("walletMnemonic").textContent).toBe("test seed words");
    expect(document.getElementById("downloadWalletBtn").disabled).toBe(false);
    expect(document.getElementById("walletDetails").classList.contains("hidden")).toBe(false);
    expect(document.getElementById("statusMessage").textContent).toBe("Wallet created successfully.");
  });

  test("keeps download button disabled before wallet creation", async () => {
    await import("../../src/js/wallet.js");

    expect(document.getElementById("downloadWalletBtn").disabled).toBe(true);
  });

  test("downloads wallet json after wallet creation", async () => {
    await import("../../src/js/wallet.js");

    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    document.getElementById("createWalletBtn").click();
    document.getElementById("downloadWalletBtn").click();

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(document.getElementById("statusMessage").textContent).toBe("Wallet JSON downloaded.");
  });
});

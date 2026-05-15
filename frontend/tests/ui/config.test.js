import { beforeEach, describe, expect, test, vi } from "vitest";
import { loadConfigModule, resetTicketRuntime } from "../helpers/mock-runtime.js";

describe("runtime config", () => {
  beforeEach(() => {
    vi.resetModules();
    resetTicketRuntime();
  });

  test("merges deployment addresses over base config", async () => {
    await loadConfigModule();
    const cfg = window.getTicketRuntimeConfig();

    expect(cfg.chainId).toBe(11155111);
    expect(cfg.ticketTokenAddress).toMatch(/^0x/);
    expect(cfg.vendorAddress).toMatch(/^0x/);
    expect(cfg.ticketPriceWei).toBe("10000000000000000");
  });

  test("formatTxExplorerLink includes label and Sepolia URL", async () => {
    await loadConfigModule();
    const line = window.formatTxExplorerLink(
      "0xabc123",
      "Confirmed",
    );

    expect(line).toContain("Confirmed");
    expect(line).toContain("https://sepolia.etherscan.io/tx/0xabc123");
  });
});

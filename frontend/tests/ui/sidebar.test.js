import { beforeEach, describe, expect, test, vi } from "vitest";

describe("sidebar toggle ui", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("toggles sidebar collapsed state and updates aria-expanded", async () => {
    document.body.innerHTML = `
      <aside id="sidebar" class="sidebar"></aside>
      <button id="sidebarToggle" aria-expanded="true">Menu</button>
    `;

    await import("../../src/js/ui.js");
    document.getElementById("sidebarToggle").click();

    expect(document.getElementById("sidebar").classList.contains("collapsed")).toBe(true);
    expect(document.getElementById("sidebarToggle").getAttribute("aria-expanded")).toBe("false");
  });

  test("does nothing safely when sidebar elements are missing", async () => {
    document.body.innerHTML = `<main>No sidebar here</main>`;
    await expect(import("../../src/js/ui.js")).resolves.toBeTruthy();
  });
});

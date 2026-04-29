"use strict";

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebar && sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const expanded = !sidebar.classList.contains("collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(expanded));
  });
}

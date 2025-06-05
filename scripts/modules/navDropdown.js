// ===== Dropdown Menu Toggle =====
const toggleButton = document.getElementById("menu-toggle");
const menuLinks = document.getElementById("menu-links");

toggleButton.addEventListener("click", () => {
  menuLinks.classList.toggle("open");
});

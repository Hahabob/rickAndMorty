/**
 * Utility functions for the Rick and Morty Explorer application
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export function debounce(fn, wait) {
  // TODO: Implement the debounce function
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

export function getUrlSearchParamByKey(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

// // ===== Dropdown Menu Toggle =====
// const toggleButton = document.getElementById("menu-toggle");
// const menuLinks = document.getElementById("menu-links");

// toggleButton.addEventListener("click", () => {
//   menuLinks.classList.toggle("open");
// });

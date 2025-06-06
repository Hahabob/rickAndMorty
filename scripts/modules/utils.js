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

// ===== Dropdown Menu Toggle =====
export function setupNavbarToggle() {
  document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("menu-toggle");
    const menuLinks = document.getElementById("menu-links");

    if (toggleButton && menuLinks) {
      toggleButton.addEventListener("click", () => {
        menuLinks.classList.toggle("open");
      });
    }
  });
}

// === loading spinner global function ===

export function showSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.classList.remove("hidden");
}

export function hideSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.classList.add("hidden");
}

// ===search function (CHATGPT)

/**
 * Universal search function for Rick & Morty entities
 * @param {Object} options - Configuration object
 * @param {string} options.baseUrl - API base URL
 * @param {string} options.query - Search string
 * @param {function} options.onSuccess - Callback for success with API data
 * @param {function} [options.onLoading] - Callback for loading state (true/false)
 * @param {function} [options.onError] - Callback for error messages
 */
export function search({
  baseUrl,
  query,
  onSuccess,
  onLoading,
  onError,
  customErrorMessage,
}) {
  if (onLoading) onLoading(true);

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    if (onLoading) onLoading(false);
    return onSuccess(null); // null tells caller to load default data
  }

  fetch(`${baseUrl}?name=${trimmedQuery}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(customErrorMessage);
      }
      return res.json();
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((err) => {
      if (onError) onError(err.message);
    })
    .finally(() => {
      if (onLoading) onLoading(false);
    });
}

/**
 * Locations Page Script
 * Handles the display and interaction of the locations list page
 */
import {
  getUrlSearchParamByKey,
  showSpinner,
  hideSpinner,
  setupNavbarToggle,
  debounce,
  search,
} from "./modules/utils.js";

setupNavbarToggle();

let page = Number(getUrlSearchParamByKey("page")) || 1;
const BASE_URL = "https://rickandmortyapi.com/api/location";

/**
 * Updates the UI with location data
 * @param {Object} data - The location data from the API
 * @param {Array} data.results - Array of location objects
 * @param {Object} data.info - Pagination information
    
 */
function updateUI(data) {
  const grid = document.getElementById("gridElement");

  grid.innerHTML = "";

  const locations = data.results;

  grid.innerHTML = locations
    .map((location) => {
      const link = `location-detail.html?locationId=${location.id}`;

      return `
        <li id="locationItem_${location.id}" class="location-item">
          <h4>
            <a href="${link}" class="locations-link">
              ${location.name}
            </a>
          </h4>
          <p>Type: ${location.type}</p>
          <p>Dimension: ${location.dimension}</p>
          <p>Residents: ${location.residents.length}</p>
        </li>
      `;
    })
    .join("");
  // 4. Update pagination UI

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = false;
  nextBtn.disabled = false;

  if (data.info.prev === null) {
    prevBtn.disabled = true;
  }
  if (data.info.next === null) {
    nextBtn.disabled = true;
  }
}

function nextPage() {
  page++;
  updateURL();
  loadLocations().then(updateUI);
}

function prevPage() {
  if (page > 1) {
    page--;
    updateURL();
    loadLocations().then(updateUI);
  }
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);
}

/**
 * Loads location data from the API
 */
function loadLocations() {
  showSpinner();
  // 2. Fetch character data using the API module
  return fetch(`${BASE_URL}?page=${page}`)
    .then((response) => {
      if (!response.ok) {
        // If the response status is not 2xx, throw an error
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      hideSpinner();
      return data;
    })
    .catch((error) => {
      hideSpinner();
      console.log("Fetch error:", error.message);
    });
}

const searchInput = document.getElementById("searchInput");

const debouncedSearch = debounce((event) => {
  const query = event.target.value;

  search({
    baseUrl: BASE_URL,
    query,
    onSuccess: (data) => {
      if (!data) {
        // No query: load full locations list
        loadLocations().then(updateUI);
      } else {
        updateUI(data);
      }
    },
    onLoading: (isLoading) => {
      const grid = document.getElementById("gridElement");
      if (isLoading) {
        grid.innerHTML = "<p>Searching...</p>";
      }
    },
    onError: (message) => {
      const grid = document.getElementById("gridElement");
      grid.innerHTML = `<p>${message}</p>`;
    },
    customErrorMessage: "No locations match your search",
  });
}, 300);

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadLocations() on page load
addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextBtn").addEventListener("click", nextPage);
  document.getElementById("prevBtn").addEventListener("click", prevPage);

  searchInput.addEventListener("input", debouncedSearch);

  loadLocations().then((data) => updateUI(data));
});

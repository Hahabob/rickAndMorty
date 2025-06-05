/**
 * Locations Page Script
 * Handles the display and interaction of the locations list page
 */

// State management for the locations page
const state = {
  page: 1,
  data: null,
  search: "",
};

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
}

/**
 * Loads location data from the API
 */
function loadLocations() {
  const BASE_URL = "https://rickandmortyapi.com/api/location";
  // 2. Fetch character data using the API module
  return fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        // If the response status is not 2xx, throw an error
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("Fetch error:", error.message);
    });
}

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadLocations() on page load
addEventListener("DOMContentLoaded", () => {
  loadLocations().then((data) => updateUI(data));
});

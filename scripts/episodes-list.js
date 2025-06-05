/**
 * Episodes Page Script
 * Handles the display and interaction of the episodes list page
 */

// State management for the episodes page
const state = {
  page: 1,
  data: null,
  search: "",
};

/**
 * Updates the UI with episode data
 * @param {Object} data - The episode data from the API
 * @param {Array} data.results - Array of episode objects
 * @param {Object} data.info - Pagination information
 
 */
function updateUI(data) {
  // TODO: Implement the UI update
  // 1. Get the grid element
  const grid = document.getElementById("episodeContainer");
  // 2. Clear existing content
  grid.innerHTML = "";
  // 3. For each episode in data.results:
  //    - Create a card element
  //    - Add episode name, air date, episode code, and character count
  //    - Make the card clickable (link to episode-detail.html)
  const episodes = data.results;
  console.log(episodes);

  grid.innerHTML = episodes
    .map((episode) => {
      const link = `episode-detail.html?episodeId=${episode.id}`;
      return `
     <li id="episodeItem_${episode.id}" class="episode-item">
          <h4>
            <a href="${link}" class="episode-link">
              ${episode.name}
            </a>
          </h4>
          <p>${episode.episode}</p>
          <p>air date: ${episode.air_date}</p>
      </li>`;
    })
    .join("");
  // 4. Update pagination UI
  // throw new Error("updateUI not implemented");
}

/**
 * Loads episode data from the API
 */
function loadEpisodes() {
  const BASE_URL = "https://rickandmortyapi.com/api/episode";
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
// 4. Call loadEpisodes() on page load

addEventListener("DOMContentLoaded", () => {
  loadEpisodes().then((data) => updateUI(data));
});

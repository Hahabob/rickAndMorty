/**
 * Episodes Page Script
 * Handles the display and interaction of the episodes list page
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
const BASE_URL = "https://rickandmortyapi.com/api/episode";
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
  loadEpisodes().then(updateUI);
}

function prevPage() {
  if (page > 1) {
    page--;
    updateURL();
    loadEpisodes().then(updateUI);
  }
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);
}
/**
 * Loads episode data from the API
 */
function loadEpisodes() {
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
        // No query: load full episode list
        loadEpisodes().then(updateUI);
      } else {
        updateUI(data);
      }
    },
    onLoading: (isLoading) => {
      const grid = document.getElementById("episodeContainer");
      if (isLoading) {
        grid.innerHTML = "<p>Searching...</p>";
      }
    },
    onError: (message) => {
      const grid = document.getElementById("episodeContainer");
      grid.innerHTML = `<p>${message}</p>`;
    },
    customErrorMessage: "No episodes match your search",
  });
}, 300);

/**
 * Redirects to a random episode's detail page
 */
function goToRandomEpisode() {
  showSpinner();

  fetch(BASE_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const totalEpisodes = data.info.count;
      const randomId = Math.floor(Math.random() * totalEpisodes) + 1;
      window.location.href = `episode-detail.html?episodeId=${randomId}`;
    })
    .catch(function (error) {
      console.error("Error fetching random episode:", error);
      hideSpinner();
    });
}

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadEpisodes() on page load

addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextBtn").addEventListener("click", nextPage);
  document.getElementById("prevBtn").addEventListener("click", prevPage);
  document
    .getElementById("randomCharacter")
    .addEventListener("click", goToRandomEpisode);

  searchInput.addEventListener("input", debouncedSearch);

  loadEpisodes().then((data) => updateUI(data));
});

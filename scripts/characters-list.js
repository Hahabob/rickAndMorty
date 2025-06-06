/**
 * Characters Page Script
 * Handles the display and interaction of the characters list page
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
const BASE_URL = "https://rickandmortyapi.com/api/character";

/**
 * Updates the UI with character data
 * @param {Object} data - The character data from the API
 * @param {Array} data.results - Array of character objects
 * @param {Object} data.info - Pagination information
 */
function updateUI(data) {
  // TODO: Implement the UI update
  // 1. Get the grid element
  const grid = document.getElementById("gridElement");
  // 2. Clear existing content
  grid.innerHTML = "";
  // 3. For each character in data.results:
  //    - Create a card element
  //    - Add character image, name, status, species, location
  //    - Make the card clickable (link to character-detail.html)
  const characters = data.results;
  grid.innerHTML = characters
    .map((character) => {
      const link = `character-detail.html?characterId=${character.id}`;
      return `           
     <li id="characterItem_${character.id}" class="character-item">
     <img src ="${character.image}" alt="${character.name}" />
              <h4>
                <a href="${link}" class="character-link">
                  ${character.name}
                </a>
              </h4>
              <p>status: <span class="${character.status.toLowerCase()}">${
        character.status
      }</span></p>

              <p>species: ${character.species}</p>
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
  loadCharacters().then(updateUI);
}

function prevPage() {
  if (page > 1) {
    page--;
    updateURL();
    loadCharacters().then(updateUI);
  }
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);
}

/**
 * Loads character data from the API
 */
function loadCharacters() {
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
        // No query: load full character list
        loadCharacters().then(updateUI);
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
    customErrorMessage: "No characters match your search",
  });
}, 300);

/**
 * Redirects to a random character's detail page
 */
async function goToRandomCharacter() {
  try {
    showSpinner();
    // Get the total number of characters
    const response = await fetch(BASE_URL);
    const data = await response.json();
    const totalCharacters = data.info.count;

    // Generate a random character ID
    const randomId = Math.floor(Math.random() * totalCharacters) + 1;

    // Redirect to the character detail page
    window.location.href = `character-detail.html?characterId=${randomId}`;
  } catch (error) {
    console.error("Error fetching random character:", error);
    hideSpinner();
  }
}

// TODO: Add event listeners
// 1. Previous page button click
// 2. Next page button click
// 3. Search input with debounce
// 4. Call loadCharacters() on page load

addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextBtn").addEventListener("click", nextPage);
  document.getElementById("prevBtn").addEventListener("click", prevPage);
  document
    .getElementById("randomCharacter")
    .addEventListener("click", goToRandomCharacter);

  searchInput.addEventListener("input", debouncedSearch);

  loadCharacters().then((data) => updateUI(data));
});

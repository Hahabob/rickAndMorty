import {
  getUrlSearchParamByKey,
  showSpinner,
  hideSpinner,
} from "./modules/utils.js";

/**
 * Episode Detail Page Script
 * Handles the display of detailed information for a single episode
 */

/**
 * Loads and displays details for a specific episode
 * @param {string} id - The episode ID to load
 */
const episodeId = getUrlSearchParamByKey("episodeId");
const BASE_URL = "https://rickandmortyapi.com/api/episode";

function loadEpisodeDetails(id) {
  showSpinner();

  fetch(`${BASE_URL}/${episodeId}`)
    .then((response) => {
      if (!response.ok) {
        // If the response status is not 2xx, throw an error
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const promisedCharacters = data.characters.map((url) => {
        return fetch(url).then((res) => res.json());
      });
      return Promise.all([
        Promise.resolve(data),
        Promise.all(promisedCharacters),
      ]);
    })
    .then(([data, characters]) => {
      console.log(characters);
      updateUI(data, characters);
      hideSpinner();
    })
    .catch((error) => {
      console.log("Fetch error:", error.message);
      hideSpinner();
    });
}

/**
 * Updates the UI with episode and character data
 * @param {Object} episode - The episode data
 * @param {Array} characters - Array of character data
 */
function updateUI(episode, characters) {
  document.title = episode.name;

  const detailContainer = document.getElementById("episodeDetail");
  detailContainer.innerHTML = `
    <div class="episode-info">
      <h4>${episode.name}</h4>
          <p>${episode.episode}</p>
          <p>air date: ${episode.air_date}</p>
    </div>  
  `;

  const characterContainer = document.getElementById("episodeCharacter");

  characterContainer.innerHTML = `
  <div class="carousel-wrapper">
    ${characters
      .map((character) => {
        const characterLink = `character-detail.html?characterId=${character.id}`;
        return `
          <div class="character-card">
            <img src="${character.image}" alt="${character.name}" />
            <h4><a href="${characterLink}" class="character-link">${character.name}</a></h4>
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
          </div>`;
      })
      .join("")}
  </div>
`;
}

// TODO: Initialize the page
// 1. Get episode ID from URL parameters
// 2. Validate the ID
// 3. Load episode details if ID is valid
// 4. Show error if ID is invalid or missing

addEventListener("DOMContentLoaded", loadEpisodeDetails);

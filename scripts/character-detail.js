import {
  getUrlSearchParamByKey,
  showSpinner,
  hideSpinner,
} from "./modules/utils.js";

/**
 * Character Detail Page Script
 * Handles the display of detailed information for a single character
 */

/**
 * Loads and displays details for a specific character
 * @param {string} id - The character ID to load
 */
const characterId = getUrlSearchParamByKey("characterId");
const BASE_URL = "https://rickandmortyapi.com/api/character";

// if (!characterId) {
//   container.innerHTML = "<p class='error'>Invalid character ID</p>";
// } else {
//   container.innerHTML = "<p>Loading character details...</p>";
//   addEventListener("DOMContentLoaded", loadCharacterDetails);
// }

function loadCharacterDetails() {
  showSpinner();
  // 2. Fetch character data
  fetch(`${BASE_URL}/${characterId}`)
    .then((response) => {
      if (!response.ok) {
        // If the response status is not 2xx, throw an error
        throw new Error("HTTP error! Status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const promisedEpisodes = data.episode.map((url) => {
        return fetch(url).then((res) => res.json());
      });
      return Promise.all([
        Promise.resolve(data),
        Promise.all(promisedEpisodes),
      ]);
    })
    .then(([data, episodes]) => {
      console.log(episodes);
      updateUI(data, episodes);
      hideSpinner();
    })
    .catch((error) => {
      console.log("Fetch error:", error.message);
      hideSpinner();
    });
}
function splitUrlForId(url) {
  return url.split("/").pop();
}
/**
 * Updates the UI with character and episode data
 * @param {Object} character - The character data
 * @param {Array} episodes - Array of episode data
 */
function updateUI(character, episodes) {
  // TODO: Implement the UI update
  document.title = character.name;
  // 1. Get the detail container element
  const detailContainer = document.getElementById("characterDetail");
  const originId = splitUrlForId(character.origin.url);
  const originLink = originId
    ? `location-detail.html?locationId=${originId}`
    : "#";
  const locationId = splitUrlForId(character.location.url);
  const locationLink = locationId
    ? `location-detail.html?locationId=${locationId}`
    : "#";
  // 2. Create character header with image and basic info
  detailContainer.innerHTML = `
  <div class="character-header">
    <img src="${character.image}" alt="${character.name}" />
    <div class="character-info">
      <h4>${character.name}</h4>
      <p><strong>status:</strong> ${character.status}</p>
      <p><strong>species:</strong> ${character.species}</p>
      <p><strong>gender:</strong> ${character.gender}</p>
      <p>
        <a href="${originLink}" class="location-link">
          <strong>origin:</strong> ${character.origin.name}
        </a>
      </p>
      <p>
        <a href="${locationLink}" class="location-link">
          <strong>location:</strong> ${character.location.name}
        </a>
      </p>
    </div>
  </div>
`;

  const episodeContainer = document.getElementById("characterEpisode");

  episodeContainer.innerHTML = `
  <ul class="episode-list">
    ${episodes
      .map((episode) => {
        const episodeLink = `episode-detail.html?episodeId=${episode.id}`;
        return `
          <li id="episodeItem_${episode.id}" class="episode-item">
            <h4>
              <a href="${episodeLink}" class="episode-link">
                ${episode.name}
              </a>
            </h4>
            <p>${episode.episode}</p>
            <p>air date: ${episode.air_date}</p>
          </li>`;
      })
      .join("")}
  </ul>
`;

  // 3. Add links to origin and current location
  // 4. Create episodes section with all episodes the character appears in
  // 5. Handle empty states and errors
  // throw new Error("updateUI not implemented");
}

// TODO: Initialize the page
// 1. Get character ID from URL parameters
// 2. Validate the ID
// 3. Load character details if ID is valid
// 4. Show error if ID is invalid or missing
addEventListener("DOMContentLoaded", loadCharacterDetails);

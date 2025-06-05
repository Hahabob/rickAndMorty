import { getUrlSearchParamByKey } from "./modules/utils.js";

/**
 * Character Detail Page Script
 * Handles the display of detailed information for a single character
 */

/**
 * Loads and displays details for a specific character
 * @param {string} id - The character ID to load
 */

// 3. Extract episode IDs from character.episode URLs
// 4. Fetch all episodes this character appears in
// 5. Update UI with character and episode data
// 6. Handle any errors
// 7. Hide loading state
// throw new Error("loadCharacterDetails not implemented");
function loadCharacterDetails() {
  // 1. Start by showing loading state
  const BASE_URL = "https://rickandmortyapi.com/api/character";
  const characterId = getUrlSearchParamByKey("characterId");
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
    })
    .catch((error) => {
      console.log("Fetch error:", error.message);
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
  const originLink = splitUrlForId(character.origin.url)
    ? `location-detail.html?locationId=${character.origin.url}`
    : "#";
  const locationLink = splitUrlForId(character.location.url)
    ? `location-detail.html?locationId=${character.location.url}`
    : "#";
  // 2. Create character header with image and basic info
  detailContainer.innerHTML = `
  <img src ="${character.image}" alt="${character.name}" />
           <h4>
            ${character.name}
           </h4>
            <p>status: ${character.status}</p>
            <p>species: ${character.species}</p>
            <p>gender: ${character.gender}</p>
            <p>                
              <a href="${originLink}" class="location-link">
                  origin :${character.origin.name}
              </a>
            </p>  
            <p>
              <a href="${locationLink}" class="location-link">
                  location :${character.location.name}
              </a>              
            </p>
  `;

  const episodeContainer = document.getElementById("characterEpisode");
  episodeContainer.innerHTML = episodes
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
    .join("");
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

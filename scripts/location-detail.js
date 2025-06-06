// location-detail.js

// ✅ [Step 1] - Import helper to extract the location ID from the URL
import {
  getUrlSearchParamByKey,
  showSpinner,
  hideSpinner,
} from "./modules/utils.js";

// ✅ [Step 2] - Extract the ID from the URL
const locationId = getUrlSearchParamByKey("locationId");
// ✅ [Step 2.5] - extract location data from API
const BASE_URL = "https://rickandmortyapi.com/api/location";

// ✅ [Step 3] - Get the container for displaying the data
const container = document.getElementById("locationElement");

// ✅ [Step 4] - Validate the ID
if (!locationId) {
  container.innerHTML = "<p class='error'>Invalid location ID</p>";
} else {
  container.innerHTML = "<p>Loading location details...</p>";
  loadLocationDetails(); // ✅ [Step 5] - Begin loading the data
}

// ✅ [Function 1] - Load the location and its residents
function loadLocationDetails() {
  showSpinner();
  fetch(`${BASE_URL}/${locationId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch location");
      return res.json();
    })
    .then((data) => {
      const promisedResidents = data.residents.map((url) => {
        return fetch(url).then((res) => res.json());
      });
      return Promise.all([
        Promise.resolve(data),
        Promise.all(promisedResidents),
      ]);
    })
    .then(([data, residents]) => {
      updateLocationDetails(data, residents);
      hideSpinner();
    })
    .catch((err) => {
      container.innerHTML = "<p class='error'>Something went wrong </p>";
      console.error(err);
      hideSpinner();
    });
}

// ✅ [Function 2] - Update the page with the location and its residents
function updateLocationDetails(location, residents) {
  let html = `
    <h2>${location.name}</h2>
    <p><strong>Type:</strong> ${location.type}</p>
    <p><strong>Dimension:</strong> ${location.dimension}</p>
    <h3>Residents:</h3>
  `;
  // ✅ [Step 12] - Handle no residents
  if (residents.length === 0) {
    html += "<p>No known residents.</p>";
  } else {
    html += `<div class="residents">`;
    residents.forEach((resident) => {
      const residentLink = `character-detail.html?characterId=${resident.id}`;
      html += `
        <div class="resident-card">
          <img src="${resident.image}" alt="${resident.name}" />
          <p>              
          <a href="${residentLink}" class="character-link">
                ${resident.name}
          </a>
          </p>
          <p>Status: ${resident.status}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  // ✅ [Step 13] - Inject the HTML into the container
  container.innerHTML = html;
}
import { setupNavbarToggle } from "../scripts/modules/utils.js";
setupNavbarToggle();

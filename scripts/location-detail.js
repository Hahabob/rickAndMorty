// location-detail.js

// ✅ [Step 1] - Import helper to extract the location ID from the URL
import { getUrlSearchParamByKey } from "./modules/utils.js";

// ✅ [Step 2] - Extract the ID from the URL
const locationId = getUrlSearchParamByKey("locationId");

// ✅ [Step 3] - Get the container for displaying the data
const container = document.getElementById("locationElement");

// ✅ [Step 4] - Validate the ID
if (!locationId) {
  container.innerHTML = "<p class='error'>Invalid location ID</p>";
} else {
  container.innerHTML = "<p>Loading location details...</p>";
  loadLocationDetails(locationId); // ✅ [Step 5] - Begin loading the data
}

// ✅ [Function 1] - Load the location and its residents
function loadLocationDetails(id) {
  // ✅ [Step 6] - Fetch the location data from API
  fetch(`https://rickandmortyapi.com/api/location/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch location");
      return res.json();
    })
    .then((locationData) => {
      const residentUrls = locationData.residents;

      // ✅ [Step 7] - Check if there are any residents
      if (residentUrls.length === 0) {
        updateLocationDetails(locationData, []);
      } else {
        // ✅ [Step 8] - Extract resident IDs
        const residentIds = residentUrls.map((url) => url.split("/").pop());

        // ✅ [Step 9] - Fetch all residents in one request
        fetch(
          `https://rickandmortyapi.com/api/character/${residentIds.join(",")}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch residents");
            return res.json();
          })
          .then((residentsData) => {
            // ✅ [Step 10] - Handle single vs multiple residents
            const residents = Array.isArray(residentsData)
              ? residentsData
              : [residentsData];

            // ✅ [Step 11] - Update the UI with both location and residents
            updateLocationDetails(locationData, residents);
          });
      }
    })
    .catch((err) => {
      container.innerHTML = "<p class='error'>Something went wrong </p>";
      console.error(err);
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
      html += `
        <div class="resident-card">
          <img src="${resident.image}" alt="${resident.name}" />
          <p><strong>${resident.name}</strong></p>
          <p>Status: ${resident.status}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  // ✅ [Step 13] - Inject the HTML into the container
  container.innerHTML = html;
}

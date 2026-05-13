// Vancouver coordinates
const bounds = [
  [49.18, -123.25],
  [49.35, -123.0],
];

// setup map boundaries, can remove this export if fetching from backend
export const map = L.map("map", {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  maxBoundsViscosity: 1.0,
}).fitBounds(bounds);

// Display map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 12,
}).addTo(map);

// Replace temperature
const tempComponent = document.querySelector("temperature-container");

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  tempComponent.loadTemperature(lat, lng);
});

// for form submission, right click on desktop, press and hold for mobile
map.on("contextmenu", async (e) => {
  const { lat, lng } = e.latlng;

  let address = "Unknown location";

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );

    const data = await response.json();

    if (data.address) {
      address = [
        data.address.house_number,
        data.address.road,
        data.address.suburb,
        data.address.neighbourhood,
        data.address.city,
        data.address.postcode,
      ]
        .filter(Boolean)
        .join(", ");
    }
  } catch (error) {
    console.log(error);
  }

  const popupContent = `    
    <div class="w-64">
      <h3 class="text-lg font-semibold mb-2">Share your feedback</h3>

      <p class="text-sm mb-2">
        <strong>Address:</strong><br>
        ${address}
      </p>

      <p class="text-xs mb-3 text-gray-600">
        ${lat.toFixed(5)}, ${lng.toFixed(5)}
      </p>

      <textarea
        id="reportText"
        placeholder="Describe the issue"
        rows="3"
        class="w-full p-2 mb-2 border border-gray-300 rounded"
      ></textarea>

      <button
        onclick="submitReport(${lat}, ${lng}, \`${address}\`)"
        class="w-full p-2 bg-blue-900 text-white rounded hover:bg-blue-800"
      >
        Submit Feedback
      </button>
    </div>
  `;

  L.popup({
    minWidth: 260,
    maxWidth: 260,
    closeOnClick: false,
    autoClose: true,
  })
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);
});

window.submitReport = async function (lat, lng, address) {
  const formText = document.getElementById("reportText").value;

  if (!formText) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat,
        lng,
        address,
        formText,
      }),
    });
    const data = await res.json();

    // NOT LOGGED IN
    if (res.status === 401) {
      alert("You must be logged in to submit feedback");
      return;
    }

    // OTHER SERVER ERROR
    if (!res.ok) {
      alert(data.error || "Failed to submit report");
      return;
    }

    // SUCCESS
    map.closePopup();
    alert("Report submitted!");
  } catch (error) {
    console.log(error);
    alert("Failed to submit report");
  }
};

let formMarkers = [];
let formsData = [];

const fetchForms = async () => {
  formsData = [];

  try {
    const result = await fetch("/api/reports");
    const resultJSON = await result.json();

    formsData = resultJSON;
  } catch (error) {
    console.log(error);
  }

  createFormMarkers();
};

const createFormMarkers = () => {
  formMarkers = [];

  for (let i = 0; i < formsData.length; i++) {
    const report = formsData[i];

    const marker = L.marker([report.lat, report.lng]);

    marker.bindPopup(`
      <div class="w-56">
        <h3 class="font-semibold text-lg mb-2">Community Report</h3>

        <p><strong>User:</strong> ${report.username}</p>

        <p class="mt-2">
          <strong>Feedback:</strong><br>
          ${report.formText}
        </p>
      </div>
    `);

    formMarkers.push(marker);
  }
};

const toggleForms = () => {
  const button = document.getElementById("formReports");
  if (!button.classList.contains("active")) {
    formMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  } else {
    formMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  }
};

// Display water fountains
let fountainMarkers = [];
let fountainData = [];

// from svgrepo https://www.svgrepo.com/svg/509452/water-fountain
const fountainIcon = L.divIcon({
  html: `
    <svg viewBox="0 0 60.6 60.6" width="32" height="32">
      <path d="M7.78 56.03c-1.78 0-3.22-1.44-3.22-3.22V7.78c0-1.78 1.44-3.22 3.22-3.22h45.03c1.78 0 3.22 1.44 3.22 3.22v45.03c0 1.78-1.44 3.22-3.22 3.22H7.78z" fill="#ffffff" stroke="#000" stroke-width="0.6"/>
      
      <path d="M32.7 24.19v1.57c0 .77.34 1.46.87 1.93l7.76 6.47h4.23v-9.97H32.7z" fill="#0077ff"/>
      
      <path d="M33.64 12.13c-1.78-.06-3.27 1.33-3.33 3.1-.06 1.78 1.33 3.26 3.1 3.33 1.78.06 3.27-1.33 3.33-3.1.06-1.78-1.33-3.27-3.1-3.33z" fill="#0077ff"/>
      
      <path d="M30.77 20.65c0-1.98-.9-3.75-2.3-4.93-.08-.07-.19-.11-.3-.11-.11 0-.21.04-.29.1l-11.2 8.44c-.97.73-1.6 1.9-1.6 3.21 0 .24.02.47.06.7l3.74 21.21h3.54V28.18l4.83-2.82.25 2.23c.09.77.52 1.44 1.14 1.85l4.32 2.81 2.21-1.28-4.4-3.7v-6.61z" fill="#0077ff"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const fetchWaterFountains = async () => {
  fountainData = [];

  try {
    const result = await fetch("/api/fountains");

    const resultJSON = await result.json();

    fountainData = resultJSON;
  } catch (error) {
    console.log(error);
  }

  createFountainMarkers();
};

const createFountainMarkers = () => {
  fountainMarkers = [];
  for (let i = 0; i < fountainData.length; i++) {
    const result = fountainData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: fountainIcon });
    let fountainInfo = `<b>${result.name}</b><br><button onclick="routeTo(${latValue}, ${lonValue})" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>`;
    marker.bindPopup(fountainInfo);
    fountainMarkers.push(marker);
  }
};

const toggleFountainMarkers = () => {
  const button = document.getElementById("fountainsBtn");
  if (!button.classList.contains("active")) {
    fountainMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  } else {
    fountainMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  }
};

// Raw park data from opendata.vancouver.ca
let parkData = [];

// Park geometry
let parkGeom = [];

/**
 * Fetch raw park data from backend route and push to parkData array
 */
const fetchParks = async () => {
  parkData = [];

  try {
    const results = await fetch("/api/parks");
    const resultsJSON = await results.json();

    parkData = resultsJSON;
  } catch (error) {
    console.log(error);
  }

  createParkGeom();
};

/**
 * Push park geometry data from each park to parkGeom array
 */
const createParkGeom = async () => {
  parkGeom = [];

  for (let i = 0; i < parkData.length; i++) {
    const park = parkData[i];
    const geom = L.geoJSON(park.geom);

    // Get the center of the park boundary for routing
    const center = geom.getBounds().getCenter();

    geom.bindPopup(`
      ${park.park_name}<br><br>
      <button onclick="routeTo(${center.lat}, ${center.lng})" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>
    `);
    parkGeom.push(geom);
  }
};

/**
 * Toggle park geometry when the Parks button in the navbar is clicked. Used in site-navbar.js
 */
const toggleParkGeom = () => {
  const button = document.getElementById("parksBtn");
  if (!button.classList.contains("active")) {
    parkGeom.forEach((geom) => {
      map.removeLayer(geom);
    });
  } else {
    parkGeom.forEach((geom) => {
      geom.addTo(map);
    });
  }
};

fetchParks();
fetchWaterFountains();

// Display public washrooms
let washroomMarkers = [];
let washroomData = [];

const washroomIcon = L.divIcon({
  html: `
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" fill="white" rx="6"/>
      <circle cx="15" cy="10" r="4" fill="#2F88FF" stroke="#000000" stroke-width="2"/>
      <circle cx="33" cy="10" r="4" fill="#2F88FF" stroke="#000000" stroke-width="2"/>
      <path d="M10 20H20L18 42H12L10 20Z" fill="#2F88FF" stroke="#000000" stroke-width="2"/>
      <path d="M28 20H38L40 31H37L36 42H30L29 31H26L28 20Z" fill="#2F88FF" stroke="#000000" stroke-width="2"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const fetchPublicWashrooms = async () => {
  washroomData = [];
  try {
    const result = await fetch("/api/washrooms");
    const resultJSON = await result.json();
    washroomData = resultJSON;
  } catch (error) {
    console.log(error);
  }
  createWashroomMarkers();
};

const createWashroomMarkers = () => {
  washroomMarkers = [];
  for (let i = 0; i < washroomData.length; i++) {
    const result = washroomData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: washroomIcon });
    let washroomInfo = `<b>${result.park_name}</b><br>${result.type}<br>Summer: ${result.summer_hours}<br>Wheelchair: ${result.wheelchair_access}<br><button onclick="routeTo(${latValue}, ${lonValue})" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>`;
    marker.bindPopup(washroomInfo);
    washroomMarkers.push(marker);
  }
};

const toggleWashroomMarkers = () => {
  const button = document.getElementById("publicWashroomsBtn");
  if (button.classList.contains("active")) {
    washroomMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  } else {
    washroomMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  }
};

fetchPublicWashrooms();

let transitLayer = null;
let transitData = null;

const inVancouver = (lat, lng) => {
  return lat >= 49.2 && lat <= 49.32 && lng >= -123.25 && lng <= -123.02;
};

const fetchTransitStops = async () => {
  // console.log("Fetching transit stops...");
  try {
    const res = await fetch("/data/stops.geojson");
    transitData = await res.json();
    // console.log("Loaded stops:", transitData.features.length);
  } catch (error) {
    console.log("Error:", error);
  }
};

const createTransitLayer = () => {
  transitLayer = L.geoJSON(transitData, {
    filter: (feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return inVancouver(lat, lng);
    },
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#A78BFA",
        color: "#fff",
        weight: 1.5,
        fillOpacity: 0.9,
      });
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;

      layer.bindPopup(`
        <b>${p.name}</b><br>
        Stop code: ${p.code}<br>
        Wheelchair: ${p.wheelchair_boarding === "1" ? "Yes" : "No"}<br><br>
        <button onclick="routeTo(${lat}, ${lng}, 'transit')" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>
      `);
    },
  });
};

const toggleTransitMarkers = () => {
  const button = document.getElementById("transitBtn");
  if (button.classList.contains("active")) {
    if (!transitLayer) createTransitLayer();
    transitLayer.addTo(map);
  } else {
    if (transitLayer) map.removeLayer(transitLayer);
  }
};

fetchTransitStops();

let communityCentresMarkers = [];
let communityCentresData = [];

const centreIcon = L.divIcon({
  html: `
    <svg height="32px" width="32px" version="1.1" id="_x35_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon style="fill:#E9E7C2;" points="492.176,184.586 490.633,213.753 477.228,464.553 34.772,464.553 22.748,239.751 21.367,213.753 19.824,184.586 "></polygon> <polygon style="fill:#9B7453;" points="495.182,464.553 493.477,493.882 18.523,493.882 17.305,473.003 16.817,464.553 "></polygon> <g> <g> <polygon style="fill:#AAD2D6;" points="126.019,339.279 63.431,339.279 61.071,287.036 124.426,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="127.904,401.109 66.225,401.109 63.933,350.381 126.357,350.381 "></polygon> </g> <g> <polygon style="fill:#AAD2D6;" points="204.56,339.279 141.973,339.279 140.575,287.036 203.929,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="205.306,401.109 143.627,401.109 142.27,350.381 204.694,350.381 "></polygon> </g> <g> <polygon style="fill:#AAD2D6;" points="283.101,339.279 220.514,339.279 220.079,287.036 283.433,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="282.708,401.109 221.028,401.109 220.606,350.381 283.03,350.381 "></polygon> </g> </g> <path style="fill:#D06868;" d="M392.544,245.69H380.65c-29.252,0-53.6,25.233-54.099,55.678l-2.692,164.089h112.298l7.147-164.089 C444.631,270.922,421.796,245.69,392.544,245.69z"></path> <polygon style="fill:#E0E0E0;" points="434.314,493.886 322.744,493.886 323.221,464.53 435.589,464.53 "></polygon> <polygon style="fill:#9B7453;" points="512,213.753 0,213.753 67.595,84.574 444.405,84.574 463.822,121.703 "></polygon> <g> <polygon style="fill:#E9E7C2;" points="251.613,174.756 104.642,174.756 104.074,158.426 101.555,84.574 100.255,46.715 175.081,0 229.352,33.147 251.531,46.715 251.531,84.574 "></polygon> <g> <polygon style="fill:#AAD2D6;" points="157.973,141.819 132.026,141.819 130.436,84.592 156.715,84.592 "></polygon> <polygon style="fill:#AAD2D6;" points="190.534,141.819 164.587,141.819 163.414,84.592 189.694,84.592 "></polygon> <polygon style="fill:#AAD2D6;" points="223.095,141.819 197.148,141.819 196.393,84.592 222.673,84.592 "></polygon> </g> </g> <path style="fill:#E9E7C2;" d="M427.249,358.216c-0.327,8.109-6.945,14.66-14.783,14.66c-7.837,0-13.97-6.551-13.697-14.66 c0.274-8.14,6.894-14.762,14.786-14.762S427.577,350.077,427.249,358.216z"></path> </g> <polygon style="opacity:0.1;fill:#040000;" points="490.633,213.753 512,213.753 463.822,121.703 444.405,84.574 256,84.574 256,493.882 322.744,493.882 322.744,493.885 434.314,493.885 434.314,493.882 493.477,493.882 495.182,464.553 477.228,464.553 "></polygon> </g> </g></svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Fetch community centres from backend and create markers
 */
const fetchCommunityCentres = async () => {
  communityCentresData = [];
  try {
    const result = await fetch("/api/community-centres");
    const text = await result.text();
    communityCentresData = JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
  createCommunityCentreMarkers();
};

/**
 * Create community centre markers and bind popups
 */
const createCommunityCentreMarkers = () => {
  communityCentresMarkers = [];
  for (let i = 0; i < communityCentresData.length; i++) {
    const result = communityCentresData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: centreIcon });
    let centreInfo = `Location: <b>${result.name}</b><br>
      <br><button onclick="routeTo(${latValue}, ${lonValue})" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>`;

    marker.bindPopup(centreInfo);
    communityCentresMarkers.push(marker);
  }
};

/**
 * Toggle community centre markers on the map based on button state
 */
const toggleCommunityCentreMarkers = () => {
  const button = document.getElementById("communityCentresBtn");
  if (button.classList.contains("active")) {
    communityCentresMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  } else {
    communityCentresMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  }
};

fetchCommunityCentres();

// Toggle pins for feedback report forms submitted
let reportMarkers = [];
let reportData = [];

const reportIcon = L.divIcon({
  html: `
    <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M256 0C161.9 0 85.3 76.6 85.3 170.7c0 131.8 155.2 328.5 161.8 337.2 2.5 3.3 6.4 5.2 10.5 5.1 4-.1 7.8-2.1 10.2-5.4C274.2 499 426.7 301.2 426.7 170.7 426.7 76.6 350.1 0 256 0z" fill="#E24B4A"/>
      <circle cx="256" cy="170.7" r="68.3" fill="#fff"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Display the users reports as pins on map
const fetchReports = async () => {
  reportData = [];
  try {
    const result = await fetch("/api/reports");
    const resultJSON = await result.json();
    reportData = resultJSON;
  } catch (error) {
    console.log(error);
  }
  createReportMarkers();
};

const createReportMarkers = () => {
  reportMarkers = [];

  for (let i = 0; i < reportData.length; i++) {
    const report = reportData[i];

    const marker = L.marker([report.lat, report.lng], { icon: reportIcon });

    marker.bindPopup(`
      <div class="w-64">
        <h3 class="font-semibold text-lg mb-2">Community Report</h3>

        <p class="text-sm mb-2">
          <strong>Address:</strong><br>
          ${report.address || "No address available"}
        </p>

        <p class="text-xs text-gray-600 mb-2">
          <strong>Coordinates:</strong><br>
          ${Number(report.lat).toFixed(5)}, ${Number(report.lng).toFixed(5)}
        </p>

        <p class="text-sm mb-2">
          <strong>Message:</strong><br>
          ${report.formText}
        </p>

        <p class="text-xs text-gray-500">
          Submitted by: ${report.username}
        </p>
      </div>
    `);

    reportMarkers.push(marker);
  }
};

const toggleReportMarkers = async () => {
  const button = document.getElementById("formReports");

  const res = await fetch("/api/user");
  const userData = await res.json();

  if (!userData.loggedIn) {
    alert("You must be logged in to view and submit feedback reports");
    button.classList.remove("active");
    button.classList.remove("bg-success");
    return;
  }

  if (button.classList.contains("active")) {
    await fetchReports();
    reportMarkers.forEach((marker) => marker.addTo(map));
  } else {
    reportMarkers.forEach((marker) => map.removeLayer(marker));
  }
};

async function fetchNeighborhoodNames() {
  try {
    const result = await fetch("/api/neighborhoods");
    const resultJSON = await result.json();

    return [
      ...new Set(
        (resultJSON.results || [])
          .map((neighborhood) => neighborhood.name)
          .filter(Boolean),
      ),
    ].sort((left, right) => left.localeCompare(right));
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchReportSummary(scope, neighborhood) {
  const url = new URL("/api/reports/summary", window.location.origin);
  url.searchParams.set("scope", scope);

  if (scope === "neighborhood" && neighborhood) {
    url.searchParams.set("neighbourhood", neighborhood);
  }

  const result = await fetch(url);
  const resultJSON = await result.json();

  if (!result.ok) {
    throw new Error(resultJSON.error || "Failed to generate summary");
  }

  return resultJSON;
}

function createSummaryList(title, items) {
  const section = document.createElement("section");
  section.className = "rounded-box bg-base-100 p-4 shadow-sm";

  const heading = document.createElement("h5");
  heading.className = "font-semibold mb-2";
  heading.textContent = title;
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "list-disc pl-5 space-y-1 text-sm";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  section.appendChild(list);
  return section;
}

function createSummaryBadges(title, items) {
  const section = document.createElement("section");
  section.className = "rounded-box bg-base-100 p-4 shadow-sm";

  const heading = document.createElement("h5");
  heading.className = "font-semibold mb-3";
  heading.textContent = title;
  section.appendChild(heading);

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-wrap gap-2";

  items.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "badge badge-outline";
    badge.textContent = item;
    wrapper.appendChild(badge);
  });

  section.appendChild(wrapper);
  return section;
}

async function loadNeighborhoodOptions() {
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");

  if (!neighborhoodSelect) {
    return;
  }

  const neighborhoods = await fetchNeighborhoodNames();
  neighborhoodSelect.innerHTML = "";

  if (!neighborhoods.length) {
    neighborhoodSelect.innerHTML = `<option value="">Neighbourhoods unavailable</option>`;
    neighborhoodSelect.disabled = true;
    return;
  }

  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.value = neighborhood;
    option.textContent = neighborhood.replace("Neighborhood", "Neighbourhood");
    neighborhoodSelect.appendChild(option);
  });

  neighborhoodSelect.disabled = false;
}

async function loadSummary() {
  const status = document.getElementById("summaryStatus");
  const output = document.getElementById("summaryOutput");
  const scope = document.getElementById("summaryScope").value;
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");
  const neighborhood =
    scope === "neighborhood" ? neighborhoodSelect.value : null;

  if (status) {
    status.textContent = "Generating summary...";
  }

  if (output) {
    output.innerHTML = "";
  }

  try {
    const summaryResponse = await fetchReportSummary(scope, neighborhood);
    const summary = summaryResponse.summary;

    if (status) {
      status.textContent = `${summaryResponse.relevantReportCount} relevant report${summaryResponse.relevantReportCount === 1 ? "" : "s"} used from ${summaryResponse.totalReportCount} total reports.`;
    }

    const overview = document.createElement("div");
    overview.className = "rounded-box bg-base-100 p-4 shadow-sm";

    const overviewHeading = document.createElement("h5");
    overviewHeading.className = "font-semibold mb-2";
    overviewHeading.textContent = "Overview";
    overview.appendChild(overviewHeading);

    const overviewText = document.createElement("p");
    overviewText.className = "text-sm leading-6";
    overviewText.textContent = summary.overview;
    overview.appendChild(overviewText);

    output.appendChild(overview);
    output.appendChild(
      createSummaryList("Highlights", summary.highlights || []),
    );
    output.appendChild(
      createSummaryList(
        "Recommended actions",
        summary.recommendedActions || [],
      ),
    );

    if ((summary.topTopics || []).length) {
      output.appendChild(createSummaryBadges("Top topics", summary.topTopics));
    }

    if ((summary.topNeighborhoods || []).length) {
      output.appendChild(
        createSummaryBadges(
          "Most active neighbourhoods",
          summary.topNeighborhoods,
        ),
      );
    }
  } catch (error) {
    console.log(error);

    if (status) {
      status.textContent = error.message || "Failed to generate summary.";
    }
  }
}

function toggleSummaryNeighborhoodSelect() {
  const scope = document.getElementById("summaryScope");
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");

  if (!scope || !neighborhoodSelect) {
    return;
  }

  neighborhoodSelect.classList.toggle("hidden", scope.value !== "neighborhood");
}

const summaryButton = document.getElementById("summaryBtn");

if (summaryButton) {
  summaryButton.addEventListener("click", async () => {
    document.getElementById("summaryModal").classList.remove("hidden");
    toggleSummaryNeighborhoodSelect();

    if (!document.getElementById("summaryNeighborhood").options.length) {
      await loadNeighborhoodOptions();
    }

    await loadSummary();
  });

  document.getElementById("closeSummaryBtn").addEventListener("click", () => {
    document.getElementById("summaryModal").classList.add("hidden");
  });

  document.getElementById("summaryModal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("summaryModal")) {
      document.getElementById("summaryModal").classList.add("hidden");
    }
  });

  document
    .getElementById("summaryScope")
    .addEventListener("change", async () => {
      toggleSummaryNeighborhoodSelect();

      if (
        document.getElementById("summaryScope").value === "neighborhood" &&
        !document.getElementById("summaryNeighborhood").options.length
      ) {
        await loadNeighborhoodOptions();
      }

      await loadSummary();
    });

  document
    .getElementById("summaryNeighborhood")
    .addEventListener("change", () => {
      if (document.getElementById("summaryScope").value === "neighborhood") {
        loadSummary();
      }
    });

  document
    .getElementById("generateSummaryBtn")
    .addEventListener("click", loadSummary);
}

/**
 * Trees API Integration Section (start)
 * Contains: fetching data, toggling markers, creating markers
 */
let treeLayerGroup = L.layerGroup().addTo(map);

async function fetchTreeClusters() {
  const zoom = map.getZoom(); // get map's current zoom level
  const bounds = map.getBounds(); // get current map viewport bounds
  const bbox = [
    bounds.getSouth(),
    bounds.getWest(),
    bounds.getNorth(),
    bounds.getEast(),
  ]; // normalize the bounds into a format that the API accepts

  // fetch the tree clusters from our backend server
  const result = await fetch(`/api/public-trees?zoom=${zoom}&bbox=${bbox}`);
  const treesGeoCluster = await result.json();
  return treesGeoCluster.results;
}

function getClusterColor(treeClusterCount) {
  if (treeClusterCount >= 1000) return "#1b4332";
  if (treeClusterCount >= 500) return "#2d6a4f";
  if (treeClusterCount >= 100) return "#40916c";
  if (treeClusterCount >= 50) return "#52b788";
  if (treeClusterCount >= 10) return "#74c69d";
  return "#95d5b2";
}

function getTreeIcon(treeClusterCount) {
  const size = 40;
  return L.divIcon({
    className: "",
    html: `
  <svg
    width="${32}px"
    height="${32}px"
    viewBox="0 0 1024 1024"
    class="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M760.5 568.6l-37-46.9-162.5 128V421.8H449.9v306.3L301.1 606.8l-37.8 46.3 186.6 152.2v128H561V725.9z"
        fill="#D68231"
      ></path>
      <path
        d="M301.1 606.8l-37.8 46.4 83.9 68.4c18.5-10.1 32.8-25.8 40.1-44.5l-86.2-70.3zM723.5 521.7l-88 69.3c6.3 19.2 19.9 35.5 37.9 46.3l87.2-68.7-37.1-46.9zM449.9 421.8v187.8c18.2 2.5 36.8 3.8 55.5 3.8 18.8 0 37.3-1.3 55.5-3.8V421.8h-111z"
        fill=""
      ></path>
      <path
        d="M207.2 316a298.3 250.7 0 1 0 596.6 0 298.3 250.7 0 1 0-596.6 0Z"
        fill="#00AD68"
      ></path>
      <path
        d="M648.4 545.1a93.6 84.8 0 1 0 187.2 0 93.6 84.8 0 1 0-187.2 0Z"
        fill="#7CDFA8"
      ></path>
      <path
        d="M188.6 630a93.6 84.8 0 1 0 187.2 0 93.6 84.8 0 1 0-187.2 0Z"
        fill="#218649"
      ></path>
      <path
        d="M648.1 921.9c0-10.3-8.4-18.7-18.7-18.7H381.5c-10.3 0-18.7 8.4-18.7 18.7v18.7c0 10.3 8.4 18.7 18.7 18.7h247.9c10.3 0 18.7-8.4 18.7-18.7v-18.7z"
        fill="#218649"
      ></path>
      <path
        d="M377.8 391.3c-16.7-16.7-71.2-33.3-73.9-30.5-2.8 2.8 13.8 57.2 30.5 73.9 16.7 16.7 40 20.5 52 8.5 11.9-11.9 8.1-35.2-8.6-51.9z"
        fill="#7CDFA8"
      ></path>
      <path
        d="M616.2 414.6c16.7-16.7 33.3-71.2 30.5-73.9-2.8-2.8-57.2 13.8-73.9 30.5-16.7 16.7-20.5 40-8.5 52 11.9 11.9 35.2 8.1 51.9-8.6zM471.1 220.7c0-23.6-26.8-73.9-30.7-73.9-3.9 0-30.7 50.2-30.7 73.9s13.7 42.8 30.7 42.8 30.7-19.2 30.7-42.8z"
        fill="#218649"
      ></path>
      <path
        d="M681.1 267.6c16.7-16.7 33.3-71.2 30.5-73.9-2.8-2.8-57.2 13.8-73.9 30.5-16.7 16.7-20.5 40-8.5 52 11.9 11.9 35.2 8.1 51.9-8.6z"
        fill="#7CDFA8"
      ></path>
    </g>
  </svg>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -22],
  });
}

function getTreesIcon(treeClusterCount) {
  return L.divIcon({
    className: "",
    html: `
      <div class="text-white bg-[${getClusterColor(treeClusterCount)}]/90 rounded-full p-4 w-fit indicator">
        ${treeClusterCount}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -22],
  });
}

async function createTreesMarkers(treesGeoCluster) {
  // Remove all cluster markers in the layer group
  treeLayerGroup.clearLayers();

  treesGeoCluster.forEach((geoClusterData) => {
    const { lat, lon } = Object.values(geoClusterData)[0].cluster_centroid; // unpacks the data
    const treeClusterCount = geoClusterData.count;

    // dynamic marker visualization based on cluster size
    let treeMarker;

    if (treeClusterCount === 1) treeMarker = getTreeIcon();
    else treeMarker = getTreesIcon(treeClusterCount);

    L.marker([lat, lon], { icon: treeMarker })
      .bindPopup(`${treeClusterCount} trees`)
      .addTo(treeLayerGroup);
  });

  console.log(`Creating ${treesGeoCluster.length} cluster markers`);
}

async function toggleTreesMarkers() {
  const isActive = treesBtn.classList.contains("active");
  if (isActive) {
    const treesGeoCluster = await fetchTreeClusters();
    createTreesMarkers(treesGeoCluster);
  } else treeLayerGroup.clearLayers();
}

/**
 * Decorate a function by adding a delay. Can be used for map event listeners (zoom-in, zoom-out, map movement)
 * Reference: Stack Overflow (74981172)
 */
const debounce = (fn, delay = 1000) => {
  let timer; // holds the current timer ID
  return (...args) => {
    clearTimeout(timer); // cancel the previous timer if it exists
    timer = setTimeout(() => fn(...args), delay); // start a fresh one
  };
};

const debouncedToggleTreeMarkers = debounce(toggleTreesMarkers);
const treesBtn = document.getElementById("treesBtn");

// Event Listener: Map movement (zoom in and zoom out)
map.on("zoomend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.classList.contains("active");
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// Event Listener: Map movement (map movement)
map.on("moveend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.classList.contains("active");
  console.log(treesBtnIsToggled);
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// treesBtn listener: On initial click, we toggle the createTreesMarkers
treesBtn.addEventListener("click", toggleTreesMarkers);

/**
 * Trees API Integration Section (end)
 * Contains: fetching data, toggling markers, creating markers
 */

/**
 * Shade API Integration Section (start)
 * Contains: fetching data and creating shade layer
 */
const res = await fetch("/api/key");
const { key } = await res.json();
console.log("Shade API Key:", key);

const buildingCache = new Map();

/**
 * Returns a larger area than the current view, so zoom changes still hit the cache
 * @param {*} bounds
 * @returns North, west, south, east rounded to 2 decimal places and expanded by 0.01 degrees (about 1km) to create a buffer around the current view. This helps ensure that small movements or zoom changes still hit the same cache entry and reduces redundant API calls.
 */
const getPaddedBounds = (bounds) => {
  const round = (n) => Math.round(n * 100) / 100; // 2 decimal places (~1km chunks)
  return {
    north: round(bounds.getNorth() + 0.01),
    south: round(bounds.getSouth() - 0.01),
    east: round(bounds.getEast() + 0.01),
    west: round(bounds.getWest() - 0.01),
  };
};

/**
 * Initialize the ShadeMap layer with the provided API key and configuration. The getFeatures function fetches building data from the Overpass API based on the current map bounds and zoom level, converts it to GeoJSON format, and caches the results to optimize performance. The layer is added to the map to visualize shaded areas representing building heights.
 */
const shadeMap = new ShadeMap({
  apiKey: key,
  date: new Date(),
  color: "#01112f",
  opacity: 0.7,

  getFeatures: async () => {
    if (map.getZoom() < 15) return [];

    const bounds = map.getBounds();
    const padded = getPaddedBounds(bounds);
    const cacheKey = `${padded.south},${padded.west},${padded.north},${padded.east}`;

    // Return cached data if available
    if (buildingCache.has(cacheKey)) {
      console.log("Cache hit for bounds:", cacheKey);
      return buildingCache.get(cacheKey);
    }

    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    const query = `https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cbuilding%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Cbuilding%E2%80%9D%0A%20%20way%5B%22building%22%5D%28${padded.south}%2C${padded.west}%2C${padded.north}%2C${padded.east}%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`;

    const response = await fetch(query);
    const json = await response.json();
    const geojson = osmtogeojson(json);

    geojson.features.forEach((feature) => {
      if (!feature.properties) feature.properties = {};
      const levels = feature.properties["building:levels"];
      feature.properties.height = levels ? levels * 3 : 6;
    });

    // Store in cache before returning
    buildingCache.set(cacheKey, geojson.features);
    console.log(
      `Fetched and cached ${geojson.features.length} building features for bounds: ${cacheKey}`,
    );
    return geojson.features;
  },
}).addTo(map);

/**
 * Event listener for map clicks to determine if the clicked location is in the sun or shade. It converts the clicked latitude and longitude to container pixel coordinates, checks the shade status using the ShadeMap's isPositionInSun method, and logs the result to the console. This allows users to interactively check the shading conditions at specific points on the map.
 */
map.on("click", async (e) => {
  if (!shadeMap) return;

  const point = map.latLngToContainerPoint(e.latlng);

  const inTheSun = await shadeMap.isPositionInSun(point.x, point.y);

  console.log(inTheSun ? "Sunny" : "Shaded");
});
/** * Shade API Integration Section (end)
 * Contains: fetching data and creating shade layer
 */
// Fetching neighborhoods
// Raw neighborhood data from opendata.vancouver.ca
let neighborhoodData = [];

// Neighborhood geometry
let neighborhoodGeom = [];

/**
 * Fetch raw neighborhood data from backend route
 */
const fetchNeighborhoods = async () => {
  neighborhoodData = [];

  try {
    const results = await fetch("/api/neighborhoods");
    const resultsJSON = await results.json();

    // actual records array
    neighborhoodData = resultsJSON.results;
  } catch (error) {
    console.log(error);
  }

  createNeighborhoodGeom();
};

const getScoreColor = (score) => {
  if (score >= 75) return "#97C459";
  if (score >= 50) return "#F5C4B3";
  if (score >= 25) return "#EF9F27";
  return "#E24B4A";
};

// Fetch formula from db, either default or user specified
let heatScoreFormula = {
  waterFountains: 0.2,
  washrooms: 0.2,
  parks: 0.2,
  communityCentres: 0.2,
  transit: 0.2,
};

const fetchHeatScoreFormula = async () => {
  try {
    const result = await fetch("/api/heatScoreFormula");
    if (!result.ok) {
      console.log("Using default formula");
      return;
    }

    const resultJSON = await result.json();

    if (resultJSON && resultJSON.formula) {
      heatScoreFormula = resultJSON.formula;
    }
  } catch (error) {
    console.log(error);
  }

  createNeighborhoodGeom();
};
/**
 * Create neighborhood geometry layers
 */

const createNeighborhoodGeom = () => {
  neighborhoodGeom = [];

  const neighborhoodStats = [];

  // PASS 1: gather counts for every neighborhood
  for (let i = 0; i < neighborhoodData.length; i++) {
    const neighborhood = neighborhoodData[i];

    // Count amenities inside this neighbourhood
    let fountains = 0;
    let washrooms = 0;
    let centres = 0;
    let transit = 0;
    let parks = 0;

    fountainData.forEach((f) => {
      if (
        window.turf.booleanPointInPolygon(
          [f.geo_point_2d.lon, f.geo_point_2d.lat],
          neighborhood.geom,
        )
      )
        fountains++;
    });

    washroomData.forEach((w) => {
      if (
        window.turf.booleanPointInPolygon(
          [w.geo_point_2d.lon, w.geo_point_2d.lat],
          neighborhood.geom,
        )
      )
        washrooms++;
    });

    communityCentresData.forEach((c) => {
      if (
        window.turf.booleanPointInPolygon(
          [c.geo_point_2d.lon, c.geo_point_2d.lat],
          neighborhood.geom,
        )
      )
        centres++;
    });

    if (transitData) {
      transitData.features.forEach((stop) => {
        if (
          window.turf.booleanPointInPolygon(
            stop.geometry.coordinates,
            neighborhood.geom,
          )
        )
          transit++;
      });
    }

    parkData.forEach((p) => {
      try {
        if (p.geom) {
          const centroid = window.turf.centroid(p.geom);

          if (
            window.turf.booleanPointInPolygon(
              centroid.geometry.coordinates,
              neighborhood.geom,
            )
          )
            parks++;
        }
      } catch (e) {}
    });

    neighborhoodStats.push({
      neighborhood,
      fountains,
      washrooms,
      centres,
      transit,
      parks,
    });
  }

  // FIND GLOBAL MAXES
  const maxFountains = Math.max(...neighborhoodStats.map((n) => n.fountains));

  const maxWashrooms = Math.max(...neighborhoodStats.map((n) => n.washrooms));

  const maxCentres = Math.max(...neighborhoodStats.map((n) => n.centres));

  const maxTransit = Math.max(...neighborhoodStats.map((n) => n.transit));

  const maxParks = Math.max(...neighborhoodStats.map((n) => n.parks));

  // PASS 2: create normalized weighted scores
  neighborhoodStats.forEach((stats) => {
    const fountainScore = stats.fountains / maxFountains;

    const washroomScore = stats.washrooms / maxWashrooms;

    const centreScore = stats.centres / maxCentres;

    const parkScore = stats.parks / maxParks;

    const transitScore = stats.transit / maxTransit;

    const totalScore =
      fountainScore * heatScoreFormula.waterFountains +
      washroomScore * heatScoreFormula.washrooms +
      parkScore * heatScoreFormula.parks +
      centreScore * heatScoreFormula.communityCentres +
      transitScore * heatScoreFormula.transit;

    const geom = L.geoJSON(stats.neighborhood.geom, {
      style: {
        fillColor: getScoreColor(totalScore * 100),
        fillOpacity: 0.4,
        color: "#333",
        weight: 1,
      },
    });

    geom.bindPopup(`
      <b>${stats.neighborhood.name}</b><br>
      Fountains: ${stats.fountains}<br>
      Washrooms: ${stats.washrooms}<br>
      Community Centres: ${stats.centres}<br>
      Transit Stops: ${stats.transit}<br>
      Parks: ${stats.parks}<br><br>

      <b>Normalized Heat Score:</b>
      ${(totalScore * 100).toFixed(1)}
    `);

    neighborhoodGeom.push(geom);
  });
};
/**
 * Toggle neighborhood geometry on map
 */
const toggleNeighborhoodGeom = () => {
  const button = document.getElementById("scoreBtn");

  if (!button.classList.contains("active")) {
    neighborhoodGeom.forEach((geom) => {
      map.removeLayer(geom);
    });
  } else {
    neighborhoodGeom.forEach((geom) => {
      geom.addTo(map);
    });
  }
};

// Event Listener: Map movement (zoom in and zoom out)
map.on("zoomend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.classList.contains("active");
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// Event Listener: Map movement (map movement)
map.on("moveend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.classList.contains("active");
  console.log(treesBtnIsToggled);
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// treesBtn listener: On initial click, we toggle the createTreesMarkers
treesBtn.addEventListener("click", toggleTreesMarkers);

/**
 * Trees API Integration Section (end)
 * Contains: fetching data, toggling markers, creating markers
 */

let userMarker = null; // global variable to hold the user's location marker
let userCircle = null; // global variable to hold the user's location accuracy circle

/**
 * Use the Geolocation API to track the user's location and display it on the map with a marker and accuracy circle. The marker and circle are updated whenever the user's position changes. If there's an error (e.g., permission denied), it logs the error message to the console.
 * Reference: MDN Web Docs (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API)
 * @param {Object} position - The position object returned by the Geolocation API, containing the user's current coordinates and accuracy.
 * @param {Object} error - The error object returned by the Geolocation API if there's an issue retrieving the user's location.
 */
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    const latlng = [latitude, longitude];

    if (!userMarker) {
      // Create the marker and circle
      map.setView(latlng, 15);

      userCircle = L.circle(latlng, {
        radius: accuracy,
        color: "#4A90D9",
        fillColor: "#4A90D9",
        fillOpacity: 0.15,
      }).addTo(map);

      userMarker = L.circleMarker(latlng, {
        radius: 8,
        color: "#fff",
        fillColor: "#4A90D9",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);
    } else {
      // Update position
      userMarker.setLatLng(latlng);
      userCircle.setLatLng(latlng);
      userCircle.setRadius(accuracy);
    }
  },
  (error) => {
    console.warn("Geolocation error:", error.message);
    map.setView([49.2827, -123.1207], 12); // Default to Vancouver if geolocation fails
  },
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
);

let routingControl = null; // global variable to hold the routing control instance
/**
 * Use Leaflet Routing Machine to calculate and display a route from the user's current location to a specified destination (latitude and longitude). If the user's location is not available, it shows an alert. If there's an existing route displayed, it removes it before creating a new one. The route is displayed on the map without the turn-by-turn panel, and users cannot add extra waypoints.
 * @param {number} destinationLat - The latitude of the destination.
 * @param {number} destinationLon - The longitude of the destination.
 * @returns {void}
 * Reference: Leaflet Routing Machine (https://www.liedman.net/leaflet-routing-machine/)
 */
window.routeTo = function (destinationLat, destinationLon) {
  if (!userMarker) {
    alert("Your location is not available yet.");
    return;
  }

  const userLatLng = userMarker.getLatLng();

  // Remove existing route if there is one
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userLatLng.lat, userLatLng.lng),
      L.latLng(destinationLat, destinationLon),
    ],
    router: L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      profile: "foot",
    }),

    routeWhileDragging: false,
    show: false, // hides the turn-by-turn panel
    addWaypoints: false, // prevents user from adding extra waypoints
    lineOptions: {
      styles: [{ color: "#4A90D9", weight: 10, opacity: 0.8 }],
    },
  }).addTo(map);
};

document
  .getElementById("fountainsBtn")
  .addEventListener("click", toggleFountainMarkers);
document
  .getElementById("publicWashroomsBtn")
  .addEventListener("click", toggleWashroomMarkers);
document.getElementById("parksBtn").addEventListener("click", toggleParkGeom);
document
  .getElementById("communityCentresBtn")
  .addEventListener("click", toggleCommunityCentreMarkers);
document
  .getElementById("transitBtn")
  .addEventListener("click", toggleTransitMarkers);
document
  .getElementById("formReports")
  .addEventListener("click", toggleReportMarkers);
document
  .getElementById("scoreBtn")
  .addEventListener("click", toggleNeighborhoodGeom);
fetchReports();

// Wait for all data before fetching neighborhoods
async function fetchAll() {
  await Promise.all([
    fetchParks(),
    fetchWaterFountains(),
    fetchPublicWashrooms(),
    fetchTransitStops(),
    fetchCommunityCentres(),
  ]);
  await fetchNeighborhoods();
}

fetchAll();

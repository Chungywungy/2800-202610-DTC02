import { toggleWashroomMarkers } from "./publicWashroomsApi.js";
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
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Replace temperature
const tempComponent = document.querySelector("temperature-container");

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  tempComponent.loadTemperature(lat, lng);
});

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
    let fountainInfo = result.name.replace(
      "Fountain location:\n",
      "Water Fountain: ",
    );
    marker.bindPopup(fountainInfo);
    fountainMarkers.push(marker);
  }
};

export const toggleFountainMarkers = () => {
  const button = document.getElementById("fountainsBtn");
  if (!button.parentElement.classList.contains("active")) {
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
    geom.bindPopup(park.park_name);
    parkGeom.push(geom);
  }
};

/**
 * Toggle park geometry when the Parks button in the navbar is clicked. Used in site-navbar.js
 */
export const toggleParkGeom = () => {
  const button = document.getElementById("parksBtn");
  if (!button.parentElement.classList.contains("active")) {
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
  const result = await fetch(
    `http://localhost:5500/api/public-trees?zoom=${zoom}&bbox=${bbox}`,
  );
  const treesGeoCluster = await result.json();
  return treesGeoCluster.results;
}

async function createTreesMarkers(treesGeoCluster) {
  // Remove all cluster markers in the layer group
  treeLayerGroup.clearLayers();

  treesGeoCluster.forEach((geoClusterData) => {
    const { lat, lon } = Object.values(geoClusterData)[0].cluster_centroid; // unpacks the data
    const countOfTreesInCluster = geoClusterData.count;

    L.circleMarker([lat, lon], {
      radius: 30,
      color: "green",
      fillColor: "#228B22",
      fillOpacity: 0.6,
    })
      .bindPopup(`${countOfTreesInCluster} trees`)
      .addTo(treeLayerGroup);
  });

  console.log(`Creating ${treesGeoCluster.length} cluster markers`);
}

async function toggleTreesMarkers() {
  const treesGeoCluster = await fetchTreeClusters();
  createTreesMarkers(treesGeoCluster);
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
  const treesBtnIsToggled = treesBtn.parentElement.classList.contains("active");
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// Event Listener: Map movement (map movement)
map.on("moveend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.parentElement.classList.contains("active");
  console.log(treesBtnIsToggled);
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// treesBtn listener: On initial click, we toggle the createTreesMarkers
treesBtn.addEventListener("click", () => {
  const isActive = treesBtn.parentElement.classList.contains("active");
  if (isActive) debouncedToggleTreeMarkers();
  else {
    treeLayerGroup.clearLayers();
  }
});

/**
 * Trees API Integration Section (end)
 * Contains: fetching data, toggling markers, creating markers
 */

document
  .getElementById("fountainsBtn")
  .addEventListener("click", toggleFountainMarkers);
document
  .getElementById("publicWashroomsBtn")
  .addEventListener("click", toggleWashroomMarkers);
document.getElementById("parksBtn").addEventListener("click", toggleParkGeom);

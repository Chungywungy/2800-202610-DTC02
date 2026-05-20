import { map, setTileLayer } from "./mapInit.js";
import { fetchWaterFountains, toggleFountainMarkers } from "./water.js";
import { fetchParks, createParkGeom, toggleParkGeom } from "./parks.js";
import { fetchPublicWashrooms, toggleWashroomMarkers } from "./washroom.js";
import { fetchTransitStops, toggleTransitMarkers } from "./transit.js";
import {
  fetchCommunityCentres,
  toggleCommunityCentreMarkers,
} from "./communityCentres.js";
import { fetchReports, toggleReportMarkers } from "./report.js";
import {
  loadNeighborhoodOptions,
  loadSummary,
  toggleSummaryNeighborhoodSelect,
} from "./summaryAI.js";
import { initTrees } from "./trees.js";

/**
 * Submits a user feedback report to the backend API.
 *
 * @async
 * @param {number} lat - Latitude of the report location.
 * @param {number} lng - Longitude of the report location.
 * @param {string} address - Address of the report location.
 */
window.submitReport = async function (lat, lng, address) {
  const formText = document.getElementById("reportText").value;

  if (!formText) {
    window.showToast("Please fill in all fields", "error");
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
      window.showToast("You must be logged in to submit feedback", "error");
      return;
    }

    // OTHER SERVER ERROR
    if (!res.ok) {
      window.showToast(data.error || "Failed to submit report", "error");
      return;
    }

    // SUCCESS
    map.closePopup();
    window.showToast("Report submitted!", "success");

    // Refresh achievements display if the function exists
    // fetch username
    const usernameResponse = await fetch("/api/user");
    const usernameObject = await usernameResponse.json();
    const username = usernameObject.user.username;

    if (data.achievementUnlocked) {
      window.showToast("Achievement unlocked: Report", "success");
    }
  } catch (error) {
    console.log(error);
    window.showToast("Failed to submit report", "error");
  }
};

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
 * Shade API Integration Section (end)
 * Contains: fetching data and creating shade layer
 */
const res = await fetch("/api/key");
const { key } = await res.json();

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
 * Fetches neighborhood data from the backend and creates
 * neighborhood geometry layers.
 *
 * @async
 * @param {Array} parkData - Array of park data.
 * @param {Array} fountainData - Array of fountain data.
 * @param {Array} washroomData - Array of washroom data.
 * @param {Object} transitData - Transit stop GeoJSON data.
 * @param {Array} communityCentresData - Array of community centre data.
 */
const fetchNeighborhoods = async (
  parkData,
  fountainData,
  washroomData,
  transitData,
  communityCentresData,
) => {
  neighborhoodData = [];

  try {
    const results = await fetch("/api/neighborhoods");
    const resultsJSON = await results.json();

    // actual records array
    neighborhoodData = resultsJSON.results;
  } catch (error) {
    console.log(error);
  }

  createNeighborhoodGeom(
    parkData,
    fountainData,
    washroomData,
    transitData,
    communityCentresData,
  );
};

// Fetch formula from db, either default or user specified
let heatScoreFormula = {
  waterFountains: 0.2,
  washrooms: 0.2,
  parks: 0.2,
  communityCentres: 0.2,
  transit: 0.2,
};

/**
 * Fetches the user's saved cool score formula.
 *
 * @async
 */
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
};

/**
 * Creates neighborhood polygon layers and calculates
 * normalized heat scores and rankings.
 *
 * @param {Array} parkData - Array of park data.
 * @param {Array} fountainData - Array of fountain data.
 * @param {Array} washroomData - Array of washroom data.
 * @param {Object} transitData - Transit stop GeoJSON data.
 * @param {Array} communityCentresData - Array of community centre data.
 */
const createNeighborhoodGeom = (
  parkData,
  fountainData,
  washroomData,
  transitData,
  communityCentresData,
) => {
  neighborhoodGeom = [];

  const neighborhoodStats = [];

  // Gather counts for every neighborhood
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

  // Next calculate all scores first
  const scoredNeighborhoods = neighborhoodStats.map((stats) => {
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

    return {
      ...stats,
      totalScore,
    };
  });

  // sort highest to lowest
  scoredNeighborhoods.sort((a, b) => b.totalScore - a.totalScore);

  // create polygons with ranked colors
  scoredNeighborhoods.forEach((stats, index) => {
    let fillColor;

    if (index < 5) {
      fillColor = "#97C459"; // green
    } else if (index < 10) {
      fillColor = "#F5E663"; // yellow
    } else if (index < 15) {
      fillColor = "#EF9F27"; // orange
    } else {
      fillColor = "#E24B4A"; // red
    }

    const geom = L.geoJSON(stats.neighborhood.geom, {
      style: {
        fillColor: fillColor,
        fillOpacity: 0.4,
        color: "#333",
        weight: 1,
      },
    });

    geom.bindPopup(`
    <b>${stats.neighborhood.name}</b><br>
    Rank: ${index + 1}<br><br>

    Fountains: ${stats.fountains}<br>
    Washrooms: ${stats.washrooms}<br>
    Community Centres: ${stats.centres}<br>
    Transit Stops: ${stats.transit}<br>
    Parks: ${stats.parks}<br><br>

    <b>Normalized Cool Score:</b>
    ${(stats.totalScore * 100).toFixed(1)}
  `);

    neighborhoodGeom.push(geom);
  });
};

/**
 * Toggles neighborhood score polygons on or off the map.
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
 * Reference: Leaflet Routing Machine (https://www.liedman.net/leaflet-routing-machine/)
 */
window.routeTo = function (destinationLat, destinationLon) {
  if (!userMarker) {
    window.showToast("Your location is not available yet.", "error");
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

function addThemeController() {
  const themeButtons = document.querySelectorAll(
    "#themeControllerContainer input",
  );
  const themePalette = {
    default: "voyager",
    cyberpunk: "light_all",
    synthwave: "dark_all",
    luxury: "dark_nolabels",
  };
  const storageKey = "selectedMapTheme";

  themeButtons.forEach((theme) => {
    theme.addEventListener("change", () => {
      const selectedTheme = theme.value;
      setTileLayer(themePalette[selectedTheme] || themePalette.default);
      localStorage.setItem(storageKey, selectedTheme);
    });
  });

  const savedTheme = localStorage.getItem(storageKey);
  const initialTheme =
    savedTheme && themePalette[savedTheme] ? savedTheme : "default";
  const defaultButton = Array.from(themeButtons).find(
    (button) => button.value === initialTheme,
  );

  if (defaultButton) {
    defaultButton.checked = true;
    setTileLayer(themePalette[initialTheme]);
  }
}

document.getElementById("fountainsBtn").addEventListener("click", () => {
  toggleFountainMarkers(map);
});
document.getElementById("publicWashroomsBtn").addEventListener("click", () => {
  toggleWashroomMarkers(map);
});
document.getElementById("parksBtn").addEventListener("click", () => {
  toggleParkGeom(map);
});
document.getElementById("communityCentresBtn").addEventListener("click", () => {
  toggleCommunityCentreMarkers(map);
});
document.getElementById("transitBtn").addEventListener("click", () => {
  toggleTransitMarkers(map);
});
document.getElementById("formReports").addEventListener("click", () => {
  toggleReportMarkers(map);
});
document
  .getElementById("scoreBtn")
  .addEventListener("click", toggleNeighborhoodGeom);
fetchReports();

/**
 * Fetches all required datasets in parallel and initializes
 * neighborhood scoring.
 *
 * @async
 */
async function fetchAll() {
  // Loading Spinner. Spinner is on by default
  const loadingSpinner = document.querySelector("#spinningModalContainer");

  const [
    parkData,
    fountainData,
    washroomData,
    transitData,
    communityCentresData,
    _heat,
  ] = await Promise.all([
    fetchParks(),
    fetchWaterFountains(),
    fetchPublicWashrooms(),
    fetchTransitStops(),
    fetchCommunityCentres(),
    fetchHeatScoreFormula(),
    // new Promise((resolve) => setTimeout(resolve, 3000)), // Add delay for animation UNDO comment when in production
  ]);

  await fetchNeighborhoods(
    parkData,
    fountainData,
    washroomData,
    transitData,
    communityCentresData,
  );

  addThemeController();
  // Hide Spinner
  loadingSpinner.classList.add("hidden");
  loadingSpinner.classList.remove("flex");
}
initTrees(map);
fetchAll();

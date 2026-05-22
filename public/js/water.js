let fountainMarkers = [];

/**
 * Custom Leaflet icon used for water fountain markers.
 *
 * @constant
 * @type {L.DivIcon}
 */
const fountainIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center w-9 h-11">
      <div class="w-9 h-9 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-none bg-info flex items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-xl text-info-content leading-none">
          water_drops
        </span>
      </div>
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Fetches water fountain data from the backend API, creates map markers,
 * and returns the fountain data.
 *
 * @async
 * @returns {Promise<Array>} Array of water fountain objects.
 */
export const fetchWaterFountains = async () => {
  let fountainData = [];

  try {
    const result = await fetch("/api/fountains");

    const resultJSON = await result.json();

    fountainData = resultJSON;
  } catch (error) {
    console.log(error);
  }

  createFountainMarkers(fountainData);
  return fountainData;
};

/**
 * Creates Leaflet markers for each water fountain and stores them
 * in the fountainMarkers array.
 *
 * @param {Array} fountainData - Array of water fountain data objects.
 */
export const createFountainMarkers = (fountainData) => {
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

/**
 * Toggles water fountain markers on or off the map depending on
 * whether the fountains button has the active class.
 *
 * @param {L.Map} map - The Leaflet map instance.
 */
export const toggleFountainMarkers = (map) => {
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

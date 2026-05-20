// Park geometry array
let parkGeom = [];

/**
 * @description Fetch raw park data from backend route and push to parkData array
 * @returns {Array} parkData array with data fetched from backend
 */
export const fetchParks = async () => {
  let parkData = [];

  try {
    const results = await fetch("/api/parks");
    const resultsJSON = await results.json();

    parkData = resultsJSON;
  } catch (error) {
    console.log(error);
  }

  createParkGeom(parkData);
  return parkData;
};

/**
 * @description Push park geometry data from each park to parkGeom array and adds park location to popup for
 * wayfinding.
 * @param {Array} parkData array with parks data fetched from backend
 */
export const createParkGeom = async (parkData) => {
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
 * @description Toggle park geometry when the Parks button in the navbar is clicked. Used in site-navbar.js
 * @param {Object} Map object
 */
export const toggleParkGeom = (map) => {
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

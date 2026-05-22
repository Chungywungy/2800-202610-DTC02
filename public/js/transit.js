let transitLayer;

const inVancouver = (lat, lng) => {
  return lat >= 49.2 && lat <= 49.32 && lng >= -123.25 && lng <= -123.02;
};

export const fetchTransitStops = async () => {
  // console.log("Fetching transit stops...");
  let transitData;
  try {
    const res = await fetch("/data/stops.geojson");
    transitData = await res.json();
    // console.log("Loaded stops:", transitData.features.length);
  } catch (error) {
    console.log("Error:", error);
  }
  createTransitLayer(transitData);
  return transitData;
};

const createTransitLayer = (transitData) => {
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

export const toggleTransitMarkers = (map) => {
  const button = document.getElementById("transitBtn");
  if (button.classList.contains("active")) {
    if (!transitLayer);
    transitLayer.addTo(map);
  } else {
    if (transitLayer) map.removeLayer(transitLayer);
  }
};

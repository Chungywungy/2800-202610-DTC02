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
  zoomControl: false,
}).fitBounds(bounds);

let tileLayer;
let mapStyle = "voyager";

function setTileLayer(style) {
  mapStyle = style;
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }
  tileLayer = L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}{r}.png`,
    { minZoom: 12 },
  ).addTo(map);
  map.invalidateSize();
}

// Initialize with default
setTileLayer(mapStyle);

export { setTileLayer };

map.getContainer().style.backgroundColor = "#eef7ff";

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

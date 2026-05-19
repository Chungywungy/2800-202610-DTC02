/**
 * Stores all report markers displayed on the map.
 *
 * @type {Array}
 */
let reportMarkers = [];

/**
 * Custom Leaflet icon used for report markers.
 *
 * @constant
 * @type {L.DivIcon}
 */
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

/**
 * Fetches report data from the backend and creates report markers.
 *
 * @async
 * @returns {Promise<void>}
 */
export const fetchReports = async () => {
  let reportData = [];
  try {
    const result = await fetch("/api/reports");
    const resultJSON = await result.json();
    reportData = resultJSON;
  } catch (error) {
    console.log(error);
  }
  createReportMarkers(reportData);
};

/**
 * Creates map markers for submitted user reports and stores them
 * in the reportMarkers array.
 *
 * @param {Array} reportData - Array of user report objects.
 * @returns {void}
 */
const createReportMarkers = (reportData) => {
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

/**
 * Toggles report markers on or off the map. Users must be logged in
 * to view submitted reports.
 *
 * @async
 * @param {L.Map} map - Leaflet map instance.
 * @returns {Promise<void>}
 */
export const toggleReportMarkers = async (map) => {
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

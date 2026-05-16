// Display public washrooms
let washroomMarkers = [];

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

export const fetchPublicWashrooms = async () => {
  let washroomData = [];
  try {
    const result = await fetch("/api/washrooms");
    const resultJSON = await result.json();
    washroomData = resultJSON;
  } catch (error) {
    console.log(error);
  }
  createWashroomMarkers(washroomData);
  return washroomData;
};

export const createWashroomMarkers = (washroomData) => {
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

export const toggleWashroomMarkers = (map) => {
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

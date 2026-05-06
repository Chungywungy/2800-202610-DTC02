// publicWashroomsApi.js
import { map } from "./map.js";

let washroomMarkers = [];
let washroomData = [];
let washroomVisible = false;

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
    const limit = 100;
    let offset = 0;

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-washrooms/records?limit=${limit}&offset=${offset}`,
      );
      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        washroomData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) break;
      offset += limit;
    }
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
    let washroomInfo = `<b>${result.park_name}</b><br>${result.type}<br>Summer: ${result.summer_hours}<br>Wheelchair: ${result.wheelchair_access}`;
    marker.bindPopup(washroomInfo);
    washroomMarkers.push(marker);
  }
};

export const toggleWashroomMarkers = () => {
  if (washroomVisible) {
    washroomMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
    washroomVisible = false;
  } else {
    washroomMarkers.forEach((marker) => {
      marker.addTo(map);
    });
    washroomVisible = true;
  }
};

fetchPublicWashrooms();

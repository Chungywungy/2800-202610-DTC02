// Display public washrooms
let washroomMarkers = [];

const washroomIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center w-9 h-11">
      <div class="w-9 h-9 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-none bg-primary flex items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-xl text-primary-content leading-none">
          wc
        </span>
      </div>
    </div>
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

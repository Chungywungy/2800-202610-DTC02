let communityCentresMarkers = [];

const centreIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center w-9 h-11">
      <div class="w-9 h-9 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-none bg-accent flex items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-xl text-accent-content leading-none">
          family_group
        </span>
      </div>
    </div>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Fetch community centres from backend and create markers
 */
export const fetchCommunityCentres = async () => {
  let communityCentresData = [];
  try {
    const result = await fetch("/api/community-centres");
    const text = await result.text();
    communityCentresData = JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
  createCommunityCentreMarkers(communityCentresData);
  return communityCentresData;
};

/**
 * Create community centre markers and bind popups
 */
const createCommunityCentreMarkers = (communityCentresData) => {
  communityCentresMarkers = [];
  for (let i = 0; i < communityCentresData.length; i++) {
    const result = communityCentresData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: centreIcon });
    let centreInfo = `Location: <b>${result.name}</b><br>
      <br><button onclick="routeTo(${latValue}, ${lonValue})" class="text-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Directions</button>`;

    marker.bindPopup(centreInfo);
    communityCentresMarkers.push(marker);
  }
};

/**
 * Toggle community centre markers on the map based on button state
 */
export const toggleCommunityCentreMarkers = (map) => {
  const button = document.getElementById("communityCentresBtn");
  if (button.classList.contains("active")) {
    communityCentresMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  } else {
    communityCentresMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  }
};

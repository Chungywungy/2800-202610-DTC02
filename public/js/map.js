// Vancouver coordinates
const bounds = [
  [49.18, -123.25],
  [49.35, -123.0],
];

// setup map boundaries, can remove this export if fetching from backend
export const map = L.map("map", {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
}).fitBounds(bounds);

// Display map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Replace temperature
const tempComponent = document.querySelector("temperature-container");

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  tempComponent.loadTemperature(lat, lng);
});

// ShadeMap setup
const shadeMap = L.shadeMap({
  date: new Date(), // display shadows for current date
  color: "#01112f", // shade color
  opacity: 0.7, // opacity of shade color
  apiKey:
    "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNteW5vdHRAbXkuYmNpdC5jYSIsImNyZWF0ZWQiOjE3Nzc1MTc5MDM5NDEsImlhdCI6MTc3NzUxNzkwM30.6JkOLWAxbMQdutbK56QRUXTfBt6NWdFDNDV9rakoVU8", // obtain from https://shademap.app/about/
  terrainSource: {
    tileSize: 256, // DEM tile size
    maxZoom: 15, // Maximum zoom of DEM tile set
    getSourceUrl: ({ x, y, z }) => {
      // return DEM tile url for given x,y,z coordinates
      return `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
    },
    getElevation: ({ r, g, b, a }) => {
      // return elevation in meters for a given DEM tile pixel
      return r * 256 + g + b / 256 - 32768;
    },
  },
  // Buildings
  getFeatures: async () => {
    if (map.getZoom() > 15) {
      const bounds = map.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();
      const query = `https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cbuilding%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Cbuilding%E2%80%9D%0A%20%20way%5B%22building%22%5D%28${south}%2C${west}%2C${north}%2C${east}%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`;
      const response = await fetch(query);
      const json = await response.json();
      const geojson = osmtogeojson(json);
      // If no building height, default to one storey of 3 meters
      geojson.features.forEach((feature) => {
        if (!feature.properties) {
          feature.properties = {};
        }
        if (!feature.properties.height) {
          feature.properties.height = 3;
        }
      });
      return geojson.features;
    }
    return [];
  },
  debug: (msg) => {
    console.log(new Date().toISOString(), msg);
  },
}).addTo(map);

// Display water fountains
let fountainMarkers = [];
let fountainData = [];

// from svgrepo https://www.svgrepo.com/svg/509452/water-fountain
const fountainIcon = L.divIcon({
  html: `
    <svg viewBox="0 0 60.6 60.6" width="32" height="32">
      <path d="M7.78 56.03c-1.78 0-3.22-1.44-3.22-3.22V7.78c0-1.78 1.44-3.22 3.22-3.22h45.03c1.78 0 3.22 1.44 3.22 3.22v45.03c0 1.78-1.44 3.22-3.22 3.22H7.78z" fill="#ffffff" stroke="#000" stroke-width="0.6"/>
      
      <path d="M32.7 24.19v1.57c0 .77.34 1.46.87 1.93l7.76 6.47h4.23v-9.97H32.7z" fill="#0077ff"/>
      
      <path d="M33.64 12.13c-1.78-.06-3.27 1.33-3.33 3.1-.06 1.78 1.33 3.26 3.1 3.33 1.78.06 3.27-1.33 3.33-3.1.06-1.78-1.33-3.27-3.1-3.33z" fill="#0077ff"/>
      
      <path d="M30.77 20.65c0-1.98-.9-3.75-2.3-4.93-.08-.07-.19-.11-.3-.11-.11 0-.21.04-.29.1l-11.2 8.44c-.97.73-1.6 1.9-1.6 3.21 0 .24.02.47.06.7l3.74 21.21h3.54V28.18l4.83-2.82.25 2.23c.09.77.52 1.44 1.14 1.85l4.32 2.81 2.21-1.28-4.4-3.7v-6.61z" fill="#0077ff"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const fetchWaterFountains = async () => {
  fountainData = [];

  try {
    const result = await fetch("/api/fountains");

    const resultJSON = await result.json();

    fountainData = resultJSON;
  } catch (error) {
    console.log(error);
  }

  createFountainMarkers();
};

const createFountainMarkers = () => {
  fountainMarkers = [];
  for (let i = 0; i < fountainData.length; i++) {
    const result = fountainData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: fountainIcon });
    let fountainInfo = result.name.replace(
      "Fountain location:\n",
      "Water Fountain: ",
    );
    marker.bindPopup(fountainInfo);
    fountainMarkers.push(marker);
  }
};

export const toggleFountainMarkers = () => {
  const button = document.getElementById("fountainsBtn");
  if (!button.parentElement.classList.contains("active")) {
    fountainMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  } else {
    fountainMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  }
};

fetchWaterFountains();

let communityCentresMarkers = [];
let communityCentresData = [];

const centreIcon = L.divIcon({
  html: `
    <svg height="32px" width="32px" version="1.1" id="_x35_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon style="fill:#E9E7C2;" points="492.176,184.586 490.633,213.753 477.228,464.553 34.772,464.553 22.748,239.751 21.367,213.753 19.824,184.586 "></polygon> <polygon style="fill:#9B7453;" points="495.182,464.553 493.477,493.882 18.523,493.882 17.305,473.003 16.817,464.553 "></polygon> <g> <g> <polygon style="fill:#AAD2D6;" points="126.019,339.279 63.431,339.279 61.071,287.036 124.426,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="127.904,401.109 66.225,401.109 63.933,350.381 126.357,350.381 "></polygon> </g> <g> <polygon style="fill:#AAD2D6;" points="204.56,339.279 141.973,339.279 140.575,287.036 203.929,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="205.306,401.109 143.627,401.109 142.27,350.381 204.694,350.381 "></polygon> </g> <g> <polygon style="fill:#AAD2D6;" points="283.101,339.279 220.514,339.279 220.079,287.036 283.433,287.036 "></polygon> <polygon style="fill:#AAD2D6;" points="282.708,401.109 221.028,401.109 220.606,350.381 283.03,350.381 "></polygon> </g> </g> <path style="fill:#D06868;" d="M392.544,245.69H380.65c-29.252,0-53.6,25.233-54.099,55.678l-2.692,164.089h112.298l7.147-164.089 C444.631,270.922,421.796,245.69,392.544,245.69z"></path> <polygon style="fill:#E0E0E0;" points="434.314,493.886 322.744,493.886 323.221,464.53 435.589,464.53 "></polygon> <polygon style="fill:#9B7453;" points="512,213.753 0,213.753 67.595,84.574 444.405,84.574 463.822,121.703 "></polygon> <g> <polygon style="fill:#E9E7C2;" points="251.613,174.756 104.642,174.756 104.074,158.426 101.555,84.574 100.255,46.715 175.081,0 229.352,33.147 251.531,46.715 251.531,84.574 "></polygon> <g> <polygon style="fill:#AAD2D6;" points="157.973,141.819 132.026,141.819 130.436,84.592 156.715,84.592 "></polygon> <polygon style="fill:#AAD2D6;" points="190.534,141.819 164.587,141.819 163.414,84.592 189.694,84.592 "></polygon> <polygon style="fill:#AAD2D6;" points="223.095,141.819 197.148,141.819 196.393,84.592 222.673,84.592 "></polygon> </g> </g> <path style="fill:#E9E7C2;" d="M427.249,358.216c-0.327,8.109-6.945,14.66-14.783,14.66c-7.837,0-13.97-6.551-13.697-14.66 c0.274-8.14,6.894-14.762,14.786-14.762S427.577,350.077,427.249,358.216z"></path> </g> <polygon style="opacity:0.1;fill:#040000;" points="490.633,213.753 512,213.753 463.822,121.703 444.405,84.574 256,84.574 256,493.882 322.744,493.882 322.744,493.885 434.314,493.885 434.314,493.882 493.477,493.882 495.182,464.553 477.228,464.553 "></polygon> </g> </g></svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/**
 * Fetch community centres from backend and create markers
 */
const fetchCommunityCentres = async () => {
  communityCentresData = [];
  try {
    const result = await fetch("/api/community-centres");
    const text = await result.text();
    communityCentresData = JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
  createCommunityCentreMarkers();
};

/**
 * Create community centre markers and bind popups
 */
const createCommunityCentreMarkers = () => {
  communityCentresMarkers = [];
  for (let i = 0; i < communityCentresData.length; i++) {
    const result = communityCentresData[i];
    let lonValue = result.geo_point_2d["lon"];
    let latValue = result.geo_point_2d["lat"];
    const marker = L.marker([latValue, lonValue], { icon: centreIcon });
    let centreInfo = result.name.replace(
      "Community Centre location:\n",
      "Community Centre: ",
    );
    marker.bindPopup(centreInfo);
    communityCentresMarkers.push(marker);
  }
};

/**
 * Toggle community centre markers on the map based on button state
 */
export const toggleCommunityCentreMarkers = () => {
  const button = document.getElementById("communityCentresBtn");
  if (button.parentElement.classList.contains("active")) {
    communityCentresMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  } else {
    communityCentresMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  }
};

fetchCommunityCentres();

// Vancouver coordinates
const bounds = [
  [49.18, -123.25],
  [49.35, -123.0],
];

// setup map boundaries
let map = L.map("map", {
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
  // getFeatures: async () => {
  //   if (map.getZoom() > 15) {
  //     const bounds = map.getBounds();
  //     const north = bounds.getNorth();
  //     const south = bounds.getSouth();
  //     const east = bounds.getEast();
  //     const west = bounds.getWest();
  //     const query = `https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cbuilding%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Cbuilding%E2%80%9D%0A%20%20way%5B%22building%22%5D%28${south}%2C${west}%2C${north}%2C${east}%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`;
  //     const response = await fetch(query);
  //     const json = await response.json();
  //     const geojson = osmtogeojson(json);
  //     // If no building height, default to one storey of 3 meters
  //     geojson.features.forEach((feature) => {
  //       if (!feature.properties) {
  //         feature.properties = {};
  //       }
  //       if (!feature.properties.height) {
  //         feature.properties.height = 3;
  //       }
  //     });
  //     return geojson.features;
  //   }
  //   return [];
  // },
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

// Display parks
let parkMarkers = [];
let parkData = [];

// from svgrepo http://svgrepo.com/svg/297751/park-picnic
const parkIcon = L.divIcon({
  html: `
    <svg height="32px" width="32px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
      <path style="fill:#A66342;" d="M217.043,294.668h-66.783c-9.223,0-16.696,7.473-16.696,16.696v183.94
        c0,9.223,7.473,16.696,16.696,16.696h66.783c9.223,0,16.696-7.473,16.696-16.696v-183.94
        C233.739,302.141,226.266,294.668,217.043,294.668z"/>
      <path style="fill:#995B3D;" d="M217.043,294.668h-33.391V512h33.391c9.223,0,16.696-7.473,16.696-16.696v-183.94
        C233.739,302.141,226.266,294.668,217.043,294.668z"/>
      <path style="fill:#7BCC29;" d="M495.304,512H16.696C7.473,512,0,504.527,0,495.304s7.473-16.696,16.696-16.696h478.609
        c9.217,0,16.696,7.473,16.696,16.696S504.521,512,495.304,512z"/>
      <path style="fill:#A66342;" d="M371.978,428.535l-54.761,54.985c-3.214,3.269-4.826,7.531-4.84,11.784h40.216l42.536-43.06
        l43.148,43.06h40.356c-0.014-4.253-1.653-8.515-4.922-11.784l-54.65-54.984l54.65-54.984c4.137-4.138,5.662-9.865,4.586-15.152
        h-36.646l-46.522,46.427L348.985,358.4h-36.276c-1.058,5.287,0.441,11.014,4.509,15.152L371.978,428.535z"/>
      <path style="fill:#995B3D;" d="M478.634,495.304c-0.014-4.253-1.653-8.515-4.922-11.784l-54.65-54.984l54.65-54.984
        c4.137-4.138,5.662-9.865,4.586-15.152h-36.646l-46.522,46.427v47.416l43.148,43.061H478.634z"/>
      <path style="fill:#FFDE33;" d="M495.304,378.449H294.957c-9.223,0-16.696-7.473-16.696-16.696c0-9.223,7.473-16.696,16.696-16.696
        h200.348c9.223,0,16.696,7.473,16.696,16.696C512,370.976,504.527,378.449,495.304,378.449z"/>
      <path style="fill:#FFBC33;" d="M495.304,345.058H395.13v33.391h100.174c9.223,0,16.696-7.473,16.696-16.696
        C512,352.531,504.527,345.058,495.304,345.058z"/>
      <path style="fill:#6EB825;" d="M495.304,478.609H183.652V512h311.652c9.217,0,16.696-7.473,16.696-16.696
        S504.521,478.609,495.304,478.609z"/>
      <path style="fill:#7BCC29;" d="M300.41,111.861C297.739,49.753,246.428,0,183.652,0C120.988,0,69.788,49.53,66.894,111.527
        C25.824,131.005,0,173.635,0,217.043c0,64.445,52.424,116.87,116.87,116.87c23.93,0,47.082-7.457,66.783-21.37
        c19.701,13.913,42.852,21.37,66.783,21.37c64.445,0,116.87-52.424,116.87-116.87C367.304,171.854,340.925,131.005,300.41,111.861z"
        />
      <path style="fill:#6EB825;" d="M367.304,217.043c0,64.445-52.424,116.87-116.87,116.87c-23.93,0-47.082-7.457-66.783-21.37V0
        c62.776,0,114.087,49.753,116.758,111.861C340.925,131.005,367.304,171.854,367.304,217.043z"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const fetchParks = async () => {
  parkData = [];

  try {
    const results = await fetch("/api/parks");
    const resultsJSON = await results.json();

    parkData = resultsJSON;
  } catch (error) {
    console.log(error);
  }

  console.log(parkData);

  createParkMarkers();
};

const createParkMarkers = async () => {
  parkMarkers = [];

  for (let i = 0; i < parkData.length; i++) {
    const park = parkData[i];
    const lon = park.geo_point_2d.lon;
    const lat = park.geo_point_2d.lat;
    const marker = L.marker([lat, lon], { icon: parkIcon });

    parkMarkers.push(marker);
  }
};

export const toggleParkMarkers = () => {
  const button = document.getElementById("parksBtn");
  if (!button.parentElement.classList.contains("active")) {
    parkMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
  } else {
    parkMarkers.forEach((marker) => {
      marker.addTo(map);
    });
  }
};

fetchParks();
fetchWaterFountains();

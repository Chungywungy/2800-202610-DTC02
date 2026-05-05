fetchShadeAPIKey = async function () {
  const result = await fetch("/shadeAPIKey");
  return await result.text();
};

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

// ShadeMap setup
// displayShadeMap = async function () {
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
// };

// displayShadeMap();

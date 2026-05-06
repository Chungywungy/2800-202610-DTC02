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
    // console.log(new Date().toISOString(), msg);
  },
}).addTo(map);

/**
 * Trees API Integration Section (start)
 * Contains: fetching data, toggling markers, creating markers
 */
let treeLayerGroup = L.layerGroup().addTo(map);

async function fetchTreeClusters() {
  const zoom = map.getZoom(); // get map's current zoom level
  const bounds = map.getBounds(); // get current map viewport bounds
  const bbox = [
    bounds.getSouth(),
    bounds.getWest(),
    bounds.getNorth(),
    bounds.getEast(),
  ]; // normalize the bounds into a format that the API accepts

  // fetch the tree clusters from our backend server
  const result = await fetch(
    `http://localhost:5500/api/public-trees?zoom=${zoom}&bbox=${bbox}`,
  );
  const treesGeoCluster = await result.json();
  return treesGeoCluster.results;
}

async function createTreesMarkers(treesGeoCluster) {
  // Remove all cluster markers in the layer group
  treeLayerGroup.clearLayers();

  treesGeoCluster.forEach((geoClusterData) => {
    const { lat, lon } = Object.values(geoClusterData)[0].cluster_centroid; // unpacks the data
    const countOfTreesInCluster = geoClusterData.count;

    L.circleMarker([lat, lon], {
      radius: 30,
      color: "green",
      fillColor: "#228B22",
      fillOpacity: 0.6,
    })
      .bindPopup(`${countOfTreesInCluster} trees`)
      .addTo(treeLayerGroup);
  });

  console.log(`Creating ${treesGeoCluster.length} cluster markers`);
}

async function toggleTreesMarkers() {
  const treesGeoCluster = await fetchTreeClusters();
  createTreesMarkers(treesGeoCluster);
}

/**
 * Decorate a function by adding a delay. Can be used for map event listeners (zoom-in, zoom-out, map movement)
 * Reference: Stack Overflow (74981172)
 */
const debounce = (fn, delay = 1000) => {
  let timer; // holds the current timer ID
  return (...args) => {
    clearTimeout(timer); // cancel the previous timer if it exists
    timer = setTimeout(() => fn(...args), delay); // start a fresh one
  };
};

const debouncedToggleTreeMarkers = debounce(toggleTreesMarkers);

// Event Listener: Map movement (zoom in and zoom out)
map.on("zoomend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.parentElement.classList.contains("active");
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// Event Listener: Map movement (map movement)
map.on("moveend", () => {
  // check if treesBtn is clicked:
  const treesBtnIsToggled = treesBtn.parentElement.classList.contains("active");
  console.log(treesBtnIsToggled);
  if (treesBtnIsToggled) debouncedToggleTreeMarkers();
});

// treesBtn listener: On initial click, we toggle the createTreesMarkers
const treesBtn = document.getElementById("treesBtn");
treesBtn.addEventListener("click", () => {
  const isActive = treesBtn.parentElement.classList.contains("active");
  if (isActive) debouncedToggleTreeMarkers();
  else {
    treeLayerGroup.clearLayers();
  }
});

/**
 * Trees API Integration Section (end)
 * Contains: fetching data, toggling markers, creating markers
 */

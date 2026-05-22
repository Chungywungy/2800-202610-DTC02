/**
 * Trees API Integration Section (start)
 * Contains: fetching data, toggling markers, creating markers
 */

async function fetchTreeClusters(map) {
  const zoom = map.getZoom(); // get map's current zoom level
  const bounds = map.getBounds(); // get current map viewport bounds
  const bbox = [
    bounds.getSouth(),
    bounds.getWest(),
    bounds.getNorth(),
    bounds.getEast(),
  ]; // normalize the bounds into a format that the API accepts

  // fetch the tree clusters from our backend server
  const result = await fetch(`/api/public-trees?zoom=${zoom}&bbox=${bbox}`);
  const treesGeoCluster = await result.json();
  return treesGeoCluster.results;
}

function getClusterColor(treeClusterCount) {
  if (treeClusterCount >= 1000) return "#1b4332";
  if (treeClusterCount >= 500) return "#2d6a4f";
  if (treeClusterCount >= 100) return "#40916c";
  if (treeClusterCount >= 50) return "#52b788";
  if (treeClusterCount >= 10) return "#74c69d";
  return "#95d5b2";
}

function getTreeIcon(treeClusterCount) {
  const size = 40;
  return L.divIcon({
    className: "",
    html: `
    <div class="relative flex flex-col items-center w-9 h-11">
      <div class="w-9 h-9 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-none bg-success flex items-center justify-center shadow-md">
        <span class="material-symbols-outlined text-xl text-success-content leading-none">
          park
        </span>
      </div>
    </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -22],
  });
}

function getTreesIcon(treeClusterCount) {
  return L.divIcon({
    className: "",
    html: `
      <div class="text-white bg-[${getClusterColor(treeClusterCount)}]/90 w-11 h-11 flex justify-center items-center rounded-full p-4 indicator">
        ${treeClusterCount}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -22],
  });
}

async function createTreesMarkers(treesGeoCluster, treeLayerGroup) {
  // Remove all cluster markers in the layer group
  treeLayerGroup.clearLayers();

  treesGeoCluster.forEach((geoClusterData) => {
    const { lat, lon } = Object.values(geoClusterData)[0].cluster_centroid; // unpacks the data
    const treeClusterCount = geoClusterData.count;

    // dynamic marker visualization based on cluster size
    let treeMarker;

    if (treeClusterCount === 1) treeMarker = getTreeIcon();
    else treeMarker = getTreesIcon(treeClusterCount);

    L.marker([lat, lon], { icon: treeMarker })
      .bindPopup(
        `${treeClusterCount} ${treeClusterCount == 1 ? "tree" : "trees"}`,
      )
      .addTo(treeLayerGroup);
  });

  console.log(`Creating ${treesGeoCluster.length} cluster markers`);
}

async function toggleTreesMarkers(map, treeLayerGroup) {
  const isActive = treesBtn.classList.contains("active");
  if (isActive) {
    const treesGeoCluster = await fetchTreeClusters(map);
    createTreesMarkers(treesGeoCluster, treeLayerGroup);
  } else treeLayerGroup.clearLayers();
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

export function initTrees(map) {
  let treeLayerGroup = L.layerGroup().addTo(map);

  const debouncedToggleTreeMarkers = debounce(toggleTreesMarkers);
  const treesBtn = document.getElementById("treesBtn");

  // Event Listener: Map movement (zoom in and zoom out)
  map.on("zoomend", () => {
    // check if treesBtn is clicked:
    const treesBtnIsToggled = treesBtn.classList.contains("active");
    if (treesBtnIsToggled) debouncedToggleTreeMarkers(map, treeLayerGroup);
  });

  // Event Listener: Map movement (map movement)
  map.on("moveend", () => {
    // check if treesBtn is clicked:
    const treesBtnIsToggled = treesBtn.classList.contains("active");
    // console.log(treesBtnIsToggled);
    if (treesBtnIsToggled) debouncedToggleTreeMarkers(map, treeLayerGroup);
  });

  // treesBtn listener: On initial click, we toggle the createTreesMarkers
  treesBtn.addEventListener("click", () => {
    toggleTreesMarkers(map, treeLayerGroup);
  });
}

/**
 * Trees API Integration Section (end)
 * Contains: fetching data, toggling markers, creating markers
 */

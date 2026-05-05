let fountainMarkers = [];
let fountainData = [];
let fountainVisible = false;

const fetchWaterFountains = async () => {
    fountainData = [];
  try {
    const limit = 100;
    let offset = 0;

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=${limit}&offset=${offset}`,
      );
      const resultJSON = await result.json();
      console.log(resultJSON);

      for (let i = 0; i < resultJSON.results.length; i++) {
        fountainData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) break;
      offset += limit;
    }
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
    const marker = L.marker([latValue, lonValue]);
    let fountainInfo = result.name.replace(
      "Fountain location:\n",
      "Water Fountain: ",
    );
    marker.bindPopup(fountainInfo);
    fountainMarkers.push(marker);
  }
};

export const toggleFountainMarkers = () => {
  if (fountainVisible) {
    fountainMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });

    fountainVisible = false;
  } else {
    fountainMarkers.forEach((marker) => {
      marker.addTo(map);
    });
    fountainVisible = true;
  }
};

fetchWaterFountains();

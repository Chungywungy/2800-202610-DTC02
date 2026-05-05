const fetchWaterFountains = async () => {
  try {
    const result = await fetch(
      "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=100",
    );
    const resultJSON = await result.json();
    console.log(resultJSON);

    resultJSON.results.forEach((result) => {
      let lonValue = result.geo_point_2d["lon"];
      let latValue = result.geo_point_2d["lat"];
      var marker = L.marker([latValue, lonValue]).addTo(map);

      let fountainInfo = result.name.replace(
        "Fountain location:\n",
        "Water Fountain: ",
      );
      marker.bindPopup(fountainInfo).openPopup();
    });
  } catch (error) {
    console.log(error);
  }
};

fetchWaterFountains();

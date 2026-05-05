const fetchWaterFountains = async () => {
  try {
    const limit = 100;
    let offset = 0;

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=${limit}&offset=${offset}`,
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

      if (resultJSON.results.length < limit) break;
      offset += limit;
    }
  } catch (error) {
    console.log(error);
  }
};

fetchWaterFountains();

let fountainMarkers = [];
let fountainData = [];
let fountainVisible = false;

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

// const fetchWaterFountains = async () => {
//   fountainData = [];
//   try {
//     const limit = 100;
//     let offset = 0;

//     while (true) {
//       const result = await fetch(
//         `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=${limit}&offset=${offset}`,
//       );
//       const resultJSON = await result.json();
//       // console.log(resultJSON);

//       for (let i = 0; i < resultJSON.results.length; i++) {
//         fountainData.push(resultJSON.results[i]);
//       }

//       if (resultJSON.results.length < limit) break;
//       offset += limit;
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   createFountainMarkers();
// };

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

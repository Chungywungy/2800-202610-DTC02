/**
 * Temperature container component
 * Create a <temperature-container> tag to implement
 */

class TemperatureContainer extends HTMLElement {
  constructor() {
    super();
    this.createTempContainer();
    this.loadTemperature(49.28, -123.12);
  }

  createTempContainer() {
    this.innerHTML = `<div class="text-white p-2 rounded-xl z-1000 bottom-5 left-5 fixed backdrop-blur-md bg-gray-800/50 items-center flex flex-row">

    <!-- Weather icon -->
    <img id="icon" src="" alt="weather icon" class="w-15 h-15">

    <!-- Temperature -->
    <div class="flex items-start">
    <span id="temp" class="text-4xl font-light">--</span>
    <span class="text-sm ml-1 mt-1">°C</span>
    </div>
      </div>`;
  }

  //   load temperature from weather route in server.js
  async loadTemperature(lat, lon) {
    try {
      const res = await fetch(`/api?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      const temp = Math.round(data.main.temp * 10) / 10;
      const iconCode = data.weather[0].icon;

      //   OpenWeather icon url
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      this.querySelector("#temp").textContent = temp;
      this.querySelector("#icon").src = iconUrl;
    } catch (err) {
      this.querySelector("#temp").textContent = "Failed to load";
      console.error(err);
    }
  }
}

customElements.define("temperature-container", TemperatureContainer);

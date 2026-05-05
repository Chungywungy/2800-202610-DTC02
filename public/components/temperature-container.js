/**
 * Temperature container component
 * Create a <temperature-container> tag to implement
 */

class TemperatureContainer extends HTMLElement {
  constructor() {
    super();
    this.createTempContainer();
    this.loadTemperature();
  }

  createTempContainer() {
    this.innerHTML = `<div class="absolute text-white p-2 rounded-xl z-10000000 bottom-5 right-1 backdrop-blur-md bg-gray-800/50 items-center flex flex-row">
    
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
  async loadTemperature() {
    try {
      const res = await fetch("/api/weather");
      const data = await res.json();

      const temp = Math.round(data.main.temp);
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

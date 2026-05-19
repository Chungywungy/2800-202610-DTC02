class SiteHeatScore extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.initializeEvents();
  }

  render() {
    this.innerHTML = `
      <div id="heatScoreLegend" class="hidden fixed top-32 left-6 z-[3000] bg-white rounded-xl shadow-xl w-72 overflow-hidden">
        <div class="flex items-center justify-between bg-base-200 px-4 py-2">
          <h2 class="font-bold">Heat Score Legend</h2>
          <button id="minimizeLegendBtn" class="btn btn-xs btn-ghost">-</button>
        </div>

        <div id="legendContent" class="space-y-2 text-sm p-4">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" style="background-color: #97C459"></div>
            <span>Rank 1-5 : Very High Heat Score</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" style="background-color: #F5E663"></div>
            <span>Rank 6-10 : High Heat Score</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" style="background-color: #EF9F27"></div>
            <span>Rank 11-15 : Moderate Heat Score</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" style="background-color: #E24B4A"></div>
            <span>Rank 16+ : Low Heat Score</span>
          </div>
        </div>
      </div>

      <div class="drawer-side z-[4000]">
        <label for="settingsDrawer" aria-label="close sidebar" class="drawer-overlay"></label>

        <div class="menu bg-base-100 min-h-full w-96 p-6">
          <div class="p-6 max-w-md w-full bg-white rounded-xl shadow space-y-4">
            <h2 class="text-xl font-bold">Heat Score Formula</h2>
            <p class="text-center text-lg font-mono bg-base-200 rounded-lg p-2">
              Heat Score = ∑ ((count ÷ max) × weight)
            </p>

            <div id="waterFountainContainer" class="flex flex-col gap-1">
              <h1>Water Fountain</h1>
              <label class="flex w-full gap-3 items-center">
                <input
                  id="waterFountains"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="40"
                  class="range range-info range-xs w-3/4"
                  oninput="document.getElementById('waterFountainsText').value = (this.value / 100).toFixed(2)"
                />
                <input
                  type="number"
                  id="waterFountainsText"
                  min="0"
                  max="1"
                  step="0.01"
                  value="0.20"
                  class="input input-bordered w-1/4"
                  oninput="this.previousElementSibling.value = Math.round(this.value * 100)"
                />
              </label>
            </div>

            <div id="washroomsContainer" class="flex flex-col gap-1">
              <h1>Washrooms</h1>
              <label class="flex w-full gap-3 items-center">
                <input
                  id="washrooms"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="40"
                  class="range range-warning range-xs w-3/4"
                  oninput="document.getElementById('washroomsText').value = (this.value / 100).toFixed(2)"
                />
                <input
                  type="number"
                  id="washroomsText"
                  min="0"
                  max="1"
                  step="0.01"
                  value="0.20"
                  class="input input-bordered w-1/4"
                  oninput="this.previousElementSibling.value = Math.round(this.value * 100)"
                />
              </label>
            </div>

            <div id="parksContainer" class="flex flex-col gap-1">
              <h1>Parks</h1>
              <label class="flex w-full gap-3 items-center">
                <input
                  id="parks"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="40"
                  class="range range-success range-xs w-3/4"
                  oninput="document.getElementById('parksText').value = (this.value / 100).toFixed(2)"
                />
                <input
                  type="number"
                  id="parksText"
                  min="0"
                  max="1"
                  step="0.01"
                  value="0.20"
                  class="input input-bordered w-1/4"
                  oninput="this.previousElementSibling.value = Math.round(this.value * 100)"
                />
              </label>
            </div>

            <div id="communityCentresContainer" class="flex flex-col gap-1">
              <h1>Community Centres</h1>
              <label class="flex w-full gap-3 items-center">
                <input
                  id="communityCentres"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="40"
                  class="range range-secondary range-xs w-3/4"
                  oninput="document.getElementById('communityCentresText').value = (this.value / 100).toFixed(2)"
                />
                <input
                  type="number"
                  id="communityCentresText"
                  min="0"
                  max="1"
                  step="0.01"
                  value="0.20"
                  class="input input-bordered w-1/4"
                  oninput="this.previousElementSibling.value = Math.round(this.value * 100)"
                />
              </label>
            </div>

            <div id="transitContainer" class="flex flex-col gap-1">
              <h1>Transit</h1>
              <label class="flex w-full gap-3 items-center">
                <input
                  id="transit"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="40"
                  class="range range-primary range-xs w-3/4"
                  oninput="document.getElementById('transitText').value = (this.value / 100).toFixed(2)"
                />
                <input
                  type="number"
                  id="transitText"
                  min="0"
                  max="1"
                  step="0.01"
                  value="0.20"
                  class="input input-bordered w-1/4"
                  oninput="this.previousElementSibling.value = Math.round(this.value * 100)"
                />
              </label>
            </div>

            <p class="font-semibold">
              Total:
              <span id="totalWeight">100%</span>
            </p>

            <button id="saveFormulaBtn" class="btn btn-primary w-full">Save Formula</button>
            <button id="resetFormula" class="btn btn-primary w-full">Reset Formula</button>
            <p id="formulaMessage" class="text-sm"></p>
          </div>

          <div class="mt-4">
            <!-- sliders -->
          </div>
        </div>
      </div>

      <div id="scoreTutorialModal" class="hidden fixed inset-0 bg-black/50 flex items-start justify-start">
        <div class="z-[2000] flex flex-col items-start mt-24 ml-[15%]">
          <div class="flex relative pointer-events-none justify-start rounded-xl -mb-11 ml-10">
            <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="white">
              <path d="m280-400 200-201 200 201H280Z" />
            </svg>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 w-80">
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span>3/6</span>
              </div>
              <progress class="progress progress-primary w-full" value="3" max="6"></progress>
            </div>
            <h2 class="text-2xl font-bold mb-4">Heat Score</h2>
            <p>Turn on the Score layer to view neighbourhood heat vulnerability rankings.</p>
            <p class="mt-3">Use the legend to understand what each colour means.</p>
            <div class="flex gap-3 mt-6">
              <button id="closeScoreBtn" class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button id="nextBtnScore" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div id="settingsTutorialModal" class="hidden fixed inset-0 bg-black/50 flex items-start justify-end">
        <div class="z-[2000] flex flex-col items-end mt-10 mr-3">
          <div class="flex relative pointer-events-none justify-end rounded-xl -mb-12 -mr-7">
            <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="white">
              <path d="m280-400 200-201 200 201H280Z" />
            </svg>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 w-80">
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span>5/6</span>
              </div>
              <progress class="progress progress-primary w-full" value="5" max="6"></progress>
            </div>
            <h2 class="text-2xl font-bold mb-4">Heat Score Options</h2>
            <p>Logged-in users can open the Heat Score drawer from the profile menu.</p>
            <p class="mt-3">Use the sliders to customize how each resource affects the score.</p>
            <div class="flex gap-3 mt-6">
              <button id="closeSettingsBtn" class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button id="nextBtnSettings" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Next</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initializeEvents() {
    const scoreBtn = document.getElementById("scoreBtn");
    const heatScoreLegend = this.querySelector("#heatScoreLegend");
    const minimizeLegendBtn = this.querySelector("#minimizeLegendBtn");
    const legendContent = this.querySelector("#legendContent");

    if (scoreBtn && heatScoreLegend && minimizeLegendBtn) {
      scoreBtn.addEventListener("click", () => {
        heatScoreLegend.classList.toggle("hidden");
      });

      minimizeLegendBtn.addEventListener("click", () => {
        legendContent.classList.toggle("hidden");

        minimizeLegendBtn.textContent = legendContent.classList.contains("hidden") ? "+" : "-";
      });
    }

    const nextBtnWeather = document.getElementById("nextBtnWeather");
    if (nextBtnWeather) {
      nextBtnWeather.addEventListener("click", () => {
        const scoreTutorial = this.querySelector("#scoreTutorialModal");

        document.getElementById("weatherModal")?.classList.add("hidden");
        scoreTutorial?.classList.remove("hidden");
      });
    }

    const nextBtnScore = this.querySelector("#nextBtnScore");
    if (nextBtnScore) {
      nextBtnScore.addEventListener("click", () => {
        const scoreTutorial = this.querySelector("#scoreTutorialModal");
        const profileTutorial = document.getElementById("profileTutorialModal");

        scoreTutorial?.classList.add("hidden");
        profileTutorial?.classList.remove("hidden");
      });
    }

    const nextBtnProfile = document.getElementById("nextBtnProfile");
    if (nextBtnProfile) {
      nextBtnProfile.addEventListener("click", () => {
        const settingsTutorial = this.querySelector("#settingsTutorialModal");

        document.getElementById("profileTutorialModal")?.classList.add("hidden");
        settingsTutorial?.classList.remove("hidden");
      });
    }

    const nextBtnSettings = this.querySelector("#nextBtnSettings");
    if (nextBtnSettings) {
      nextBtnSettings.addEventListener("click", () => {
        const settingsTutorial = this.querySelector("#settingsTutorialModal");
        const reportTutorial = document.getElementById("reportTutorialModal");

        settingsTutorial?.classList.add("hidden");
        reportTutorial?.classList.remove("hidden");
      });
    }
  }
}

customElements.define("site-heat-score", SiteHeatScore);

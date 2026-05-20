/**
 * Navbar Component
 * Create a <site-navbar> tag to implement
 */

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.createNavbar();
  }

  createNavbar() {
    this.innerHTML = `
      <div class="drawer">
        <input id="settingsDrawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">

          <nav id="navContainer" class="z-2000 absolute flex flex-col w-full">
<!-- COOLSCORE LEGEND MODAL -->
<div
  id="heatScoreLegend"
class="hidden fixed top-32 left-6 z-[3000] bg-white rounded-xl shadow-xl w-72 overflow-hidden">
  <div class="flex items-center justify-between bg-base-200 px-4 py-2">
    <h2 class="font-bold">Cool Score Legend</h2>

    <button
      id="minimizeLegendBtn"
      class="btn btn-xs btn-ghost"
    >
      -
    </button>
  </div>

  <div id="legendContent" class="space-y-2 text-sm p-4">
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 rounded" style="background-color: #97C459"></div>
      <span>Rank 1-5 : Very High Cool Score</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-5 h-5 rounded" style="background-color: #F5E663"></div>
      <span>Rank 6-10 : High Cool Score</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-5 h-5 rounded" style="background-color: #EF9F27"></div>
      <span>Rank 11-15 : Moderate Cool Score</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-5 h-5 rounded" style="background-color: #E24B4A"></div>
      <span>Rank 16+ : Low Cool Score</span>
    </div>
  </div>
</div>
<!-- HEATSCORE LEGEND MODAL END -->

            <section id="navbarContainer">
              <div class="navbar bg-base-100 shadow-sm">
                <div class="flex-1">
                  <!-- PROJECT TITLE -->
                  <a class="btn btn-ghost text-xl">
                    <!-- PROJECT LOGO -->
                    <span class="material-symbols-outlined"> beach_access </span> find
                    your cool</a
                  >
                </div>
                <div class="flex gap-2 shrink-0">
                  <!-- HELP / TUTORIAL -->
      
                  <button class="btn btn-warning mx-2" id="helpBtn">
                    Help
                  </button>
                  <!-- AVATAR DROPDOWN -->
                  <div class="dropdown dropdown-end z-100000">
                    <div
                      tabindex="0"
                      role="button"
                      class="btn btn-ghost btn-circle avatar"
                    >
                      <div class="w-10 rounded-full">
                        <!-- IMAGES -->
                        <img
                          alt="Tailwind CSS Navbar component"
                          src="https://preview.redd.it/serious-cat-meme-unedited-version-from-2003-found-by-v0-90prc33ob1ze1.jpeg?width=2560&format=pjpg&auto=webp&s=69718ad34727ec7c70e26b28fedf38886cee7b3e"
                        />
                      </div>
                    </div>

                    <ul
                      tabindex="0"
                      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shrink-0 shadow"
                    >
          <li><button id="profileBtn" class="hidden" onclick="profileModal.showModal()">Profile</button></li>
                      <li id="settingsBtn" class="hidden">
                        <label for="settingsDrawer"> Cool Score </label>
                      </li>
                      <li><button id="logInBtn">Login</button></li>
                      <li><button id="logOutBtn" class="hidden">Logout</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- FILTERS -->
            <section id="filterBarContainer" class="flex backdrop-blur-xs shadow-lg">
              <!-- SCROLLABLE TOGGLE FILTER MARKERS -->
              <ul
                id="filterContainer"
                class="flex flex-1 justify-start mx-5 my-2 gap-5 lg:justify-center overflow-x-auto overflow-y-hidden"
                style="-ms-overflow-style: none; scrollbar-width: none"
              >
                <!-- NEIGHBORHOOD/SCORE  -->
                <button class="btn" id="scoreBtn">
                  Score
                  <span class="material-symbols-outlined"> location_city </span>
                </button>
                <!-- TREES -->
                <button class="btn" id="treesBtn">
                  Trees
                  <span class="material-symbols-outlined"> park </span>
                </button>
                <!-- PARKS -->
                <button class="btn" id="parksBtn">
                  Parks
                  <span class="material-symbols-outlined"> playground </span>
                </button>
                <!-- COMMUNITY CENTRES -->
                <button class="btn" id="communityCentresBtn">
                  Community Centres
                  <span class="material-symbols-outlined"> family_group </span>
                </button>
                <!-- WASHROOMS -->
                <button class="btn" id="publicWashroomsBtn">
                  Washrooms
                  <span class="material-symbols-outlined"> wc </span>
                </button>
                <!-- TRANSIT -->
                <button class="btn" id="transitBtn">
                  Transit
                  <span class="material-symbols-outlined"> bus_map_pin </span>
                </button>
                <!-- WATER -->
                <button class="btn" id="fountainsBtn">
                  Water
                  <span class="material-symbols-outlined"> water_drops </span>
                </button>
                <!-- FORMS -->
                <button class="btn" id="formReports">
                  Reports
                  <span class="material-symbols-outlined"> flag </span>
                </button>
                      <!-- AI SUMMARY -->
        <button class="btn hidden" id="summaryBtn">
          AI Summary
          <span class="material-symbols-outlined"> smart_toy </span>
        </button>
                
              </ul>
            </section>

            <!-- Filter Help Modal -->

            <div
              id="filterModal"
              class="hidden fixed inset-0 flex justify-center bg-black/50"
            >
              <div
                class=" z-[2000] flex flex-col items-center mt-[140px] md:mt-18"
              >
                <div class="flex relative pointer-events-none justify-center rounded-xl -mb-11">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="100px"
                    viewBox="0 -960 960 960"
                    width="100px"
                    fill="white"
                  >
                    <path d="m280-400 200-201 200 201H280Z" />
                  </svg>
                </div>

                <div class="bg-white rounded-xl p-4">

                <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>1/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="1"
    max="6"
  ></progress>
</div>
                  <h2 class="text-2xl font-bold mb-4">How to Use the App</h2>
                  <p>
                    You can select a filter to render the locations on the map. <br />
                    Toggle a filter on or off to render the information.
                  </p>

                  <div class="mt-6 flex items-center gap-2">
                    <input type="checkbox" id="rememberMe" checked />
                    <label for="rememberMe">Enable first time user help</label>
                  </div>



<div class="flex gap-3 mt-6">
  <button
    id="closeHelpBtn"
    class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
  >
    Close
  </button>

  <button
    id="nextBtnFilter"
    class="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    Next
  </button>
</div>

                </div>
              </div>
            </div>

            <!-- Weather Help Modal -->
<div
  id="weatherModal"
  class="hidden fixed inset-0 bg-black/50 items-end justify-start flex"
>
  <div class="z-[2000] flex flex-col mb-20 ml-5">
    <div class="bg-white rounded-lg shadow-lg p-6">
     <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>2/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="2"
    max="6"
  ></progress>
</div>
      <h2 class="text-2xl font-bold mb-4">
        Temperature
      </h2>

      <p>
        See the current temperature for your location.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          id="closeWeatherBtn"
          class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

        <button
          id="nextBtnWeather"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

    <div class="flex relative pointer-events-none justify-start rounded-xl -mt-11">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100px"
        viewBox="0 -960 960 960"
        width="100px"
        fill="white"
      >
        <path d="M480-360 280-559h400L480-360Z" />
      </svg>
    </div>
  </div>
</div>
<!-- Score Help Modal -->
<div
  id="scoreTutorialModal"
  class="hidden fixed inset-0 bg-black/50 flex items-start justify-start"
>
  <div class="z-[2000] flex flex-col items-start mt-24 ml-[15%]">

    <div class="flex relative pointer-events-none justify-start rounded-xl -mb-11 ml-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100px"
        viewBox="0 -960 960 960"
        width="100px"
        fill="white"
      >
        <path d="m280-400 200-201 200 201H280Z" />
      </svg>
    </div>

    <!-- CARD -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
     <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>3/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="3"
    max="6"
  ></progress>
</div>
      <h2 class="text-2xl font-bold mb-4">Cool Score</h2>

      <p>
        Turn on the Score layer to view neighbourhood heat vulnerability rankings.
      </p>

      <p class="mt-3">
        Use the legend to understand what each colour means.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          id="closeScoreBtn"
          class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

        <button
          id="nextBtnScore"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</div>

<!-- Profile Help Modal -->
<div
  id="profileTutorialModal"
  class="hidden fixed inset-0 bg-black/50 flex items-start justify-end"
>
  <div class="z-[2000] flex flex-col items-end mt-10 mr-3">

    <div class="flex relative pointer-events-none justify-end rounded-xl -mb-12 -mr-7">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100px"
        viewBox="0 -960 960 960"
        width="100px"
        fill="white"
      >
        <path d="m280-400 200-201 200 201H280Z" />
      </svg>
    </div>

    <!-- CARD -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
     <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>4/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="4"
    max="6"
  ></progress>
</div>
      <h2 class="text-2xl font-bold mb-4">Profile and Login</h2>

      <p>
        Click the profile icon in the top-right corner to log in or view your
        profile.
      </p>

      <p class="mt-3">
        Once logged in, you can access profile and Cool Score options.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          id="closeProfileBtn"
          class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

        <button
          id="nextBtnProfile"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</div>
<!-- Cool Score Settings Help Modal -->
<div
  id="settingsTutorialModal"
  class="hidden fixed inset-0 bg-black/50 flex items-start justify-end"
>
  <div class="z-[2000] flex flex-col items-end mt-10 mr-3">

    <div class="flex relative pointer-events-none justify-end rounded-xl -mb-12 -mr-7">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100px"
        viewBox="0 -960 960 960"
        width="100px"
        fill="white"
      >
        <path d="m280-400 200-201 200 201H280Z" />
      </svg>
    </div>

    <!-- CARD -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
     <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>5/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="5"
    max="6"
  ></progress>
</div>
      <h2 class="text-2xl font-bold mb-4">Cool Score Options</h2>

      <p>
        Logged-in users can open the Cool Score drawer from the profile menu.
      </p>

      <p class="mt-3">
        Use the sliders to customize how each resource affects the score.
      </p>

      <div class="flex gap-3 mt-6">
        <button
          id="closeSettingsBtn"
          class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

        <button
          id="nextBtnSettings"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</div>

<!-- Report Help Modal -->
<div
  id="reportTutorialModal"
  class="hidden fixed inset-0 bg-black/50 flex items-center justify-center"
>
  <div class="z-[2000] flex flex-col items-center">

    <!-- CARD -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
     <!-- PROGRESS BAR -->
<div class="mt-4">
  <div class="flex justify-between text-sm mb-1">
    <span>6/6</span>
  </div>

  <progress
    class="progress progress-primary w-full"
    value="6"
    max="6"
  ></progress>
</div>
      <h2 class="text-2xl font-bold mb-4">Submit Reports</h2>

      <p>
        You can submit community reports directly on the map.
      </p>

      <p class="mt-3">
        <strong>Desktop:</strong> right-click on the map
      </p>

      <p class="mt-3">
        <strong>Mobile:</strong> press and hold on the map
      </p>

      <div class="flex gap-3 mt-6">
        <button
          id="closeReportBtn"
          class="tutorialCloseBtn bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>


      </div>
    </div>

    <div class="flex relative pointer-events-none justify-center rounded-xl -mt-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100px"
        viewBox="0 -960 960 960"
        width="100px"
        fill="white"
      >
        <path d="M480-360 280-559h400L480-360Z" />
      </svg>
    </div>

  </div>
</div>
            </nav>
          </div>

     <div class="drawer-side z-[4000]">
  <label
    for="settingsDrawer"
    aria-label="close sidebar"
    class="drawer-overlay"
  ></label>

  <div class="menu bg-base-100 min-h-full w-96 p-6">

 <div class="p-6 max-w-md w-full bg-white rounded-xl shadow space-y-4">
      <h2 class="text-xl font-bold">Cool Score Formula</h2>
<p class="text-center text-lg font-mono bg-base-200 rounded-lg p-2">
  Cool Score = ∑ ((count ÷ max) × weight)
</p>
      <!-- WATER FOUNTAIN SETTINGS CONTAINER -->
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
            oninput="
              document.getElementById('waterFountainsText').value = (
                this.value / 100
              ).toFixed(2)
            "
          />
          <input
            type="number"
            id="waterFountainsText"
            min="0"
            max="1"
            step="0.01"
            value="0.20"
            class="input input-bordered w-1/4"
            oninput="
              this.previousElementSibling.value = Math.round(this.value * 100)
            "
          />
        </label>
      </div>

      <!-- WASHROOM SETTINGS CONTAINER -->
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
            oninput="
              document.getElementById('washroomsText').value = (
                this.value / 100
              ).toFixed(2)
            "
          />
          <input
            type="number"
            id="washroomsText"
            min="0"
            max="1"
            step="0.01"
            value="0.20"
            class="input input-bordered w-1/4"
            oninput="
              this.previousElementSibling.value = Math.round(this.value * 100)
            "
          />
        </label>
      </div>

      <!-- PARKS SETTINGS CONTAINER -->
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
            oninput="
              document.getElementById('parksText').value = (
                this.value / 100
              ).toFixed(2)
            "
          />
          <input
            type="number"
            id="parksText"
            min="0"
            max="1"
            step="0.01"
            value="0.20"
            class="input input-bordered w-1/4"
            oninput="
              this.previousElementSibling.value = Math.round(this.value * 100)
            "
          />
        </label>
      </div>

      <!-- COMMUNITY CENTRES SETTINGS CONTAINER -->
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
            oninput="
              document.getElementById('communityCentresText').value = (
                this.value / 100
              ).toFixed(2)
            "
          />
          <input
            type="number"
            id="communityCentresText"
            min="0"
            max="1"
            step="0.01"
            value="0.20"
            class="input input-bordered w-1/4"
            oninput="
              this.previousElementSibling.value = Math.round(this.value * 100)
            "
          />
        </label>
      </div>

      <!-- TRANSIT SETTINGS CONTAINER -->
      <div id="communityCentresContainer" class="flex flex-col gap-1">
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
            oninput="
              document.getElementById('transitText').value = (
                this.value / 100
              ).toFixed(2)
            "
          />
          <input
            type="number"
            id="transitText"
            min="0"
            max="1"
            step="0.01"
            value="0.20"
            class="input input-bordered w-1/4"
            oninput="
              this.previousElementSibling.value = Math.round(this.value * 100)
            "
          />
        </label>
      </div>

      <p class="font-semibold">
        Total:
        <span id="totalWeight">100%</span>
      </p>

      <button id="saveFormulaBtn" class="btn btn-primary w-full">
        Save Formula
      </button>

      <button id="resetFormula" class="btn btn-primary w-full">
        Reset Formula
      </button>

      <p id="formulaMessage" class="text-sm"></p>
    </div>

    <div class="mt-4">
      <!-- sliders -->
    </div>
  </div>
</div>

          
      <!-- AI Summary Modal -->
      <div
        id="summaryModal"
class="hidden fixed inset-0 z-[9999] bg-black/50 items-center justify-center"      >
        <div class="z-1000000000 w-11/12 max-w-4xl rounded-2xl bg-base-100 p-6 shadow-2xl">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-2xl font-bold">AI report overview</h2>
              <p class="text-sm opacity-70">
                Summaries only heat, cooling, and infrastructure-related reports.
              </p>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select id="summaryScope" class="select select-bordered select-sm w-full sm:w-48">
                <option value="all">Citywide</option>
                <option value="neighborhood">By neighbourhood</option>
              </select>

              <select
                id="summaryNeighborhood"
                class="select select-bordered select-sm w-full sm:w-56 hidden"
              ></select>

              <button id="generateSummaryBtn" class="btn btn-primary btn-sm">
                Generate summary
              </button>
            </div>
          </div>

          <div id="summaryStatus" class="mt-4 text-sm opacity-75"></div>
          <div id="summaryOutput" class="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1"></div>

          <div class="modal-action">
            <button id="closeSummaryBtn" class="btn">Close</button>
          </div>
        </div>
      </div>
    </nav>
    `;
  }
}

customElements.define("site-navbar", SiteNavbar);

function showToast(message, type = "success") {
  let toastContainer = document.getElementById("achievement-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "achievement-toast-container";
    toastContainer.className =
      "fixed top-4 right-4 z-[10000000001] flex flex-col items-end gap-3 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  const typeClass =
    type === "error"
      ? "alert-error"
      : type === "warning"
        ? "alert-warning"
        : type === "info"
          ? "alert-info"
          : "alert-success";

  toast.innerHTML = `
    <div class="alert ${typeClass} shadow-lg">
      <div>
        <span>${message}</span>
      </div>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

window.showToast = showToast;
window.showAchievementToast = showToast;

const FILTER_BUTTON_IDS = [
  "scoreBtn",
  "treesBtn",
  "parksBtn",
  "communityCentresBtn",
  "publicWashroomsBtn",
  "transitBtn",
  "fountainsBtn",
  "formReports",
];
const FILTER_ACHIEVEMENT_NAME = "all-filters";

function getFilterClickHistory() {
  try {
    const values = JSON.parse(localStorage.getItem("clickedFilters") || "[]");
    return new Set(
      (Array.isArray(values) ? values : []).filter((id) =>
        FILTER_BUTTON_IDS.includes(id),
      ),
    );
  } catch (error) {
    return new Set();
  }
}

function saveFilterClickHistory(clickedFilters) {
  const validIds = Array.from(clickedFilters).filter((id) =>
    FILTER_BUTTON_IDS.includes(id),
  );
  localStorage.setItem("clickedFilters", JSON.stringify(validIds));
}

async function awardFilterAchievement() {
  try {
    const userResponse = await fetch("/api/user");
    const userData = await userResponse.json();
    const username = userData?.user?.username;

    if (!username) {
      return;
    }

    const response = await fetch("/achievement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        achievementName: FILTER_ACHIEVEMENT_NAME,
        username,
      }),
    });
    const result = await response.json();
    if (response.ok && (result.upsertedCount === 1 || result.upsertedId)) {
      window.showToast("Achievement unlocked: Filter Master", "success");
    }

    if (window.updateUserBadges) {
      window.updateUserBadges();
    }
  } catch (error) {
    console.error("Failed to award filter achievement", error);
  }
}

function recordFilterClick(buttonId) {
  const clickedFilters = getFilterClickHistory();
  const beforeCount = clickedFilters.size;
  clickedFilters.add(buttonId);
  saveFilterClickHistory(clickedFilters);

  const afterCount = clickedFilters.size;
  if (
    afterCount === FILTER_BUTTON_IDS.length &&
    beforeCount < FILTER_BUTTON_IDS.length
  ) {
    awardFilterAchievement();
  }
}

document.querySelectorAll("#filterContainer button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (
      btn.id === "helpBtn" ||
      btn.id === "logInBtn" ||
      btn.id === "logOutBtn" ||
      btn.id === "profileBtn" ||
      btn.id === "summaryBtn" ||
      btn.id === "generateSummaryBtn" ||
      btn.id === "closeSummaryBtn"
    )
      return;
    btn.classList.toggle("bg-secondary");
    btn.classList.toggle("text-secondary-content");
    btn.classList.toggle("active");

    if (!btn.id) {
      return;
    }

    if (FILTER_BUTTON_IDS.includes(btn.id)) {
      recordFilterClick(btn.id);
    }
  });
});

/**
 * Open help modal
 */
document.getElementById("helpBtn").addEventListener("click", () => {
  document.getElementById("filterModal").classList.remove("hidden");
});

/**
 * Tutorial logic / flow between modals
 */

// UNIVERSAL CLOSE BUTTON
document.querySelectorAll(".tutorialCloseBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".fixed").classList.add("hidden");
  });
});

// FILTER -> WEATHER
document.getElementById("nextBtnFilter").addEventListener("click", () => {
  document.getElementById("filterModal").classList.add("hidden");
  document.getElementById("weatherModal").classList.remove("hidden");
});

// WEATHER -> SCORE
document.getElementById("nextBtnWeather").addEventListener("click", () => {
  document.getElementById("weatherModal").classList.add("hidden");
  document.getElementById("scoreTutorialModal").classList.remove("hidden");
});

// SCORE -> PROFILE
document.getElementById("nextBtnScore").addEventListener("click", () => {
  document.getElementById("scoreTutorialModal").classList.add("hidden");
  document.getElementById("profileTutorialModal").classList.remove("hidden");
});

// PROFILE -> SETTINGS
document.getElementById("nextBtnProfile").addEventListener("click", () => {
  document.getElementById("profileTutorialModal").classList.add("hidden");
  document.getElementById("settingsTutorialModal").classList.remove("hidden");
});

// SETTINGS -> REPORT
document.getElementById("nextBtnSettings").addEventListener("click", () => {
  document.getElementById("settingsTutorialModal").classList.add("hidden");
  document.getElementById("reportTutorialModal").classList.remove("hidden");
});

/**
 * Local storage of first time mode
 */
let firstTimeHelpEnabled = true;
let savedValue = localStorage.getItem("firstTimeHelpEnabled");
if (savedValue !== null) {
  firstTimeHelpEnabled = savedValue === "true";
}

rememberMe.checked = firstTimeHelpEnabled;

rememberMe.addEventListener("change", () => {
  localStorage.setItem("firstTimeHelpEnabled", rememberMe.checked);
});

function loadTutorial() {
  if (rememberMe.checked) {
    document.getElementById("filterModal").classList.remove("hidden");
  } else {
    document
      .getElementById("helpBtn")
      .parentElement.classList.remove("animate-pulse");
  }
}

// Fetch user data (check if user is logged in via express session)
async function checkUserAuth() {
  const response = await fetch("/api/user");
  const data = await response.json();

  if (data.loggedIn) {
    document.getElementById("logInBtn").classList.toggle("hidden");
    document.getElementById("logOutBtn").classList.toggle("hidden");
    document.getElementById("settingsBtn").classList.toggle("hidden");
    document.getElementById("profileBtn").classList.toggle("hidden");

    const summaryButton = document.getElementById("summaryBtn");
    if (data.user?.role === "planner") {
      summaryButton.classList.remove("hidden");
    } else {
      summaryButton.classList.add("hidden");
    }
  }
}
document.getElementById("logInBtn").addEventListener("click", () => {
  window.location.href = "/login";
});

document.getElementById("logOutBtn").addEventListener("click", () => {
  window.location.href = "/auth/logout";
});

document.getElementById("summaryBtn").addEventListener("click", () => {
  document.getElementById("summaryModal").classList.remove("hidden");
  document.getElementById("summaryModal").classList.add("flex");
});

document.getElementById("closeSummaryBtn").addEventListener("click", () => {
  document.getElementById("summaryModal").classList.add("hidden");
  document.getElementById("summaryModal").classList.remove("flex");
});

document.getElementById("summaryModal").addEventListener("click", (event) => {
  if (event.target === document.getElementById("summaryModal")) {
    document.getElementById("summaryModal").classList.add("hidden");
    document.getElementById("summaryModal").classList.remove("flex");
  }
});

// HEATSCORE LEGEND POPUP MODAL
const scoreBtn = document.getElementById("scoreBtn");
const heatScoreLegend = document.getElementById("heatScoreLegend");
const minimizeLegendBtn = document.getElementById("minimizeLegendBtn");
const legendContent = document.getElementById("legendContent");

scoreBtn.addEventListener("click", () => {
  heatScoreLegend.classList.toggle("hidden");
});

minimizeLegendBtn.addEventListener("click", () => {
  legendContent.classList.toggle("hidden");

  if (legendContent.classList.contains("hidden")) {
    minimizeLegendBtn.textContent = "+";
  } else {
    minimizeLegendBtn.textContent = "-";
  }
});
// HEATSCORE POPUP MODAL END

checkUserAuth();

document.addEventListener("DOMContentLoaded", loadTutorial);

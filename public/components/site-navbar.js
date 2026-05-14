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
                  <!-- SEARCH BAR -->
                  <input
                    type="text"
                    placeholder="Search"
                    class="input input-bordered w-24 md:w-auto"
                  />
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
                        <label for="settingsDrawer"> Heat Score </label>
                      </li>
                      <li><button id="logInBtn">Login</button></li>
                      <li><button id="logOutBtn" class="hidden">Logout</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- FILTERS -->
            <section id="filterBarContainer" class="flex bg-white">
              <!-- SCROLLABLE TOGGLE FILTER MARKERS -->
              <ul
                id="filterContainer"
                class="flex flex-1 justify-start mx-5 my-2 gap-5 lg:justify-center overflow-x-auto overflow-y-hidden"
                style="-ms-overflow-style: none; scrollbar-width: none"
              >
                <!-- CONTROL CONTAINER -->
                <div class="sticky left-0 flex gap-5 w-fit bg-white">
                  <!-- HELP / TUTORIAL -->
                  <button class="btn btn-warning" id="helpBtn">
                    <span class="material-symbols-outlined"> help </span>
                  </button>
                  <!-- NEIGHBORHOOD -->
                  <button class="btn" id="scoreBtn">
                    Score
                    <span class="material-symbols-outlined"> location_city </span>
                  </button>
                </div>
                <!-- DIVIDER -->
                <div class="shrink-0 border-l border-slate-400"></div>
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
                class="fixed z-[2000] flex flex-col items-center mt-[140px] md:mt-18"
              >
                <div class="flex relative justify-center rounded-xl -mb-11">
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
                  <h2 class="text-2xl font-bold mb-4">How to Use the App</h2>
                  <p>
                    You can select a filter to render the locations on the map. <br />
                    Toggle a filter on or off to render the information.
                  </p>

                  <div class="mt-6 flex items-center gap-2">
                    <input type="checkbox" id="rememberMe" checked />
                    <label for="rememberMe">Enable first time user help</label>
                  </div>

                  <button
                    id="closeHelpBtn"
                    class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>

                  <button
                    id="nextBtnFilter"
                    class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <!-- Weather Help Modal -->
            <div
              id="weatherModal"
              class="hidden fixed inset-0 bg-black/50 items-end justify-end flex">
              
              <div class="z-[2000] flex flex-col mb-30 mr-30">
                <div class="bg-white rounded-lg shadow-lg p-6 -top-48">
                  <h2 class="text-2xl font-bold mb-4">Temperature and Heat Score</h2>

                  <p>See the current temperature and heat score for your location.</p>

                  <button
                    id="nextBtnWeather"
                    class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                </div>

                <div class="flex relative justify-end rounded-xl -mt-11">
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
      <h2 class="text-xl font-bold">Heat Score Formula</h2>

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
            oninput=
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
    btn.classList.toggle("bg-success");
    btn.classList.toggle("active");
  });
});

/**
 * Open help modal
 */
document.getElementById("helpBtn").addEventListener("click", () => {
  document.getElementById("filterModal").classList.remove("hidden");
  document.getElementById("filterModal").classList.add("flex");
});

/**
 * Close help modal
 */
document.getElementById("closeHelpBtn").addEventListener("click", () => {
  document.getElementById("filterModal").classList.add("hidden");
  document.getElementById("filterModal").classList.remove("flex");
});

/**
 * First next button from filter modal -> weather modal
 */
document.getElementById("nextBtnFilter").addEventListener("click", () => {
  document.getElementById("filterModal").classList.add("hidden");
  document.getElementById("filterModal").classList.remove("flex");
  document.getElementById("weatherModal").classList.remove("hidden");
  document.getElementById("weatherModal").classList.add("flex");
});

document.getElementById("weatherModal").addEventListener("click", () => {
  document.getElementById("weatherModal").classList.add("hidden");
  document.getElementById("weatherModal").classList.remove("flex");
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

checkUserAuth();

document.addEventListener("DOMContentLoaded", loadTutorial);

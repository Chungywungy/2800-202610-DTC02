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
  <nav id="navContainer" class="absolute z-2000 flex flex-col w-full">
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
          <div class="dropdown dropdown-end">
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
              tabindex="-1"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shrink-0 shadow"
            >
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
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
        class="hidden fixed inset-0 bg-black/50 items-end justify-end flex"
      >
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
    `;
  }
}

customElements.define("site-navbar", SiteNavbar);

document.querySelectorAll("#navContainer button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "helpBtn" || btn.id === "logInBtn" || btn.id === "logOutBtn")
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
});

/**
 * Close help modal
 */
document.getElementById("closeHelpBtn").addEventListener("click", () => {
  document.getElementById("filterModal").classList.add("hidden");
});

/**
 * First next button from filter modal -> weather modal
 */
document.getElementById("nextBtnFilter").addEventListener("click", () => {
  document.getElementById("filterModal").classList.add("hidden");
  document.getElementById("weatherModal").classList.remove("hidden");
});

document.getElementById("weatherModal").addEventListener("click", () => {
  document.getElementById("weatherModal").classList.add("hidden");
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
  }
}
document.getElementById("logInBtn").addEventListener("click", () => {
  window.location.href = "/login";
});

document.getElementById("logOutBtn").addEventListener("click", () => {
  window.location.href = "/auth/logout";
});

checkUserAuth();

document.addEventListener("DOMContentLoaded", loadTutorial());

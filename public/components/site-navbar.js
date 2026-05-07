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
      <nav id="navContainers" class="absolute z-1000 flex w-full justify-center bg-slate-500 overflow-x-scroll">
      
      <div id="navContainer">
      <ul class="flex p-2 py-5 gap-3">
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="treesBtn">Trees</button>
        </li>
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="parksBtn">Parks</button>
        </li>
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="communityCentresBtn">Community Centres</button>
        </li>
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="publicWashroomsBtn">Public Washrooms</button>
        </li>
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="transitBtn">Transit</button>
        </li>
        <li class="bg-white p-2 rounded-lg duration-50">
          <button id="fountainsBtn">Water Fountains</button>
        </li>
        <li class="bg-blue-600 text-white p-2 rounded-lg duration-50">
          <button id="helpBtn" data-modal-target="filterModal" data-modal-toggle="default-modal">? Help</button>
        </li>
      </ul>
      
      </div> 
      <!-- Filter Help Modal -->

      <div
        id="filterModal"
        class="hidden fixed bg-black/50 z-[2000] flex items-center justify-center"
      >
      <div class="">

      <div class="bg-white">

      <svg class="top-0 w-15 h-15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 5.94363L4.76627 18H19.2339L12.0001 5.94363ZM10.7138 4.20006C11.2964 3.22905 12.7037 3.22905 13.2863 4.20006L21.4032 17.7282C22.0031 18.728 21.2829 20 20.117 20H3.88318C2.71724 20 1.99706 18.728 2.59694 17.7282L10.7138 4.20006Z" fill="#000000"/>
</svg>
 </div>
 
        <div class="bg-white rounded-xl shadow-lg
        <h2 class="text-2xl font-bold mb-4">How to Use the App</h2>

          <p>
            You can select a filter to render the locations on the map. </br>
            Toggle a filter on or off to render the information.
          </p>

          <div class="mt-6 flex items-center gap-2">
            <input type="checkbox" id="rememberMe" checked>
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
        class="hidden fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center"
      >
        <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
          <h2 class="text-2xl font-bold mb-4">Filter Toggles</h2>

                    <p>
          <p>
            Here's Luka with the weather.
          </p>

          <button
            id="nextBtnWeather"
            class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      
      
      </div> 

    </nav>
`;
  }
}

customElements.define("site-navbar", SiteNavbar);

document.querySelectorAll("#navContainer button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "helpBtn") return;
    btn.parentElement.classList.toggle("bg-red-800");
    btn.parentElement.classList.toggle("bg-white");
    btn.parentElement.classList.toggle("text-white");
    btn.parentElement.classList.toggle("active");
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
  }
}

document.addEventListener("DOMContentLoaded", loadTutorial());

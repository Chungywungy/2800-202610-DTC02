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
        <li class="animate-pulse bg-blue-600 text-white p-2 rounded-lg duration-50">
          <button id="helpBtn" data-modal-target="filterModal" data-modal-toggle="default-modal" class="px-4 font-bold">?</button>
        </li>
      </ul>
      
      </div> 

      <!-- Filter Help Modal -->

      <div id="filterModal" class="hidden fixed inset-0 flex justify-center bg-black/50">

      <div class="fixed z-[2000] flex flex-col items-center mt-[140px] md:mt-18">
    
        <div class="flex relative justify-center rounded-xl -mb-11">
          <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="white"><path d="m280-400 200-201 200 201H280Z"/></svg>
        </div>
 
        <div class="bg-white rounded-xl p-4">
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
      <div id="weatherModal" class="hidden fixed inset-0 bg-black/50 items-end justify-end flex">
        <div class="z-[2000] flex flex-col mb-30 mr-30">
     
          <div class="bg-white rounded-lg shadow-lg p-6 -top-48">
            <h2 class="text-2xl font-bold mb-4">Temperature and Heat Score</h2>
            
            <p>
              See the current temperature and heat score for your location.
            </p>

            <button
              id="nextBtnWeather"
              class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        
           <div class="flex relative justify-end rounded-xl -mt-11">
          <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="white"><path d="M480-360 280-559h400L480-360Z"/></svg>
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
  } else {
    document
      .getElementById("helpBtn")
      .parentElement.classList.remove("animate-pulse");
  }
}

document.addEventListener("DOMContentLoaded", loadTutorial());

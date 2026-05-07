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
      <nav id="navContainer" class="absolute z-1000 flex w-full justify-center bg-slate-500 overflow-x-scroll">
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
            <button id="helpBtn">? Help</button>
          </li>
      </ul>
      <!-- Help Modal -->

            <div
        id="helpModal"
        class="hidden fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center"
      >
        <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
          <h2 class="text-2xl font-bold mb-4">How to Use the App</h2>

          <ul class="list-disc pl-5 space-y-2">
            <li>Use the navbar buttons to toggle map layers on and off.</li>
            <li>Click the icons on the map for more information.</li>
            <li>Drag the map to explore different areas of Vancouver.</li>
            <li>Zoom in and out to view nearby cooling-related amenities.</li>
          </ul>

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
        </div>
      </div>

      <!-- Fountains Popup -->
      <div
        id="fountainsPopup"
        class="hidden fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center"
      >
        <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
          <h2 class="text-2xl font-bold mb-4">Water Fountains</h2>

          <p>
            This layer shows public drinking fountains around Vancouver.
            These can help people find water access during hot weather.
          </p>

          <button
            id="closeFountainsPopupBtn"
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
  document.getElementById("helpModal").classList.remove("hidden");
});

/**
 * Close help modal
 */
document.getElementById("closeHelpBtn").addEventListener("click", () => {
  document.getElementById("helpModal").classList.add("hidden");
});

/**
 * Close fountains popup
 */
document
  .getElementById("closeFountainsPopupBtn")
  .addEventListener("click", () => {
    document.getElementById("fountainsPopup").classList.add("hidden");
  });

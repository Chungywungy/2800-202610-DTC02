import { toggleFountainMarkers, toggleParkGeom } from "../js/map.js";
import { toggleWashroomMarkers } from "../js/publicWashroomsApi.js";

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
      </ul>
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

document
  .getElementById("fountainsBtn")
  .addEventListener("click", toggleFountainMarkers);
document
  .getElementById("publicWashroomsBtn")
  .addEventListener("click", toggleWashroomMarkers);
document.getElementById("parksBtn").addEventListener("click", toggleParkGeom);

import { map, toggleReportMarkers } from "../js/map.js";

/**
 * Profile modal component
 * Create a <site-profile> tag to implement
 */

class SiteProfile extends HTMLElement {
  constructor() {
    super();
    this.createProfileModal();
  }

  createProfileModal() {
    this.innerHTML = `
      <dialog id="profileModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box w-11/12 max-w-5xl">
          <h3 class="text-lg font-bold">Hello ${user.username}!</h3>
          <br>

          <div class="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="checkbox" />

            <div class="collapse-title font-semibold">User Reports</div>
            <div class="collapse-content text-sm">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center place-self-end">
                <span class="font-semibold pr-2">Filter: </span>
                <select id="reportScope" class="select select-bordered select-sm w-full sm:w-48">
                  <option value="all">Citywide</option>
                  <option value="neighborhood">By neighbourhood</option>
                </select>

                <select
                  id="reportNeighborhood"
                  class="select select-bordered select-sm w-full sm:w-56 hidden"
                ></select>
              </div>
              <br>
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th><span id="sortUsername">Username <span id="usernameArrow">▼</span></span></th>
                      <th><span id="sortFormText">Report <span id="reportArrow">▼</span></span></th>
                      <th><span id="sortAddress">Address <span id="addressArrow">▼</span></span></th>
                      <th>Map View</th>
                    </tr>
                  </thead>
                  <tbody id="reports">
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <br>
          <div class="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="checkbox" />
            <div class="collapse-title font-semibold">Delete Account</div>
            <div class="collapse-content text-sm">
              <button class="btn bg-red-500 text-white" onclick="deleteProfileModal.showModal()">Delete Account</button>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="deleteProfileModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Are you sure?</h3>
          <p class="py-4">Account deletion cannot be undone.</p>

          <form method="dialog" class="flex justify-between items-end">
          <button id="confirmDeleteAccount" class="btn bg-red-500 text-white">Yes, delete my account</button>
            <button class="btn">No</button>
          </form>
        </div>
      </dialog>
    `;
  }
}

/**
 * Fetch the user account details
 * @returns user account details JSON
 */
async function fetchUser() {
  try {
    const result = await fetch("/api/user");
    const resultJSON = await result.json();
    return resultJSON.user;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Delete user account
 * @param {*} username current session's username
 */
async function deleteAccount(username) {
  try {
    const result = await fetch(`/api/deleteAccount/${username}`);
    const resultJSON = await result.json();

    window.location.href = "/auth/logout";
  } catch (error) {
    console.error("Error deleting account", error);
  }
}

/**
 * Fetch user reports from the backend
 * @returns user reports JSON
 */
async function fetchReports() {
  try {
    const result = await fetch("/api/reports");
    reports = await result.json();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Display user reports in a table. Used Copilot to learn how to store variables in HTML elements
 */
async function displayReports(neighbourhood = "all") {
  const reportsDiv = document.getElementById("reports");
  const profileModal = document.getElementById("profileModal");
  const reportsBtn = document.getElementById("formReports");

  reportsDiv.innerHTML = "";

  console.log(neighbourhood);

  reports.forEach((report) => {
    const reportItem = document.createElement("tr");

    reportItem.classList.add("hover:bg-base-300");
    reportItem.innerHTML = `
      <td>${report.username}</td>
      <td>${report.formText}</td>
      <td>${report.address}</td>
      <td>
        <button
          type="button"
          class="btn btn-sm" 
          data-lat="${report.lat}"
          data-lng="${report.lng}"
        >
          View
        </button>
      </td>
    `;
    reportsDiv.appendChild(reportItem);
  });

  // Add listener on each "View" button
  // Reads lat and lng from inline data on button element, closes profileModal, zooms to location
  reportsDiv
    .querySelectorAll("button[data-lat][data-lng]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const lat = Number(button.dataset.lat);
        const lng = Number(button.dataset.lng);

        profileModal.close();
        map.flyTo([lat, lng], 15, {
          animate: true,
          duration: 1,
        });

        if (!reportsBtn.classList.contains("active")) {
          reportsBtn.click();
        }
      });
    });
}

function sortReportUsernameAZ() {
  reports.sort((a, b) => {
    if (a.username > b.username) {
      return 1;
    }

    if (a.username < b.username) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

function sortReportUsernameZA() {
  reports.sort((a, b) => {
    if (a.username < b.username) {
      return 1;
    }

    if (a.username > b.username) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

function sortReportFormTextAZ() {
  reports.sort((a, b) => {
    if (a.formText[0].toLowerCase() > b.formText[0].toLowerCase()) {
      return 1;
    }

    if (a.formText[0].toLowerCase() < b.formText[0].toLowerCase()) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

function sortReportFormTextZA() {
  reports.sort((a, b) => {
    if (a.formText[0].toLowerCase() < b.formText[0].toLowerCase()) {
      return 1;
    }

    if (a.formText[0].toLowerCase() > b.formText[0].toLowerCase()) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

function sortReportAddressAZ() {
  reports.sort((a, b) => {
    if (a.address[0].toLowerCase() > b.address[0].toLowerCase()) {
      return 1;
    }

    if (a.address[0].toLowerCase() < b.address[0].toLowerCase()) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

function sortReportAddressZA() {
  reports.sort((a, b) => {
    if (a.address[0].toLowerCase() < b.address[0].toLowerCase()) {
      return 1;
    }

    if (a.address[0].toLowerCase() > b.address[0].toLowerCase()) {
      return -1;
    }

    return 0;
  });

  displayReports();
}

// Taken from Sprint 2 Pop-up AI-generated feature (map.js) and adapted for viewing reports by neighbourhood
async function fetchNeighborhoodNames() {
  try {
    const result = await fetch("/api/neighborhoods");
    const resultJSON = await result.json();

    return [
      ...new Set(
        (resultJSON.results || [])
          .map((neighborhood) => neighborhood.name)
          .filter(Boolean),
      ),
    ].sort((left, right) => left.localeCompare(right));
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Taken from Sprint 2 Pop-up AI-generated feature (map.js) and adapted for viewing reports by neighbourhood
async function loadNeighborhoodOptions() {
  const neighborhoodSelect = document.getElementById("reportNeighborhood");

  if (!neighborhoodSelect) {
    return;
  }

  const neighborhoods = await fetchNeighborhoodNames();
  neighborhoodSelect.innerHTML = "";

  if (!neighborhoods.length) {
    neighborhoodSelect.innerHTML = `<option value="">Neighbourhoods unavailable</option>`;
    neighborhoodSelect.disabled = true;
    return;
  }

  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.value = neighborhood;
    option.textContent = neighborhood.replace("Neighborhood", "Neighbourhood");
    neighborhoodSelect.appendChild(option);
  });

  neighborhoodSelect.disabled = false;
}

// Taken from Sprint 2 Pop-up AI-generated feature (map.js) and adapted for viewing reports by neighbourhood
function toggleReportNeighborhoodSelect() {
  const scope = document.getElementById("reportScope");
  const neighborhoodSelect = document.getElementById("reportNeighborhood");

  if (!scope || !neighborhoodSelect) {
    return;
  }

  neighborhoodSelect.classList.toggle("hidden", scope.value !== "neighborhood");
}

const user = await fetchUser();
let reports = [];

fetchReports();
displayReports();

customElements.define("site-profile", SiteProfile);

// Refresh reports table when profile modal is opened to clear old listeners
// Used Copilot to learn about event.newState
document.getElementById("profileModal").addEventListener("toggle", (e) => {
  if (e.newState === "open") {
    displayReports();
  }
});

// If user clicks/taps "Yes, delete my account", delete account
document
  .getElementById("confirmDeleteAccount")
  .addEventListener("click", () => {
    deleteAccount(user.username);
  });

// Close profileModal is the user clicks/taps outside the modal (on the dialog)
document.getElementById("profileModal").addEventListener("click", (e) => {
  const profileModal = document.getElementById("profileModal");
  if (e.target === profileModal) {
    profileModal.close();
  }
});

document.getElementById("sortUsername").addEventListener("click", () => {
  const sortDirection = document.getElementById("usernameArrow");

  if (sortDirection.innerText == "▲") {
    sortReportUsernameAZ();
    sortDirection.innerText = "▼";
  } else {
    sortReportUsernameZA();
    sortDirection.innerText = "▲";
  }
});

document.getElementById("sortFormText").addEventListener("click", () => {
  const sortDirection = document.getElementById("reportArrow");

  if (sortDirection.innerText == "▲") {
    sortReportFormTextAZ();
    sortDirection.innerText = "▼";
  } else {
    sortReportFormTextZA();
    sortDirection.innerText = "▲";
  }
});

document.getElementById("sortAddress").addEventListener("click", () => {
  const sortDirection = document.getElementById("addressArrow");

  if (sortDirection.innerText == "▲") {
    sortReportAddressAZ();
    sortDirection.innerText = "▼";
  } else {
    sortReportAddressZA();
    sortDirection.innerText = "▲";
  }
});

// Taken from Sprint 2 Pop-up AI-generated feature (map.js) and adapted for viewing reports by neighbourhood
document.getElementById("reportScope").addEventListener("change", async () => {
  toggleReportNeighborhoodSelect();

  if (
    document.getElementById("reportScope").value === "neighborhood" &&
    !document.getElementById("reportNeighborhood").options.length
  ) {
    await loadNeighborhoodOptions();
  }
});

// Taken from Sprint 2 Pop-up AI-generated feature (map.js) and adapted for viewing reports by neighbourhood
document.getElementById("reportNeighborhood").addEventListener("change", () => {
  if (document.getElementById("reportScope").value === "neighborhood") {
    displayReports(document.getElementById("reportNeighborhood").value);
  }
});

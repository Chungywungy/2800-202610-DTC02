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
          <p class="py-4">Press ESC key or click the button below to close</p>

          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th id="sortUsername">Username <span id="usernameArrow">▼</span></th>
                  <th>Report</th>
                  <th>Address</th>
                  <th>Map View</th>
                </tr>
              </thead>
              <tbody id="reports">
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-end">
            <button class="btn bg-red-500 text-white" onclick="deleteProfileModal.showModal()">Delete Account</button>
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
async function displayReports() {
  const reportsDiv = document.getElementById("reports");
  const profileModal = document.getElementById("profileModal");
  const reportsBtn = document.getElementById("formReports");

  reportsDiv.innerHTML = "";

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
  // ▼▲
  const sortDirection = document.getElementById("usernameArrow");

  if (sortDirection.innerText == "▲") {
    sortReportUsernameAZ();
    sortDirection.innerText = "▼";
  } else {
    sortReportUsernameZA();
    sortDirection.innerText = "▲";
  }
});

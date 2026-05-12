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
          <h3 class="text-lg font-bold">Hello!</h3>
          <p class="py-4">Press ESC key or click the button below to close</p>

          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Report</th>
                  <th>Address</th>
                  <th>Map?</th>
                </tr>
              </thead>
              <tbody id="reports">
              </tbody>
            </table>
          </div>

          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    `;
  }
}

async function fetchReports() {
  try {
    const result = await fetch("/api/reports");
    const resultJSON = await result.json();
    return resultJSON;
  } catch (error) {
    console.log(error);
  }
}

async function displayReports() {
  const reports = await fetchReports();
  const reportsDiv = document.getElementById("reports");

  reports.forEach((report) => {
    const reportItem = document.createElement("tr");

    reportItem.classList.add("hover:bg-base-300");
    reportItem.innerHTML = `
      <td>${report.username}</td>
      <td>${report.formText}</td>
      <td>${report.address}</td>
      <td>${report.lat}, ${report.lng}</td>
    `;
    reportsDiv.appendChild(reportItem);
  });
}

displayReports();
customElements.define("site-profile", SiteProfile);

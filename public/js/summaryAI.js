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

async function fetchReportSummary(scope, neighborhood) {
  const url = new URL("/api/reports/summary", window.location.origin);
  url.searchParams.set("scope", scope);

  if (scope === "neighborhood" && neighborhood) {
    url.searchParams.set("neighbourhood", neighborhood);
  }

  const result = await fetch(url);
  const resultJSON = await result.json();

  if (!result.ok) {
    throw new Error(resultJSON.error || "Failed to generate summary");
  }

  return resultJSON;
}

function createSummaryList(title, items) {
  const section = document.createElement("section");
  section.className = "rounded-box bg-base-100 p-4 shadow-sm";

  const heading = document.createElement("h5");
  heading.className = "font-semibold mb-2";
  heading.textContent = title;
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "list-disc pl-5 space-y-1 text-sm";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  section.appendChild(list);
  return section;
}

function createSummaryBadges(title, items) {
  const section = document.createElement("section");
  section.className = "rounded-box bg-base-100 p-4 shadow-sm";

  const heading = document.createElement("h5");
  heading.className = "font-semibold mb-3";
  heading.textContent = title;
  section.appendChild(heading);

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-wrap gap-2";

  items.forEach((item) => {
    const badge = document.createElement("span");
    badge.className = "badge badge-outline";
    badge.textContent = item;
    wrapper.appendChild(badge);
  });

  section.appendChild(wrapper);
  return section;
}

export async function loadNeighborhoodOptions() {
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");

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

export async function loadSummary() {
  const status = document.getElementById("summaryStatus");
  const output = document.getElementById("summaryOutput");
  const scope = document.getElementById("summaryScope").value;
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");
  const neighborhood =
    scope === "neighborhood" ? neighborhoodSelect.value : null;

  if (status) {
    status.textContent = "Generating summary...";
  }

  if (output) {
    output.innerHTML = "";
  }

  try {
    const summaryResponse = await fetchReportSummary(scope, neighborhood);
    const summary = summaryResponse.summary;

    if (status) {
      status.textContent = `${summaryResponse.relevantReportCount} relevant report${summaryResponse.relevantReportCount === 1 ? "" : "s"} used from ${summaryResponse.totalReportCount} total reports.`;
    }

    const overview = document.createElement("div");
    overview.className = "rounded-box bg-base-100 p-4 shadow-sm";

    const overviewHeading = document.createElement("h5");
    overviewHeading.className = "font-semibold mb-2";
    overviewHeading.textContent = "Overview";
    overview.appendChild(overviewHeading);

    const overviewText = document.createElement("p");
    overviewText.className = "text-sm leading-6";
    overviewText.textContent = summary.overview;
    overview.appendChild(overviewText);

    output.appendChild(overview);
    output.appendChild(
      createSummaryList("Highlights", summary.highlights || []),
    );
    output.appendChild(
      createSummaryList(
        "Recommended actions",
        summary.recommendedActions || [],
      ),
    );

    if ((summary.topTopics || []).length) {
      output.appendChild(createSummaryBadges("Top topics", summary.topTopics));
    }

    if ((summary.topNeighborhoods || []).length) {
      output.appendChild(
        createSummaryBadges(
          "Most active neighbourhoods",
          summary.topNeighborhoods,
        ),
      );
    }
  } catch (error) {
    console.log(error);

    if (status) {
      status.textContent = error.message || "Failed to generate summary.";
    }
  }
}

export function toggleSummaryNeighborhoodSelect() {
  const scope = document.getElementById("summaryScope");
  const neighborhoodSelect = document.getElementById("summaryNeighborhood");

  if (!scope || !neighborhoodSelect) {
    return;
  }

  neighborhoodSelect.classList.toggle("hidden", scope.value !== "neighborhood");
}

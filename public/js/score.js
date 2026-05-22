const waterFountainsInput = document.getElementById("waterFountainsText");
const washroomsInput = document.getElementById("washroomsText");
const parksInput = document.getElementById("parksText");
const communityCentresInput = document.getElementById("communityCentresText");
const transitInput = document.getElementById("transitText");

const totalWeight = document.getElementById("totalWeight");
const formulaMessage = document.getElementById("formulaMessage");
const saveFormulaBtn = document.getElementById("saveFormulaBtn");

const resetFormulaBtn = document.getElementById("resetFormula");

/**
 * Resets the formula sliders to equal default weights.
 */
function resetFormula() {
  const defaultFormula = {
    waterFountains: 0.2,
    washrooms: 0.2,
    parks: 0.2,
    communityCentres: 0.2,
    transit: 0.2,
  };

  updateSliders(defaultFormula);
  formulaMessage.innerText =
    "Formula reset to default. Click Save Formula to save it.";
}

resetFormulaBtn.addEventListener("click", () => {
  const defaultFormula = {
    waterFountains: 0.2,
    washrooms: 0.2,
    parks: 0.2,
    communityCentres: 0.2,
    transit: 0.2,
  };

  updateSliders(defaultFormula);

  window.showToast("Formula reset to default values.", "success");
});

/**
 * Gets the current heat score formula values from the text inputs.
 *
 * @returns {object} Formula weights for each heat score category.
 */
function getFormula() {
  return {
    waterFountains: Number(waterFountainsInput.value),
    washrooms: Number(washroomsInput.value),
    parks: Number(parksInput.value),
    communityCentres: Number(communityCentresInput.value),
    transit: Number(transitInput.value),
  };
}

/**
 * Calculates the total formula weight and updates the total display,
 * message, and save button state.
 */
function updateTotal() {
  const formula = getFormula();

  const total =
    formula.waterFountains +
    formula.washrooms +
    formula.parks +
    formula.communityCentres +
    formula.transit;

  totalWeight.innerText = `${Math.round(total * 100)}%`;

  if (Math.abs(total - 1) > 0.001) {
    totalWeight.className = "text-red-500 font-bold";
    saveFormulaBtn.disabled = true;
    formulaMessage.innerText = "Weights must total 100%.";
  } else {
    totalWeight.className = "text-green-600 font-bold";
    saveFormulaBtn.disabled = false;
    formulaMessage.innerText = "";
  }
}

waterFountains.addEventListener("input", updateTotal);
washrooms.addEventListener("input", updateTotal);
parks.addEventListener("input", updateTotal);
communityCentres.addEventListener("input", updateTotal);
transit.addEventListener("input", updateTotal);

waterFountainsInput.addEventListener("input", updateTotal);
washroomsInput.addEventListener("input", updateTotal);
parksInput.addEventListener("input", updateTotal);
communityCentresInput.addEventListener("input", updateTotal);
transitInput.addEventListener("input", updateTotal);

/**
 * Saves the current heat score formula to the backend.
 *
 * @async
 */
saveFormulaBtn.addEventListener("click", async () => {
  const formula = getFormula();

  const total =
    formula.waterFountains +
    formula.washrooms +
    formula.parks +
    formula.communityCentres +
    formula.transit;

  if (Math.abs(total - 1) > 0.001) {
    formulaMessage.innerText = "Weights must total 100%.";
    return;
  }

  const response = await fetch("/api/updateHeatScoreFormula", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formula),
  });

  const data = await response.json();

  formulaMessage.innerText = response.ok ? "Formula saved!" : data.error;
  if (response.ok) {
    window.showToast("Formula saved successfully!", "success");
    // Change the score achievement badge color when formula is saved
    const scoreAchievementElement = document.getElementById("score");
    if (scoreAchievementElement) {
      scoreAchievementElement.parentNode.classList.add("bg-warning");
    }
  }

  // fetch username
  const usernameResponse = await fetch("/api/user");
  const usernameObject = await usernameResponse.json();
  const username = usernameObject.user.username;

  // add achievement added logic
  const achievementAddedResponse = await fetch("/achievement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ achievementName: "score", username: username }),
  });
  const achievementResult = await achievementAddedResponse.json();
  if (
    achievementAddedResponse.ok &&
    (achievementResult.upsertedCount === 1 || achievementResult.upsertedId)
  ) {
    window.showToast("Achievement unlocked: Score", "success");
  }

  if (window.updateUserBadges && window.addThemeController) {
    window.updateUserBadges();
    window.addThemeController();
  }

  console.log(data);
  updateSliders(data.formula);
});

/**
 * Fetches the saved heat score formula from the backend and updates the sliders.
 *
 * @async
 */
async function loadFormula() {
  const response = await fetch("/api/heatScoreFormula");
  const data = await response.json();

  console.log(data);

  updateSliders(data.formula);
}

loadFormula();

/**
 * Updates the slider and text input values using the given formula.
 *
 * @param {object} formula - Formula object containing heat score weights.
 */
function updateSliders(formula) {
  Object.entries(formula).forEach(([sliderName, sliderValue]) => {
    // update textbox
    document.getElementById(`${sliderName}Text`).value = sliderValue.toFixed(2);

    // update slider
    document.getElementById(sliderName).value = sliderValue * 100;
  });

  updateTotal();
}

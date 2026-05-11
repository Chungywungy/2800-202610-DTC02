// Toggle login and register page
function toggleForms() {
  loginFormContainer.reset();
  registerFormContainer.reset();
  loginErrorMsg.textContent = "";
  registerErrorMsg.textContent = "";
  registerFormContainer.classList.toggle("hidden");
  loginFormContainer.classList.toggle("hidden");
}
createAccountBtn.addEventListener("click", toggleForms);
alreadyHaveAccountBtn.addEventListener("click", toggleForms);

loginFormContainer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // lets server know we are sending JSON data
    body: JSON.stringify(Object.fromEntries(new FormData(loginFormContainer))), // converts the HTML form data into JSON then converts to string
  });

  const data = await response.json();

  if (response.status === 200) {
    // account registration successful
    loginErrorMsg.textContent = "";
    window.location.href = "/home";
  } else {
    // error: email in-use, username in-use, password requirement not satisfied
    loginErrorMsg.textContent = data.message;
  }
});

registerFormContainer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // lets server know we are sending JSON data
    body: JSON.stringify(
      Object.fromEntries(new FormData(registerFormContainer)),
    ), // converts the HTML form data into JSON then converts to string
  });

  const data = await response.json();

  if (response.status === 200) {
    // account registration successful
    registerErrorMsg.textContent = "";
    window.location.href = "/login";
  } else {
    // error: email in-use, username in-use, password requirement not satisfied
    registerErrorMsg.textContent = data.message;
  }
});

redirectMapBtn.addEventListener("click", () => {
  window.location.href = "/home";
});

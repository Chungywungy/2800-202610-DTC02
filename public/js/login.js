// Toggle login and register page
createAccountBtn.addEventListener("click", () => {
  registerFormContainer.classList.toggle("hidden");
  loginFormContainer.classList.toggle("hidden");
});
alreadyHaveAccountBtn.addEventListener("click", () => {
  registerFormContainer.classList.toggle("hidden");
  loginFormContainer.classList.toggle("hidden");
});

loginFormContainer.addEventListener("submit", (e) => {
  //   e.preventDefault();
  alert("trying to login");
});

registerFormContainer.addEventListener("submit", (e) => {
  //   e.preventDefault();
  alert("trying to register");
});

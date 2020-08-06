// Handling log in
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let email, password;
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  const data = { email, password };
  let resp = await postData("/users/login", data);
  if (!resp.token) {
    alert("invalie credentials");
    return;
  }
  setCookie("token", resp.token, 0.5);
  window.location.replace(`/html/dashboard.html`);
});

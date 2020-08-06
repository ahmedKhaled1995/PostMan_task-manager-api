// Sign up form submit handler
let form = document.getElementById("signUpForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Getting form data
  let name, age, email, password, confirmPassword;
  name = document.getElementById("name").value;
  age = document.getElementById("age").value;
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  confirmPassword = document.getElementById("confirmPassword").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const userData = {
    name,
    email,
    password,
    age,
  };
  // posting data
  let resp = await postData("/users", userData);
  console.log(resp);
  if (resp.name === "MongoError") {
    alert("Email already exists. Please sign in!");
    return;
  }
  if (!resp.token) {
    // No token sent, means email is already in use
    alert(resp.message);
    return;
  }
  setCookie("token", resp.token, 0.5);
  window.location.replace(`/html/dashboard.html`);
});

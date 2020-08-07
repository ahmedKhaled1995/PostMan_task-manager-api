// Getting the token and declaring the id variable
let token = getCookie("token");
let id;

// Getting data when the page is loaded
document.addEventListener("DOMContentLoaded", async (e) => {
  let data = await getData("/users/me", getCookie("token"));
  document.getElementById("name").value = data.name;
  document.getElementById("age").value = data.age;
  document.getElementById("email").value = data.email;
  id = data._id;
  let imgResp = await getImg(`/users/${id}/avatar`, token);
  // image exists
  if (imgResp.status === 200) {
    document.getElementById("profile-picture").src = `/users/${id}/avatar`;
  }
});

// Handling user updating profile. Allowed fields ["name", "age", "email", "password"] and also the avatar
document
  .getElementById("apply-changes")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let name, age, email, password, confirmPassword;
    name = document.getElementById("name").value;
    age = document.getElementById("age").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    let data = password ? { name, age, email, password } : { name, age, email };
    let resp = await UpdateData("/users/me", data, token);
    if (resp._id) {
      // data updated successfully
      window.location.replace(`/html/dashboard.html`);
    }
  });

// Handling img upload
document.getElementById("img-upload").addEventListener("change", async (e) => {
  const files = e.target.files;
  const formData = new FormData();
  formData.append("avatar", files[0]);
  let resp = await uploadImg("/users/me/avatar", formData, token);

  if (resp.error) {
    alert(resp.error);
    return;
  }
  document.getElementById(
    "profile-picture"
  ).src = `/users/${id}/avatar?${Math.random()}`;
  // The reason I added the query string to the image above is duo yo a bug in chrome cashing,
  // By doing this I am forcing it to reload the img when changed by user
});

// Handling deleting the imgs
document.getElementById("delete-img").addEventListener("click", async (e) => {
  await deleteImg("/users/me/avatar", token);
  document.getElementById("profile-picture").src = "../img/avatar.png";
});

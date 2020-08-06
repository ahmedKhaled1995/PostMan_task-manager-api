// Getting token nad declaring id variable
let token = getCookie("token");
let id;

// Getting data when the page is loaded
document.addEventListener("DOMContentLoaded", async (e) => {
  await LoadPageData();
});

// Getting user data and updating the page to show user name and img (user personal Info)
async function LoadPageData() {
  let data = await getData("/users/me", getCookie("token"));
  document.getElementById("user-name").textContent = `Welcome, ${
    data.name.split(" ")[0]
  }`;
  id = data._id;
  let imgData = await getImg(`/users/${id}/avatar`, token);
  if (imgData.status !== 404) {
    //Img Found
    document.getElementById("profile-picture").src = `/users/${id}/avatar`;
    document.getElementById("avatar-img").src = `/users/${id}/avatar`;
  }
}

// Adding event to logout
document.getElementById("log-out").addEventListener("click", (e) => {
  e.preventDefault();
  logout("/users/logout", token).then(() => {
    // successful
    eraseCookie("token");
    window.location.replace(`../index.html`);
  });
});

// Handling user delete profile request
document.getElementById("delete-account").addEventListener("click", (e) => {
  e.preventDefault();
  deleteData("/users/me", token)
    .then((data) => {
      console.log(data);
      if (data._id) {
        // account deleted successfully
        eraseCookie("token");
        window.location.replace(`../index.html`);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

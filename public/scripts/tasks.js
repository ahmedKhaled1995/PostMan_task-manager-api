// An object that will hold IDs of the data retrieved form the server (max 6)
let rowsIds;

// Pagination variables
const LIMIT = 6; // The limit of tasks page can display
let skip = 0; // Used to skip pages

// Getting some (up to 6 because that's our LIMIT) user tasks on loading page
document.addEventListener("DOMContentLoaded", async (e) => {
  rowsIds = {};
  await UpdataTable(0, "desc");
  // Add functionality to add task button and the rows
  addTaskHandler();
});

// Updating tables row by getting data from the sever
// Return True if data was retrieved successfully
async function UpdataTable(page, order = "desc") {
  // Calculating skip
  skip = page * LIMIT;

  // Getting the table data
  let tasksData = await getData(
    `/tasks?sortBy=createdAt:${order}&limit=${LIMIT}&skip=${skip}`,
    token
  );
  // Continue with updating the page if data was retrieved frpm the server (tasks available)
  if (tasksData.length > 0) {
    // Clearing the table before adding the new data
    clearTable();

    // Grabing the table and looping it to insert the data
    // WARNING: DONOT USE:  let table = document.getElementById("tasks-table"), as rows will be inserted in the heading
    let table = document
      .getElementById("tasks-table")
      .getElementsByTagName("tbody")[0];
    let tableLength = tasksData.length;
    for (let i = 0; i < tableLength; i++) {
      // insert in the ending of the table
      let row = table.insertRow(
        document.getElementById("tasks-table").rows.length - 1
      );
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell4 = row.insertCell(3);
      let cell5 = row.insertCell(4);
      cell1.innerHTML = `${i + 1}`;
      cell2.innerHTML = tasksData[i].description;
      cell3.innerHTML = tasksData[i].completed;
      cell4.innerHTML = `<a class="edit-task table-clickable" data-toggle="modal" data-target="#editModal" href="#"> <i class="fa fa-pencil"></i> </a>`;
      cell5.innerHTML = `<a class="table-clickable" data-toggle="modal" data-target="#deleteModal" href="#"> <i class="fa fa-trash"></i> </a>`;
      // Storing IDs in rowsIds object
      rowsIds[`${i + 1}`] = tasksData[i]._id;
    }
    // Adding row Functionality
    addRowFunctionality();
    return true;
  } else {
    return false;
  }
}

// A function for updating the table when a link is clicked
// Return true if data was retrieved from server, false otherwise then disables the links
async function updateWhenLinkClicked(activeLink, clickedLink, targetPage) {
  // Getting the target Page
  let result = await UpdataTable(targetPage - 1);
  if (result) {
    activeLink.classList.remove("active");
    // To avoid setting active for next and previos
    if (
      clickedLink.parentNode.textContent.trim() !== "Next" &&
      clickedLink.parentNode.textContent.trim() !== "Prev"
    ) {
      clickedLink.parentNode.classList.add("active");
    }
    return true;
  } else {
    // no data available, so we disable the next links
    disableLinkes(targetPage);
    return false;
  }
}

// A function for handling adding Tasks
function addTaskHandler() {
  document
    .querySelector(".add-task-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      let taskName = document.getElementById("task-add").value;
      let taskStatus =
        document.getElementById("completed-add").value === "True"
          ? true
          : false;
      console.log(taskName, taskStatus);
      data = { description: taskName, completed: taskStatus };
      let responseData = await postDataToken("/tasks", data, token);
      console.log(responseData);
      window.location.replace("./dashboard.html"); // refreshing the page
    });
}

// handling updating the task (sending the PATCH request)
document
  .getElementById("update-button")
  .addEventListener("click", async (e) => {
    // Getting the id of the task we want to update
    let id = rowsIds[parseInt(rowData[0])];
    // Updating the task
    let taskName = document.getElementById("task-name-edit").value;
    let taskStatus =
      document.getElementById("task-completed-edit").value === "True"
        ? true
        : false;
    data = { description: taskName, completed: taskStatus };
    let responseData = await UpdateData(`/tasks/${id}`, data, token);
    window.location.replace("./dashboard.html"); // refreshing the page
  });

// Handling deleting the Tasks
document.getElementById("delete-task").addEventListener("click", async (e) => {
  e.preventDefault();
  // Getting the id of the task we want to delete
  let id = rowsIds[parseInt(rowData[0])];
  // Deleting the task
  let responseData = await deleteData(`/tasks/${id}`, token);
  window.location.replace("./dashboard.html"); // refreshing the page
});

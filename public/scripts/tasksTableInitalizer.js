// The row data stored globaly to be accessed to every method,
// note that the rowData will be updated when user clicks on edit or delete icon
let rowData = [];

// A function to clear table data
function clearTable() {
  let table = document.getElementById("tasks-table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
    // I stoped the loop at 1 and delete elements with index 1 because
    // I don't want to delete the heading
  }
}

// A function for getting the row data when the user clicks on edit or delete icons
function addRowFunctionality() {
  let tableClickableIcons = document.querySelectorAll(".table-clickable");
  tableClickableIcons.forEach((element) => {
    element.addEventListener("click", (e) => {
      let data = [];
      let target = e.target;
      while (target && target.nodeName !== "TR") {
        target = target.parentNode;
      }
      if (target) {
        let cells = target.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
          data.push(cells[i].textContent);
        }
      }
      rowData = data;
      document.getElementById("task-name-edit").value = rowData[1];
      document.getElementById("task-completed-edit").value =
        rowData[2] === "true" ? "True" : "False";
      //alert(rowData);
    });
  });
}

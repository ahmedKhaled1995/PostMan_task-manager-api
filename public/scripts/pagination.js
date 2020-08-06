// Handling Next
document.getElementById("next").addEventListener("click", async (e) => {
  // Getting the current active link (current page), and the link we clicked on (the page we want to go to)
  let activeNode = document.querySelector(".active");
  let currentPage = activeNode.textContent.trim();
  let nextPage = parseInt(currentPage) + 1;

  // making a request to the server to get the data
  // Note that in the below method, I didn't pass the second aregument as (e.target), because this
  // method expects the target page to be a number (not text like Next and Prev), So I passed
  // the page right after the active page. The same approch was taken in "Prev" method
  let result = await updateWhenLinkClicked(
    activeNode,
    activeNode.nextElementSibling.firstChild,
    nextPage
  );

  // Checking if there is data to be updated, if not, the function ends here
  if (result) {
    // Ckecking if the next link is not next, then checking if the next page is active
    if (activeNode.nextElementSibling.textContent.trim() !== "Next") {
      if (!activeNode.nextElementSibling.classList.contains("disabled")) {
        activeNode.classList.remove("active");
        activeNode.nextElementSibling.classList.add("active");
      }
    } else {
      // Here we were on the final link (the one right before next) and clicked next, so we update the values of the pagination
      // So we increase each page (link) by 5 (number of links minus Next and Prev )
      document.querySelector(".pagination").children[1].classList.add("active");
      activeNode.classList.remove("active");
      let links = document.querySelectorAll(".page-link");
      // we statrt at 1 and stop at 6 to avoid updating Next and Prev
      for (let i = 1; i < 6; i++) {
        links[i].textContent = parseInt(links[i].textContent.trim()) + 5;
      }
    }
  }
});

// Handlinh Prev
document.getElementById("prev").addEventListener("click", async (e) => {
  // Getting the current active link (current page), and the link we clicked on (the page we want to go to)
  let activeNode = document.querySelector(".active");
  let currentPage = activeNode.textContent.trim();
  let prevPage = currentPage - 1;

  // Aborting the function if we clicked Prev and we were on page 1
  if (parseInt(activeNode.textContent.trim()) === 1) {
    return;
  }

  // making a request to the server to get the data
  // See the above method for further info on the second argument
  let result = await updateWhenLinkClicked(
    activeNode,
    activeNode.previousElementSibling.firstChild,
    prevPage
  );

  // Checking if there is data to be updated, if not, the function ends here
  if (result) {
    // Ckecking if the prev link is not prev
    if (activeNode.previousElementSibling.textContent.trim() !== "Prev") {
      activeNode.classList.remove("active");
      activeNode.previousElementSibling.classList.add("active");
    } else {
      // Here we clicked on the prev and we were on page right after prev (6 for second page, 11 for third ... etc)
      // So we decrease each page (link) by 5 (number of links minus Next and Prev )
      document.querySelector(".pagination").children[5].classList.add("active");
      activeNode.classList.remove("active");
      let links = document.querySelectorAll(".page-link");
      // we decrease eack link by 5 (the number of links minus Next and Prev)
      for (let i = 1; i < 6; i++) {
        links[i].textContent = parseInt(links[i].textContent.trim()) - 5;
        if (links[i].parentElement.classList.contains("disabled")) {
          links[i].parentElement.classList.remove("disabled");
        }
      }
    }
  }
});

// Handling any link except Next and Prev
let pageLinks = document.querySelectorAll(".page-link");
pageLinks.forEach((item) => {
  item.addEventListener("click", async (e) => {
    let activeNode = document.querySelector(".active");
    let targetPage = e.target.textContent.trim();
    // The next condition is for avoiding  Next and Prev and clicking on the active link
    if (
      item.textContent !== "Next" &&
      item.textContent !== "Prev" &&
      e.target.textContent.trim() !== activeNode.textContent.trim()
    ) {
      await updateWhenLinkClicked(activeNode, e.target, parseInt(targetPage));
    }
  });
});

// Disable links if no futher data availabe (except next and prev)
function disableLinkes(startLinkCount) {
  document.querySelectorAll(".page-link").forEach((link) => {
    if (parseInt(link.parentElement.textContent.trim()) >= startLinkCount) {
      link.parentElement.classList.add("disabled");
    }
  });
}

const sentDataElement = document.getElementById("sentData");
const submitDelete = document.getElementById("submitDelete");
const secretcodeInput = document.getElementById("secretcode");
const updateCount = document.getElementById("submitUpdate");
const aliasInput = document.getElementById("alias");
let DeleteTable = document.getElementById("tableContent");
let buttonNewdataOne = document.getElementById("newDataOne");
let buttonNewdataTwo = document.getElementById("newDataTwo");
let deleteAllTable = document.getElementById("deleteAll");
let errorCodeMessage = document.getElementById("errorCodeMessage");
let errorAliasMessage = document.getElementById("errorAliasMessage");
let addNewData = document.getElementById("addNewData");

submitDelete.addEventListener("click", function (event) {
  event.preventDefault();
  const secretCode = parseInt(secretcodeInput.value);
  deleteLinkFE(secretCode);
  getData();
  // window.location.href = "http://localhost:3000/";
});

addNewData.addEventListener("click", function () {
  // buttonNewdataOne.disabled = "true";
  postNew();
});

buttonNewdataOne.addEventListener("click", function () {
  // buttonNewdataOne.disabled = "true";
  postFirst();

  //window.location.href = "http://localhost:3000/";
});

buttonNewdataTwo.addEventListener("click", function () {
  // buttonNewdataTwo.disabled = "true";
  postSecond();
});

deleteAllTable.addEventListener("click", function () {
  // buttonNewdataOne.disabled = false;
  deleteAll();
  DeleteTable.replaceChildren();
  getData();
});

updateCount.addEventListener("click", function (event) {
  event.preventDefault();
  const alias = aliasInput.value;
  updateHitcount(alias);
  getData();
});

function getData() {
  const sentDataElement = document.getElementById("sentData");
  if (!sentDataElement) {
    console.error("Error: sentData element not found");
    return;
  }

  sentDataElement.innerHTML = "";
  // Send a GET request to the server to retrieve the data
  fetch(`http://localhost:3000/api/getData`, {
    method: "GET",
  })
    .then((response) => {
      // Make sure the response is successful
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error retrieving data");
      }
    })
    .then((data) => {
      // Loop through the data array and append each item to the sentData element
      for (let i = 0; i < data.length; i++) {
        sentDataElement.innerHTML += `<p>Your alias name is: ${data[i].alias} and your secret code is: ${data[i].secretcode} and your hitcount is: ${data[i].hitcount} and it was created on ${data[i].timestamp} .</p>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/*
function fetchSecondTableData() {
  fetch('http://localhost:3000/api/filtering')
    .then(response => response.json())
    .then(data => {
      // render data in the browser
    })
    .catch(error => console.log(error))
}
*/

function TableData() {
  fetch(`http://localhost:3000/api/getData`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        // Get the template element
        const template = document.querySelector("#data-template");

        // Clone the template content
        const templateContent = template.content.cloneNode(true);

        // Update the template content with the data
        templateContent.querySelector("td:nth-of-type(1)").textContent =
          data[i].id;
        templateContent.querySelector("td:nth-of-type(2)").textContent =
          data[i].url;
        templateContent.querySelector("td:nth-of-type(3)").textContent =
          data[i].alias;
        templateContent.querySelector("td:nth-of-type(4)").textContent =
          data[i].hitcount;
        templateContent.querySelector("td:nth-of-type(5)").textContent =
          data[i].secretcode;

        // Create a new cell and button element
        const cell = templateContent.querySelector("tr").insertCell(-1);
        const buttonDelete = document.createElement("button");
        const buttonSave = document.createElement("button");

        // Set the text of the button to "Delete"
        buttonDelete.innerHTML = "Delete";
        buttonSave.innerHTML = "Save";

        // Add an event listener to the button to handle the deletion
        buttonDelete.addEventListener("click", function () {
          deleteDataTable(data[i].id);
          TableData();
          DeleteTable.replaceChildren();
        });

        const tableContent = document.querySelector("#tableContent");
        tableContent.addEventListener("input", (event) => {
          if (event.target.getAttribute("contenteditable")) {
            const field = event.target.getAttribute("data-field");
            data[i][field] = event.target.textContent;
          }
        });

        buttonSave.addEventListener("click", () => {
          modify(data[i].id, { alias: data[i].alias, url: data[i].url });
        });
        // Append the button to the cell
        cell.appendChild(buttonDelete);
        cell.appendChild(buttonSave);

        // Append the completed template to the table
        document.querySelector("#tableContent").appendChild(templateContent);
      }
    });
}

function deleteLinkFE(secretCode) {
  if (!secretCode) {
    errorCodeMessage.innerHTML = "no code provided";
    console.log("no code provided");
    return;
  }
  fetch(`http://localhost:3000/api/links?secretcode=${secretCode}`, {
    method: "DELETE",
  }).then((response) => {
    console.log(response);

    if (response.status === 200) {
      console.log("Deletion complete");
      return;
    }

    if (response.status === 400) {
      errorCodeMessage.innerHTML = "incorrect code";
      console.log("incorrect code");
      return;
    }
  });
}

function deleteDataTable(id) {
  fetch(`http://localhost:3000/api/links/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function deleteAll() {
  fetch(`http://localhost:3000/api/delTable`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function updateHitcount(alias) {
  if (!alias) {
    errorAliasMessage.innerHTML = "No alias provided";
    console.log("No alias provided");
    return;
  }
  fetch(`http://localhost:3000/api/links/update?alias=${alias}`, {
    method: "PUT",
  }).then((response) => {
    if (response.status === 200) {
      console.log("Update complete");
      return;
    }
    if (response.status === 404) {
      errorAliasMessage.innerHTML = "Incorrect alias provided";
      console.log("Incorrect alias provided");
      return;
    }
  });
}

function modify(id, urlaliaser) {
  fetch(`http://localhost:3000/api/saveData/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(urlaliaser),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post modified");
        return response.json();
      } else {
        console.error("Error modifying post");
        throw new Error("Error modifying post");
      }
    })
    .then((data) => {
      console.log(data);
      // update the UI with the modified data
    })
    .catch((error) => {
      console.error(error);
    });
}

function postNew() {
  fetch(`http://localhost:3000/api/newtabledata`, {
    method: "POST",
  }).then((response) => {
    if (response.ok) {
      console.log("adding data to database");
    } else {
      console.error("data already in table");
    }
  });
}

function postFirst() {
  fetch(`http://localhost:3000/api/objectDataFirst`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log("adding titan ship to database");
      } else {
        console.error("your titan is already in use");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function postSecond() {
  fetch(`http://localhost:3000/api/objectDataSecond`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log("adding your ship to database ");
      } else {
        console.error("your ship is already in use");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
  getData();
  TableData();
});

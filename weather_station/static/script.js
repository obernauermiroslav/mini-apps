let tempo = document.getElementsByClassName("tempD");
let logo = document.getElementsByClassName("message");
let image = document.getElementById("changePic");
let logoChange = document.getElementById("logochange");
let second = document.getElementById("temp");
let button = document.getElementsByClassName("detail");
let deletebutton = document.getElementById("deletebutton");
let buttonNewdata = document.getElementById("newData");
let targetcity = document.getElementById("targetcity");
let targetlocation = document.getElementById("targetlocation");
let targetweather = document.getElementById("targetweather");
let deleteData = document.getElementById("deleteData");
let bodyDataTable = document.getElementById("bodyTable");
let targetDelete = document.getElementById("rowTable");
let dataTemplate = document.getElementById("data-template");
let deleteAllTable = document.getElementById("deleteAll");
let DeleteTable = document.getElementById("tableContent");
let showData = document.getElementById("showdata");
let login = document.getElementById("login");
/*
var elements = document.getElementsByClassName("detail");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", function (event) {
    var targetElement = event.currentTarget;
    targetElement.addEventListener(
      "click",
      function () {
        let tempo = document.getElementsByClassName("tempD");
        tempo.textContent = "pokus";
        console.log(targetElement);
      },
      true
    );
  });
}
*/
buttonNewdata.addEventListener("click", function () {
  buttonNewdata.disabled = "true";
  post();

  table.style.visibility = "visible";
  DeleteTable.replaceChildren();
});

deleteAllTable.addEventListener("click", function () {
  buttonNewdata.disabled = false;
  deleteAll();
  DeleteTable.replaceChildren();
  getData();
});

showData.addEventListener("click", function () {
  getData();
  DeleteTable.replaceChildren();
});

function post() {
  fetch(`http://localhost:3000/api/weather/submit`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Posting ok ");
      } else {
        console.error("Error posting");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getData() {
  fetch(`http://localhost:3000/getData`, {
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
          data[i].city;
        templateContent.querySelector("td:nth-of-type(3)").textContent =
          data[i].location;
        templateContent.querySelector("td:nth-of-type(4)").textContent =
          data[i].weather;

        // Create a new cell and button element
        const cell = templateContent.querySelector("tr").insertCell(-1);
        const button = document.createElement("button");

        // Set the text of the button to "Delete"
        button.innerHTML = "Delete";

        // Add an event listener to the button to handle the deletion
        button.addEventListener("click", function () {
          deleteDataTable(data[i].id);
          getData();
          DeleteTable.replaceChildren();
        });

        // Append the button to the cell
        cell.appendChild(button);

        // Append the completed template to the table
        document.querySelector("#tableContent").appendChild(templateContent);
      }
    });
}

function deleteRows(rowIndex) {
  var table = document.getElementById("table");
  var row = table.rows[rowIndex];
  console.log(row);
  console.log(rowIndex);
  row.replaceChildren();
 
}

function deleteDataTable(id) {
  fetch(`http://localhost:3000/api/weather/${id}`, {
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
  fetch(`http://localhost:3000/api/weather/delete`, {
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

window.addEventListener("DOMContentLoaded", (event) => {
  getData();
  table.style.visibility = "visible";
});

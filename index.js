let inputEle = document.querySelector(".input");
let submitEle = document.querySelector(".add");
let fetchEle = document.querySelector(".fetch");
let tasksDiv = document.querySelector(".tasks");
let containerDiv = document.querySelector(".container");
let deleteAll = document.querySelector(".delete-all");
let arrayOfTasks = [];

if (window.localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}

getTaskFromLocalStorage();

submitEle.onclick = function () {
  if (inputEle.value !== "") {
    addTaskToArray(inputEle.value);
    inputEle.value = "";
  }
};

fetchEle.onclick = function () {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((item) => {
        addTaskToArray(item.title);
      });
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

function addTaskToArray(taskText) {
  console.log(taskText);
  const task = {
    userId: Date.now(),
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  arrayOfTasks.push(task);
  addTaskToPage(arrayOfTasks);

  addTaskToLocalStorage(arrayOfTasks);
}

function addTaskToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";

  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    if (task.completed) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    div.appendChild(span);
    tasksDiv.appendChild(div);
    // console.log(div)
  });
}
function addTaskToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}
function getTaskFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addTaskToPage(tasks);
  }
}

// Click On Task Element
tasksDiv.onclick = (e) => {
  if (e.target.classList.contains("del")) {
    // e.target.parentElement.remove();
    e.target.parentElement.remove();
    deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
  }
  if (e.target.classList.contains("task")) {
    e.target.classList.toggle("done");
    updateStatusInLocalStorage(e.target.getAttribute("data-id"));
  }
};

function deleteTaskFromLocalStorage(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addTaskToLocalStorage(arrayOfTasks);
}
function updateStatusInLocalStorage(taskId) {
  arrayOfTasks.forEach((task) => {
    if (task.id == taskId)
      task.completed == false
        ? (task.completed = true)
        : (task.completed = false);
  });

  addTaskToLocalStorage(arrayOfTasks);
}

deleteAll.onclick = function (e) {
  tasksDiv.innerHTML = "";
  window.localStorage.removeItem("tasks");
};

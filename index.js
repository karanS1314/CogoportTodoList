let arrayOfTasks = [];
let fetchEle = document.querySelector(".fetch");
let delAllEle = document.querySelector(".delAll");

if (window.localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}

getTaskFromLocalStorage();

function getTaskFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    renderlist();
  }
}

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
        arrayOfTasks.push(item);
        renderlist();
        addTaskToLocalStorage(arrayOfTasks);
      });
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
};

function addtask(task) {
  arrayOfTasks.push(task);
  addTaskToLocalStorage(arrayOfTasks);
}

function addTaskToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function deletetask(id) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != id);
  addTaskToLocalStorage(arrayOfTasks);
}

function savetask(id, newval) {
  // console.log(newval);
  const taskIndex = arrayOfTasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    arrayOfTasks[taskIndex].title = newval;
  }
  addTaskToLocalStorage(arrayOfTasks);
}

function updateStatus(id) {
  arrayOfTasks.forEach((task) => {
    if (task.id == id)
      task.completed == false
        ? (task.completed = true)
        : (task.completed = false);
  });
  addTaskToLocalStorage(arrayOfTasks);
  // console.log(arrayOfTasks);
}

function renderlist() {
  const tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = "";

  for (let i = 0; i < arrayOfTasks.length; i++) {
    const taskID = arrayOfTasks[i].id;

    const task = document.createElement("li");

    const taskCheck = document.createElement("input");
    taskCheck.type = "checkbox";
    taskCheck.onclick = (e) => {
      e.target.parentElement.classList.toggle("task-done");
      updateStatus(taskID);
    };
    if (arrayOfTasks[i].completed) {
      task.classList.add("task-done");
      taskCheck.checked = "true";
    }
    const taskText = document.createElement("span");
    taskText.innerHTML = arrayOfTasks[i].title;

    const buttonsbox = document.createElement("div");
    buttonsbox.classList.add("buttons-container");

    const editbtn = document.createElement("button");
    editbtn.innerHTML = "Edit";
    editbtn.classList.add("edit-button");

    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = "Delete";

    editbtn.onclick = () => {
      const editinput = document.createElement("input");
      editinput.type = "text";
      editinput.value = arrayOfTasks[i].title;

      const editsavebtn = document.createElement("button");
      editsavebtn.innerHTML = "Save";
      editsavebtn.classList.add("edit-save-button");

      editsavebtn.onclick = () => {
        savetask(taskID, editinput.value);
        renderlist();
      };

      task.innerHTML = "";
      task.appendChild(editinput);
      task.appendChild(editsavebtn);
    };

    deletebtn.onclick = (e) => {
      console.log(e.target.parentElement);
      deletetask(taskID);
      renderlist();
    };

    buttonsbox.appendChild(editbtn);
    buttonsbox.appendChild(deletebtn);

    task.appendChild(taskCheck);
    task.appendChild(taskText);
    task.appendChild(buttonsbox);

    tasksDiv.appendChild(task);
  }
}

const savebtn = document.getElementById("savebtn");

savebtn.onclick = () => {
  const taskInput = document.getElementById("taskinput");
  const task = {
    userId: Date.now(),
    id: Date.now(),
    title: taskInput.value,
    completed: false,
  };
  addtask(task);
  taskInput.value = "";
  renderlist();
};

delAllEle.onclick = function (e) {
  const tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = "";
  arrayOfTasks = [];
  window.localStorage.clear();
};

renderlist();

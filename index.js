let arrayOfTasks = [];
let subtasksArray = [];
let filter = {};
let sortBy = {};
let vBacklog = 0;
let editID = "";

if (window.localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}
if (window.localStorage.getItem("subtasks")) {
  subtasksArray = JSON.parse(window.localStorage.getItem("subtasks"));
}
if (window.localStorage.getItem("filters")) {
  filter = JSON.parse(window.localStorage.getItem("filters"));
}
if (window.localStorage.getItem("backlog")) {
  vBacklog = window.localStorage.getItem("backlog");
}

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
  window.location.reload();
}

function savetask(id, newTitle, newDate, newPriority, newCat, newTags) {
  // console.log(newval);
  const taskIndex = arrayOfTasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    arrayOfTasks[taskIndex].title = newTitle;
    arrayOfTasks[taskIndex].dueDate = newDate;
    arrayOfTasks[taskIndex].priority = newPriority;
    arrayOfTasks[taskIndex].category = newCat;
    arrayOfTasks[taskIndex].tags = newTags.split(",");
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
  let applyFilters = 1;
  if (!window.localStorage.getItem("filters")) {
    applyFilters = 0;
  }
  for (let i = 0; i < arrayOfTasks.length; i++) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;
    if (
      arrayOfTasks[i].reminder == "yes" &&
      formattedToday == arrayOfTasks[i].reminder &&
      today.getHours() % 6 == 0
    ) {
      alert(
        "Last day to submit the task having title: " + arrayOfTasks[i].title
      );
    }
    if (vBacklog == 1) {
      const comp = formattedToday.localeCompare(arrayOfTasks[i].dueDate);
      if (comp == 0 || comp == -1) {
        continue;
      }
    }
    if (applyFilters == 1) {
      if (filter.tags != "") {
        let filterTagArray = filter.tags.split(",");
        let co = 0;
        for (let k = 0; k < filterTagArray.length; k++) {
          let tagPresent = 0;
          for (let j = 0; j < arrayOfTasks[i].tags.length; j++) {
            if (filterTagArray[k] == arrayOfTasks[i].tags[j]) {
              tagPresent = 1;
              continue;
            }
          }
          if (tagPresent == 0) {
            co = 1;
            break;
          }
        }
        if (co == 1) {
          continue;
        }
      }
      if (
        filter.category != "" &&
        !arrayOfTasks[i].category.includes(filter.category)
      ) {
        continue;
      }
      if (
        filter.priority != "none" &&
        filter.priority != arrayOfTasks[i].priority
      ) {
        continue;
      }
      if (filter.fromDate != "" && filter.fromDate > arrayOfTasks[i].dueDate) {
        continue;
      }
      if (filter.toDate != "" && filter.toDate < arrayOfTasks[i].dueDate) {
        continue;
      }
    }
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
    const textDiv = document.createElement("div");
    const taskText = document.createElement("li");
    taskText.classList.add("task-text");
    taskText.innerHTML = arrayOfTasks[i].title;

    const subUl = document.createElement("ul");
    for (let j = 0; j < arrayOfTasks[i].subtasks.length; j++) {
      const subLi = document.createElement("li");
      subLi.classList.add("sub-li");
      subLi.innerHTML = arrayOfTasks[i].subtasks[j].title;
      subUl.appendChild(subLi);
    }

    textDiv.append(taskText);
    textDiv.append(subUl);

    const propDiv = document.createElement("div");
    propDiv.classList.add("propDiv");
    const cat = document.createElement("li");
    cat.innerHTML = "Category : " + arrayOfTasks[i].category;

    const pri = document.createElement("li");
    pri.innerHTML = "Priority : " + arrayOfTasks[i].priority;

    const tag = document.createElement("li");
    tag.innerHTML = "Tags : " + arrayOfTasks[i].tags.join();

    const dat = document.createElement("li");
    dat.innerHTML = "By : " + arrayOfTasks[i].dueDate;

    propDiv.appendChild(cat);
    propDiv.appendChild(pri);
    propDiv.appendChild(tag);
    propDiv.appendChild(dat);

    const buttonsbox = document.createElement("div");
    buttonsbox.classList.add("buttons-container");

    const editbtn = document.createElement("button");
    editbtn.innerHTML = "Edit";
    editbtn.classList.add("edit-button");
    const deletebtn = document.createElement("button");
    deletebtn.innerHTML = "Delete";

    editbtn.onclick = () => {
      const eInputContainer = document.createElement("div");
      eInputContainer.classList.add("input-container");

      const eTextContainer = document.createElement("div");
      eTextContainer.classList.add("text-container");

      const eInputText = document.createElement("input");
      eInputText.type = "text";
      eInputText.value = arrayOfTasks[i].title;
      eTextContainer.appendChild(eInputText);

      const eSubtaskTextContainer = document.createElement("div");
      const eSubtaskInput = document.createElement("input");
      eSubtaskInput.placeholder = "Subtask";
      eSubtaskInput.type = "text";

      const eSubSaveBtn = document.createElement("button");
      eSubSaveBtn.classList.add("eSubSaveBtn");
      eSubSaveBtn.innerHTML = "+";
      eSubSaveBtn.onclick = () => {
        if (eSubtaskInput.value == "") {
          return;
        }
        const subtaskEntry = {
          id: Date.now(),
          title: eSubtaskInput.value,
        };
        arrayOfTasks[i].subtasks.push(subtaskEntry);
        addTaskToLocalStorage(arrayOfTasks);
        eSubtaskInput.value = "";
        editbtn.click();
      };
      const eSubtaskContainer = document.getElementById("subtask-saved");
      eSubtaskContainer.innerHTML = "";

      for (let j = 0; j < arrayOfTasks[i].subtasks.length; j++) {
        const subtaskID = arrayOfTasks[i].subtasks[j].id;
        const subtask = document.createElement("li");

        const subtaskText = document.createElement("span");
        subtaskText.classList.add("sub-text");
        subtaskText.innerHTML = arrayOfTasks[i].subtasks[j].title;

        const buttonsbox = document.createElement("div");
        buttonsbox.classList.add("buttons-container");
        const subDltBtn = document.createElement("button");
        subDltBtn.classList.add("sub-task-dlt-btn");
        subDltBtn.innerHTML = "Remove Subtask";
        subDltBtn.onclick = (e) => {
          arrayOfTasks[i].subtasks = arrayOfTasks[i].subtasks.filter(
            (task) => task.id != subtaskID
          );
          addTaskToLocalStorage(arrayOfTasks);
          editbtn.click();
        };

        buttonsbox.appendChild(subDltBtn);

        subtask.appendChild(subtaskText);
        subtask.appendChild(buttonsbox);
        eSubtaskContainer.appendChild(subtask);
      }
      eSubtaskTextContainer.appendChild(eSubtaskInput);
      eSubtaskTextContainer.appendChild(eSubSaveBtn);
      eSubtaskTextContainer.appendChild(eSubtaskContainer);

      eInputContainer.appendChild(eTextContainer);
      eInputContainer.appendChild(eSubtaskTextContainer);

      const eDiv = document.createElement("div");
      eDiv.classList.add("eDiv");
      const eDate = document.createElement("input");
      eDate.type = "date";
      eDate.value = arrayOfTasks[i].dueDate;

      const eCatLabel = document.createElement("span");
      eCatLabel.innerHTML = "Category :";
      const eCategory = document.createElement("input");
      eCategory.type = "text";
      eCategory.value = arrayOfTasks[i].category;

      const eTagLabel = document.createElement("span");
      eTagLabel.innerHTML = "Tags :";
      const eTags = document.createElement("input");
      eTags.type = "text";
      eTags.value = arrayOfTasks[i].tags;

      const ePriLabel = document.createElement("span");
      ePriLabel.innerHTML = "Priority :";
      const ePriority = document.createElement("select");
      ePriority.value = arrayOfTasks[i].priority;
      console.log(ePriority.value);
      let option = document.createElement("option");
      option.value = "high";
      option.text = "High";
      ePriority.appendChild(option);
      option = document.createElement("option");
      option.value = "medium";
      option.text = "Medium";
      ePriority.appendChild(option);
      option = document.createElement("option");
      option.value = "low";
      option.text = "Low";
      ePriority.appendChild(option);

      eDiv.appendChild(eDate);
      eDiv.appendChild(document.createElement("br"));
      eDiv.appendChild(eCatLabel);
      eDiv.appendChild(eCategory);
      eDiv.appendChild(document.createElement("br"));
      eDiv.appendChild(ePriLabel);
      eDiv.appendChild(ePriority);
      eDiv.appendChild(document.createElement("br"));
      eDiv.appendChild(eTagLabel);
      eDiv.appendChild(eTags);

      const editsavebtn = document.createElement("button");
      editsavebtn.innerHTML = "Save";
      editsavebtn.classList.add("edit-save-button");
      editsavebtn.onclick = () => {
        savetask(
          taskID,
          eInputText.value,
          eDate.value,
          ePriority.value,
          eCategory.value,
          eTags.value
        );
        window.location.reload();
      };

      task.innerHTML = "";
      task.appendChild(eInputContainer);
      task.appendChild(eDiv);
      task.appendChild(editsavebtn);
    };

    deletebtn.onclick = (e) => {
      deletetask(taskID);
      renderlist();
    };

    buttonsbox.appendChild(editbtn);
    buttonsbox.appendChild(deletebtn);

    const Div = document.createElement("div");
    Div.classList.add("Div");
    const topDiv = document.createElement("div");
    topDiv.classList.add("topDiv");
    const botDiv = document.createElement("div");
    botDiv.classList.add("botDiv");
    textDiv.classList.add("textDiv");
    taskCheck.classList.add("taskCheck");
    topDiv.appendChild(taskCheck);
    topDiv.appendChild(textDiv);
    topDiv.appendChild(propDiv);

    botDiv.appendChild(buttonsbox);

    Div.appendChild(topDiv);
    Div.appendChild(botDiv);

    task.append(Div);
    task.classList.add("task");
    tasksDiv.appendChild(task);
  }
}

const savebtn = document.getElementById("savebtn");
savebtn.onclick = () => {
  const taskInput = document.getElementById("taskinput");
  if (taskInput.value == "") {
    alert("Task cannot have empty title / description!");
    return;
  }
  if (dueDate.value == "") {
    alert("Task must have a due date!");
    return;
  }
  const task = {
    id: Date.now(),
    title: taskInput.value,
    completed: false,
    category: category.value,
    priority: priority.value,
    tags: tags.value.split(","),
    dueDate: dueDate.value,
    subtasks: subtasksArray,
    reminder: reminder.value,
  };
  console.log(task);
  subtasksArray = [];
  window.localStorage.removeItem("subtasks");
  addtask(task);
  taskInput.value = "";
  category.value = "";
  window.location.reload();
};

function rendersublist() {
  const subtaskContainer = document.getElementById("subtask-saved");

  subtaskContainer.innerHTML = "";

  for (let i = 0; i < subtasksArray.length; i++) {
    const subtaskID = subtasksArray[i].id;
    const subtask = document.createElement("li");

    const subtaskText = document.createElement("span");
    subtaskText.classList.add("sub-text");
    subtaskText.innerHTML = subtasksArray[i].title;

    const buttonsbox = document.createElement("div");
    buttonsbox.classList.add("buttons-container");
    const subDltBtn = document.createElement("button");
    subDltBtn.classList.add("sub-task-dlt-btn");
    subDltBtn.innerHTML = "Remove Subtask";
    subDltBtn.onclick = (e) => {
      console.log(subtasksArray);
      subtasksArray = subtasksArray.filter((task) => task.id != subtaskID);
      window.localStorage.setItem("subtasks", JSON.stringify(subtasksArray));
      rendersublist();
    };

    buttonsbox.appendChild(subDltBtn);

    subtask.appendChild(subtaskText);
    subtask.appendChild(buttonsbox);
    subtaskContainer.appendChild(subtask);
  }
}
const subsavebtn = document.getElementById("sub-save-btn");
subsavebtn.onclick = () => {
  const subtaskInput = document.getElementById("subtaskInput");
  if (subtaskInput.value == "") {
    return;
  }
  const subtaskEntry = {
    id: Date.now(),
    title: subtaskInput.value,
  };
  subtasksArray.push(subtaskEntry);
  window.localStorage.setItem("subtasks", JSON.stringify(subtasksArray));
  subtaskInput.value = "";
  rendersublist();
};

let delAllEle = document.querySelector(".delAll");
delAllEle.onclick = function (e) {
  const tasksDiv = document.getElementById("tasks");
  tasksDiv.innerHTML = "";
  arrayOfTasks = [];
  window.localStorage.clear();
};

const filterBtn = document.getElementById("filterBtn");
filterBtn.onclick = () => {
  const filterSet = {
    tags: TagsFilter.value,
    category: categoryFilter.value,
    priority: priorityFilter.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
  };
  window.localStorage.setItem("filters", JSON.stringify(filterSet));
  filter = filterSet;
  console.log(filterSet);
  renderlist();
};

const resetFilter = document.getElementById("resetFilter");
resetFilter.onclick = () => {
  window.localStorage.removeItem("filters");
  filter = {};
  window.location.reload();
};

const priorities = {
  high: 0,
  medium: 1,
  low: 2,
};
const sortBtn = document.getElementById("sortBtn");
sortBtn.onclick = () => {
  sortBy = sort.value;
  if (sortBy == 1) {
    arrayOfTasks.sort(function (task1, task2) {
      if (task1.dueDate > task2.dueDate) {
        return 1;
      } else if (task1.dueDate < task2.dueDate) {
        return -1;
      }
      return 0;
    });
  } else if (sortBy == 2) {
    arrayOfTasks.sort(function (task1, task2) {
      if (task1.dueDate > task2.dueDate) {
        return -1;
      } else if (task1.dueDate < task2.dueDate) {
        return 0;
      }
      return 0;
    });
  } else if (sortBy == 3) {
    arrayOfTasks.sort(function (task1, task2) {
      return priorities[task2.priority] - priorities[task1.priority];
    });
  } else {
    arrayOfTasks.sort(function (task1, task2) {
      return priorities[task1.priority] - priorities[task2.priority];
    });
    console.log(arrayOfTasks);
  }
  renderlist();
};

function toggleView() {
  vBacklog = 1 - vBacklog;
  window.localStorage.setItem("backlog", JSON.stringify(vBacklog));
  renderlist();
}

// search function
function search() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName("task-text");
  for (i = 0; i < x.length; i++) {
    // console.log(x[i].innerHTML.toLowerCase());
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].parentElement.style.display = "none";
    } else {
      x[i].parentElement.style.display = "";
    }
  }
}

renderlist();
rendersublist();

let userTaskInput = document.querySelector(".task-input input");
let todoList = document.querySelector(".todos-list");
let filters = document.querySelectorAll(".filter-div span");
let clearBtn = document.querySelector(".clear-btn");

let editTaskId;
let isEdited = false;
// datas from local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));

// clear all tasks
clearBtn.addEventListener("click", (_) => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

// filter tasks
filters.forEach((span) => {
  span.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    showTodo(span.id);
  });
});

// update tasks
function updateTask(updateId, updateTask) {
  isEdited = true;
  editTaskId = updateId;
  userTaskInput.value = updateTask;
}

// delete tasks
function deleteTasks(deleteId, status) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(status);
}

// update status local storage and ui
function statusUpdate(line) {
  let task = line.parentElement.lastElementChild;
  if (line.checked) {
    task.classList.add("active");
    // update task
    todos[line.id].status = "complete";
  } else {
    task.classList.remove("active");
    todos[line.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showTodo(filterStatus) {
  data = "";
  if (todos) {
    todos.forEach((item, id) => {
      let completeStatus = item.status == "complete" ? "active" : "";
      let completeTaskCheck = item.status == "complete" ? "checked" : "";
      if (filterStatus == item.status || filterStatus == "all") {
        data += `
      <li class="todo-items">
              <label for="${id}">
                <input type="checkbox" id="${id}" onclick="statusUpdate(this)" ${completeTaskCheck}/>
                <p class=" todo-txt ${completeStatus}">${item.task}</p>
              </label>
              <div class="">
                <i class="fa-solid fa-pen-to-square" onclick="updateTask(${id},'${item.task}')"></i>
                <i class="fa-solid fa-trash-can" onclick="deleteTasks(${id},'${item.status}')"></i>
              </div>
      </li>`;
      }
      todoList.innerHTML = data || `<p class="noTasks">There is no tasks</p>`;
    });
  }
}
showTodo("all");

// to store localstorage
userTaskInput.addEventListener("keyup", (e) => {
  let userInput = userTaskInput.value.trim();
  if (e.key == "Enter") {
    // if todos do not have create todos with empty array
    if (isEdited) {
      todos[editTaskId].task = userInput;
      editTaskId;
      isEdited = false;
    } else {
      if (!todos) {
        todos = [];
      }
      let userTasks = { task: userInput, status: "pending" };
      todos.push(userTasks);
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    userTaskInput.value = "";
    showTodo("all");
  }
});

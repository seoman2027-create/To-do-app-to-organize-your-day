// Select elements
const form = document.querySelector("form");
const clearAllButton = document.querySelector(".clear-all");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector(".task-count");
const input = document.querySelector("input");
const prioritySelect = document.querySelector("select[name='priority']");
const filterSelect = document.querySelector("#filter-select");

// Update counter
function updateCounter() {
  taskCount.textContent = "Total tasks: " + taskList.children.length;
}

// Create task element
function createTaskElement(text, priority, completed = false) {
  const task = document.createElement("div");
  task.classList.add("task-item");
  task.dataset.priority = priority;
  task.textContent = text;

  // Set color
  if (priority === "high") task.style.backgroundColor = "red";
  else if (priority === "middle") task.style.backgroundColor = "green";
  else if (priority === "low") task.style.backgroundColor = "yellow";

  if (completed) task.classList.add("completed");

  // Toggle completed
  task.addEventListener("click", () => {
    task.classList.toggle("completed");
    saveTasks();
  });

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");

  deleteButton.addEventListener("click", e => {
    e.stopPropagation();
    task.remove();
    saveTasks();
    updateCounter();
  });

  task.appendChild(deleteButton);

  // Edit on double click
  task.addEventListener("dblclick", () => {
    const currentText = task.firstChild.textContent.trim();
    const editInput = document.createElement("input");
    editInput.value = currentText;

    task.innerHTML = "";
    task.appendChild(editInput);
    task.appendChild(deleteButton);
    editInput.focus();

    editInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && editInput.value.trim() !== "") {
        task.innerHTML = editInput.value;
        task.appendChild(deleteButton);
        saveTasks();
      }
    });
  });

  taskList.appendChild(task);
  updateCounter();
  return task;
}

// Save tasks
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll(".task-item").forEach(item => {
    tasks.push({
      text: item.firstChild.textContent.trim(),
      completed: item.classList.contains("completed"),
      priority: item.dataset.priority
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.priority, task.completed));
}

// Clear all
clearAllButton.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateCounter();
});

// Add new task
form.addEventListener("submit", e => {
  e.preventDefault();
  if (input.value.trim() === "") return;
  const priority = prioritySelect.value;
  createTaskElement(input.value, priority);
  saveTasks();
  input.value = "";
});

// Filter
filterSelect.addEventListener("change", () => {
  const filterValue = filterSelect.value;
  taskList.querySelectorAll(".task-item").forEach(task => {
    const isCompleted = task.classList.contains("completed");
    const taskPriority = task.dataset.priority;

    let show = false;
    if (filterValue === "all") show = true;
    else if (filterValue === "completed" && isCompleted) show = true;
    else if (filterValue === "incomplete" && !isCompleted) show = true;
    else if (filterValue === taskPriority) show = true;

    task.style.display = show ? "flex" : "none";
  });
});

// Init
loadTasks();
updateCounter();

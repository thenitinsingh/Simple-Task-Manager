function addtask() {
    let task = document.getElementById("text").value;
    let description = document.getElementById("description").value;
    let priority = document.querySelector(".dropbox").value;
    if (!task.trim()) { 
        alert("Please enter a task title.");
        return;
    }
    let data = { description, priority, completed: false }; 
    localStorage.setItem(task, JSON.stringify(data));
    document.getElementById("text").value = "";
    document.getElementById("description").value = "";
    document.querySelector(".dropbox").value = "Low Priority";
    displaytasks();
}
function displaytasks() {
    let table = document.querySelector("table"); 
    table.style.visibility = "visible"; 
    let rows = table.getElementsByTagName("tr");
    while (rows.length > 1) {
        table.deleteRow(1);
    }
    for (let i = 0; i < localStorage.length; i++) {
        let task = localStorage.key(i);
        let data = JSON.parse(localStorage.getItem(task));  
        let row = table.insertRow();
        //Make Task title editable
        let taskCell = row.insertCell(0);
        taskCell.textContent = task;
        taskCell.contentEditable = "true";
        taskCell.onblur = function () {
            updateTaskTitle(task, taskCell.textContent);
        };
        //Make table Description editable
        let descriptionCell = row.insertCell(1);
        descriptionCell.textContent = data.description;
        descriptionCell.contentEditable = "true";
        descriptionCell.onblur = function () {
            updateTask(task, "description", descriptionCell.textContent);
        };
        //Make Priority editable
        let priorityCell = row.insertCell(2);
        priorityCell.textContent = data.priority;
        priorityCell.contentEditable = "true";
        priorityCell.onblur = function () {
            updateTask(task, "priority", priorityCell.textContent);
        };
        //Checkbox for completed 
        let checkboxCell = row.insertCell(3);
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = data.completed;
        checkbox.addEventListener("change", function () {
            data.completed = checkbox.checked;
            localStorage.setItem(task, JSON.stringify(data));
        });
        checkboxCell.appendChild(checkbox);
        //Delete task button
        let deleteCell = row.insertCell(4);
        let deleteBtn = document.createElement("img");
        deleteBtn.src = "delete-img.png"; 
        deleteBtn.alt = "Delete";
        deleteBtn.classList.add("icon-button");
        deleteBtn.onclick = function () {
            deleteTask(task);
        };
        deleteCell.appendChild(deleteBtn);
    }
}
//Edit tasks from table directly.
function updateTask(task, field, newValue) {
    let data = JSON.parse(localStorage.getItem(task));
    data[field] = newValue;
    localStorage.setItem(task, JSON.stringify(data));
}
function updateTaskTitle(oldTask, newTask) {
    if (!newTask.trim()) {
        alert("Task title cannot be empty!");
        displaytasks();
        return;
    }
    let data = JSON.parse(localStorage.getItem(oldTask));
    localStorage.removeItem(oldTask);
    localStorage.setItem(newTask, JSON.stringify(data));
    displaytasks();
}
function deleteTask(task) {
    if (confirm("Are you sure you want to delete this task?")) {
        localStorage.removeItem(task);
        displaytasks();
    }
}
window.onload = displaytasks;
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".allbutton").style.backgroundColor = "#5691df"; 
    filterTasks("all"); 
    document.querySelector(".allbutton").addEventListener("click", function () {
        setActiveButton("allbutton");
        filterTasks("all");
    });
    document.querySelector(".activebutton").addEventListener("click", function () {
        setActiveButton("activebutton");
        filterTasks("active");
    });
    document.querySelector(".completedbutton").addEventListener("click", function () {
        setActiveButton("completedbutton");
        filterTasks("completed");
    });
});
function setActiveButton(buttonClass) {
    document.querySelectorAll(".buttons input").forEach(btn => {
        btn.style.backgroundColor = "#e1e8f2";
    });
    document.querySelector("." + buttonClass).style.backgroundColor = "#5691df";
}
function filterTasks(filterType) {
    let table = document.querySelector("table");
    table.style.visibility = "visible";
    let rows = table.getElementsByTagName("tr");
    while (rows.length > 1) {
        table.deleteRow(1);
    }
    for (let i = 0; i < localStorage.length; i++) {
        let task = localStorage.key(i);
        let data = JSON.parse(localStorage.getItem(task));  
        if ((filterType === "active" && data.completed) || (filterType === "completed" && !data.completed)) {
            continue;
        }       
        let row = table.insertRow();
        let taskCell = row.insertCell(0);
        taskCell.textContent = task;
        taskCell.contentEditable = "true";
        taskCell.onblur = function () {
            updateTaskTitle(task, taskCell.textContent);
        };
        let descriptionCell = row.insertCell(1);
        descriptionCell.textContent = data.description;
        descriptionCell.contentEditable = "true";
        descriptionCell.onblur = function () {
            updateTask(task, "description", descriptionCell.textContent);
        };
        let priorityCell = row.insertCell(2);
        priorityCell.textContent = data.priority;
        priorityCell.contentEditable = "true";
        priorityCell.onblur = function () {
            updateTask(task, "priority", priorityCell.textContent);
        };
        let checkboxCell = row.insertCell(3);
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = data.completed;
        checkbox.addEventListener("change", function () {
            data.completed = checkbox.checked;
            localStorage.setItem(task, JSON.stringify(data));
            filterTasks(filterType); 
        });
        checkboxCell.appendChild(checkbox);
        let deleteCell = row.insertCell(4);
        let deleteBtn = document.createElement("img");
        deleteBtn.src = "delete-img.png";
        deleteBtn.alt = "Delete";
        deleteBtn.classList.add("icon-button");
        deleteBtn.onclick = function () {
            deleteTask(task);
            filterTasks(filterType);
        };
        deleteCell.appendChild(deleteBtn);
    }
}

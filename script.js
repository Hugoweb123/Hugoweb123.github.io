document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("user-form");
    const taskPage = document.getElementById("tasks-page");
    const themeToggle = document.getElementById("theme-toggle");
    const userNameInput = document.getElementById("username");
    const colorInput = document.getElementById("color");
    const userNameDisplay = document.getElementById("user-name");
    const userInitialDisplay = document.getElementById("user-initial");
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const taskNameInput = document.getElementById("task-name");
    const taskDescriptionInput = document.getElementById("task-description");
    const taskDueDateInput = document.getElementById("task-due-date");
    const taskReminderInput = document.getElementById("task-reminder");
    const addReminderBtn = document.getElementById("add-reminder-btn");

    let userData = JSON.parse(localStorage.getItem("userData"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (userData) {
        showTasksPage();
    } else {
        userForm.style.display = "block";
        taskPage.style.display = "none";
    }

    userForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const userName = userNameInput.value;
        const favoriteColor = colorInput.value;

        userData = { name: userName, color: favoriteColor };
        localStorage.setItem("userData", JSON.stringify(userData));
        showTasksPage();
    });

    function showTasksPage() {
        userForm.style.display = "none";
        taskPage.style.display = "block";
        userNameDisplay.textContent = userData.name;
        userInitialDisplay.textContent = userData.name[0];
        userInitialDisplay.style.backgroundColor = userData.color;

        themeToggle.addEventListener("click", toggleTheme);

        loadTasks();
    }

    function loadTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span><strong>Materia:</strong> ${task.name}</span><br>
                <span><strong>Descripción:</strong> ${task.description}</span><br>
                <span><strong>Fecha de entrega:</strong> ${task.dueDate}</span><br>
                <span><strong>Recordatorio:</strong> ${task.reminder ? "Sí" : "No"}</span>
                <button class="edit-btn" onclick="editTask(${index})">Editar</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Eliminar</button>
                <button class="complete-btn" onclick="completeTask(${index})">Completada</button>
            `;
            if (task.completed) {
                li.classList.add("completed-task");
            }
            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const task = {
            name: taskNameInput.value,
            description: taskDescriptionInput.value,
            dueDate: taskDueDateInput.value,
            reminder: taskReminderInput.checked,
            completed: false
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
        taskForm.reset();
    });

    window.deleteTask = function (index) {
        const confirmDelete = confirm("¿Seguro de eliminar esta tarea?");
        if (confirmDelete) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        }
    };

    window.completeTask = function (index) {
        tasks[index].completed = true;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
        alert("¡Felicidades, continúa haciendo más tareas!");
    };

    window.editTask = function (index) {
        const task = tasks[index];
        taskNameInput.value = task.name;
        taskDescriptionInput.value = task.description;
        taskDueDateInput.value = task.dueDate;
        taskReminderInput.checked = task.reminder;

        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    };

    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
    }

    addReminderBtn.addEventListener("click", function() {
        const latestTask = tasks[tasks.length - 1];
        if (!latestTask) {
            alert("No hay tareas disponibles para añadir al calendario.");
            return;
        }

        const title = latestTask.name;
        const description = latestTask.description;
        const location = "En casa";
        const startDate = new Date(latestTask.dueDate);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duración de 1 hora

        const start = startDate.toISOString().replace(/[-:]|\.\d{3}/g, "");
        const end = endDate.toISOString().replace(/[-:]|\.\d{3}/g, "");

        const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

        window.open(googleCalendarUrl, "_blank");
    });

    window.redirectToCalendar = function () {
        window.location.href = "https://www.google.com/calendar";
    };
});

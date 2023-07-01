import { tokenKey, root } from "../config.js";
import { createTask, editTask } from "../services/tasks-service.js";
import { sortedList, filterList } from "../utils.js";
import DOMHandler from "../dom-handler.js";
import LoginPage from "./login-page.js";
import STORE from "../store.js";

// render - START
function renderHeader() {
  return `
    <header class="bg-gray-200 p-y-3 flex justify-center">
      <img src="/assets/images/doable-logo.png" alt="doable logo" />
      <img src="/assets/images/logout-logo.png" alt="logout logo" class="js-logout logout" />
    </header>
  `;
}

function renderTask(task) {
  return `
  <div class="flex align-baseline justify-between js-checkImportant" data-id="${
    task.id
  }">
    <div class="js-checkDone flex align-baseline gap-2" data-id="${task.id}">
      <input class="js-check checkbox__input" type="checkbox" id="${
        task.id
      }-checked" ${task.completed ? "checked" : ""}>
      <div class="${
        task.completed ? "opacity-50" : ""
      } flex-column gap-2 gray-400 js-task" data-id="${task.id}">
        <label for="${task.id}-checked" class="heading heading--xs">${
    task.title
  }</label>
        <p class="${
          task.completed ? "opacity-50" : ""
        } task-content gray-300">${
    task.due_date
      ? new Date(task.due_date).toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : ""
  }</p>
        </div>
    </div>
      <input class="${
        task.completed ? "opacity-50" : ""
      } js-important checkbox__input" type="checkbox" id="${
    task.id
  }-important" ${task.important ? "checked" : ""}>
  </div>
  `;
}

function render() {
  const tasks = STORE.tasks;

  return `
    ${renderHeader()}
    <main
      class="section-sm flex items-start justify-center wrap js-tasks-container"
      data-taskName="tasks"
    >
    <main class="flex-column flex">
      <div class="flex gap-8">
        <label class="container-sm">Sort</label>
        <select name="sort" id="sort" class="select select__input js-select">
          <option class="js-option" hidden ${
            STORE.sort === null ? "selected" : ""
          } disabled>Select one option</option>
          <option class="js-option" value="Alphabetical (a-z)" ${
            STORE.sort === "Alphabetical (a-z)" ? "selected" : ""
          }>Alphabetical (a-z)</option>
          <option class="js-option" value="Due date" ${
            STORE.sort === "Due date" ? "selected" : ""
          }>Due date</option>
          <option class="js-option" value="Importance" ${
            STORE.sort === "Importance" ? "selected" : ""
          }>Importance</option>
        </select>
      </div>
      <div class="p-y-3 flex gap-8">
        <div class="flex">
          <label class="container-sm">Show</label>
        </div>
        <div>
          <input class="js-pending checkbox__input" type="checkbox" name="pending" id="pending" ${
            STORE.filter.pending ? "checked" : ""
          }></input>
          <label for="pending" >Only pending</label>

          <input class="js-important checkbox__input" type="checkbox" name="important" id="important" ${
            STORE.filter.important ? "checked" : ""
          }></input>
          <label for="important">Only important</label>
        </div>
      </div>
    <section/>

    <section class="tasks">
      ${tasks.map(renderTask).join("")}
    </section>

      <div class="add-task" data-id="form">
        <form action="" class="task-form js-task-form">
          <input
            type="text" 
            class="card-form__input" 
            placeholder="do the dishes.." 
            id="title"
            name="title"
            require
          />
          <input 
            type="date" 
            class="card-form__input" 
            id="due_date"
            name="due_date"
          />
          <button 
            type="submit"
            class="button button--primary button--lg full-width"
          >
          Add Task
          </button>
        </form>
      </div>
    </main>
  `;
}
// render - END

// Listeners - START

function listenLogout() {
  const button = document.querySelector(".js-logout");

  button.addEventListener("click", (event) => {
    sessionStorage.removeItem(tokenKey);
    DOMHandler.load(LoginPage(), root);
  });
}

function listenSubmitForm() {
  const form = document.querySelector(".js-task-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { title, due_date } = event.target.elements;

    if (title.value.trim() === "") {
      return; // Return if the title input is empty or contains only whitespace
    }

    try {
      const task = await createTask({
        title: title.value,
        due_date: due_date.value,
      });
      STORE.addTask(task);

      DOMHandler.reload();
    } catch (error) {
      console.log(error);
    }
  });
}

function listenCheck() {
  const listChecked = document.querySelectorAll(".js-check");

  listChecked.forEach((task) => {
    task.addEventListener("change", async (event) => {
      const taskDone = event.target.closest(".js-checkDone");

      if (!taskDone) return;
      try {
        if (task.checked) {
          const updatedTask = await editTask(
            { completed: true },
            taskDone.dataset.id
          );
          STORE.updateTask(updatedTask);
          const filterTasks = filterList(STORE.grossFilterTasks);
          const sortedTasks = sortedList(filterTasks);
          STORE.setSortedTasks(sortedTasks);

          DOMHandler.reload();
        } else {
          const updatedTask = await editTask(
            { completed: false },
            taskDone.dataset.id
          );
          STORE.updateTask(updatedTask);
          const filterTasks = filterList(STORE.grossFilterTasks);
          const sortedTasks = sortedList(filterTasks);
          STORE.setSortedTasks(sortedTasks);

          DOMHandler.reload();
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function listenImportant() {
  const listImportant = document.querySelectorAll(".js-important");

  listImportant.forEach((task) => {
    task.addEventListener("change", async (event) => {
      const taskImportant = event.target.closest(".js-checkImportant");

      if (!taskImportant) return;
      try {
        if (task.checked) {
          const updatedTask = await editTask(
            { important: true },
            taskImportant.dataset.id
          );
          STORE.updateTask(updatedTask);
          const filterTasks = filterList(STORE.grossFilterTasks);
          const sortedTasks = sortedList(filterTasks);
          STORE.setSortedTasks(sortedTasks);

          DOMHandler.reload();
        } else {
          const updatedTask = await editTask(
            { important: false },
            taskImportant.dataset.id
          );
          STORE.updateTask(updatedTask);
          const filterTasks = filterList(STORE.grossFilterTasks);
          const sortedTasks = sortedList(filterTasks);
          STORE.setSortedTasks(sortedTasks);

          DOMHandler.reload();
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function listenOnlyPending() {
  const tasksOnlyPending = document.querySelector(".js-pending");

  tasksOnlyPending.addEventListener("change", function () {
    STORE.setFilter("pending");

    const filterTasks = filterList(STORE.grossFilterTasks);
    const sortedTasks = sortedList(filterTasks);
    STORE.setSortedTasks(sortedTasks);

    DOMHandler.reload();
  });
}

function listenOnlyImportant() {
  const tasksOnlyImportant = document.querySelector(".js-important");

  tasksOnlyImportant.addEventListener("change", function () {
    STORE.setFilter("important");

    const filterTasks = filterList(STORE.grossFilterTasks);
    const sortedTasks = sortedList(filterTasks);
    STORE.setSortedTasks(sortedTasks);

    DOMHandler.reload();
  });
}

function listenSort() {
  const taskSort = document.querySelector(".js-select");

  taskSort.addEventListener("change", (event) => {
    const selectedOption = event.target.value;
    STORE.setSort(selectedOption);

    const filterTasks = filterList(STORE.grossFilterTasks);
    const sortedTasks = sortedList(filterTasks);
    STORE.setSortedTasks(sortedTasks);

    DOMHandler.reload();
  });
}

// Listeners - END

function TaskPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenLogout();
      listenSubmitForm();
      listenCheck();
      listenImportant();
      listenOnlyPending();
      listenOnlyImportant();
      listenSort();
    },
    state: {
      errors: {},
    },
  };
}

export default TaskPage;

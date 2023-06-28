import { tokenKey, root } from "../config.js";
import { createTask, editTask } from "../services/tasks-service.js";
import DOMHandler from "../dom-handler.js";
import LoginPage from "./login-page.js";
import STORE from "../store.js";

// const sortByPos = (a, b) => a.pos - b.pos;
// const sortByID = (a, b) => a.id - b.id

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
  // const sortedCards = cards.sort(sortByPos);

  // <input type="checkbox" name="Task" id="${
  //   task.id
  // }"class="checkbox checkbox__input check" ${task.completed ? "checked" : ""} ></input>

  return `
  <div class="flex align-baseline justify-between">
    <div class="js-checkDone flex align-baseline gap-2" data-id="${task.id}">
      <input class="js-check" type="checkbox" id="${task.id}" ${
    task.completed ? "checked" : ""
  }>
      <div class="flex-column gap-2 js-task" data-id="${task.id}">
        <p for="${task.id}" class="heading heading--xs">${task.title}</p>
        <p class="task-content">${
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
      <input type="checkbox" id="${task.title}-important">
  </div>
  `;
}

function render() {
  const tasks = STORE.tasks;
  // const sortedTask = tasks.sort(sortByPos);

  return `
    ${renderHeader()}
    <main
      class="section-sm flex gap-8 items-start wrap js-tasks-container"
      data-taskName="tasks"
    >
    <main class="flex-column flex">
      <div class="flex gap-8">
        <label class="container-sm">Sort</label>
        <select name="sort" id="sort" class="select select__input">
          <option>Alphabetical (a-z)</option>
          <option>Due date</option>
          <option>Importance</option>
        </select>
      </div>
      <div class="p-y-3 flex gap-8">
        <div class="flex">
          <label class="container-sm">Show</label>
        </div>
        <div>
          <input type="checkbox" name="pending" id="pending"></input>
          <label for="pending">Only pending</label>

          <input type="checkbox" name="important" id="important"></input>
          <label for="important">Only important</label>
        </div>
      </div>
    <section/>

      ${tasks.map(renderTask).join("")}

      <div class="task" data-id="form">
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
      if (task.checked) {
        const updatedTask = await editTask({ completed: true }, task.id);
        // save it in STORE
      } else {
        const updatedTask = await editTask({ completed: false }, task.id);
        // save it in STORE
      }
    });
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
    },
    state: {
      errors: {},
    },
  };
}

export default TaskPage;

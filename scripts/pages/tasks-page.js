import { tokenKey, root } from "../config.js";
import { deleteTask, createTask } from "../services/tasks-service.js";
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

  return `
    <div class="task js-task" data-id="${task.id}">
      <div class="task__header">
        <h2 class="heading heading--xs">${task.title}</h2>
        <img src="/assets/icons/trash.svg" alt="trash" class="js-task-trash" />
      </div>
      <hr class="full-width m-0" />
      <div class="card-task js-task-container" data-taskName="${task.title}">
        
      </div>
      <form action="" class="card-form js-card-form" data-task-id="${task.id}">
        <input 
          type="text" 
          class="card-form__input" 
          placeholder="new card"
          required
          name="title"
          id="title"
        />
        <button 
          type="submit"
          class="button button--secondary button--sm button--only-icon"
        >
          <img
            src="/assets/icons/plus.svg"
            alt="mail icon"
            class="button__icon"
          />
        </button>
      </form>
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
    <section class="flex-column flex">
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
            require
          />
          <button 
            type="submit"
            class="button button--primary button--lg full-width"
          >
          Add Task
          </button>
        </form>
      </div>
    </section>
  `;
}
// render - END

// Taskeners - START

function listenLogout() {
  const button = document.querySelector(".js-logout");

  button.addEventListener("click", (event) => {
    sessionStorage.removeItem(tokenKey);
    DOMHandler.load(LoginPage(), root);
  });
}

function listenTaskTrash() {
  const taskTrashes = document.querySelectorAll(".js-task-trash");

  taskTrashes.forEach((taskTrash) => {
    taskTrash.addEventListener("click", async (event) => {
      const task = event.target.closest(".js-task");
      const taskId = +task.dataset.id;

      try {
        await deleteTask(taskId);
        STORE.deleteTask(taskId);

        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
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

// Listeners - END

function TaskPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenLogout();
      listenTaskTrash();
      listenSubmitForm();
    },
    state: {
      errors: {},
    },
  };
}

export default TaskPage;

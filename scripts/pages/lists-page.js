import { tokenKey, root } from "../config.js";
import { deleteList, createList } from "../services/lists-service.js";
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
    </header>
  `;
}

function renderList(list) {
  // const sortedCards = cards.sort(sortByPos);

  return `
    <div class="list js-list" data-id="${list.id}">
      <div class="list__header">
        <h2 class="heading heading--xs">${list.name}</h2>
        <img src="/assets/icons/trash.svg" alt="trash" class="js-list-trash" />
      </div>
      <hr class="full-width m-0" />
      <div class="card-list js-list-container" data-listName="${list.name}">
        
      </div>
      <form action="" class="card-form js-card-form" data-list-id="${list.id}">
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
  const lists = STORE.lists;
  // const sortedList = lists.sort(sortByPos);

  return `
    ${renderHeader()}
    <button class="button button--sm js-logout">Log out</button>
    <section
      class="section-sm flex gap-8 items-start wrap js-lists-container"
      data-listName="lists"
    >

      ${lists.map(renderList).join("")}

      <div class="list" data-id="form">
        <form action="" class="card-form js-list-form">
          <input 
            type="text" 
            class="card-form__input" 
            placeholder="new list" 
            id="name"
            name="name"
            require
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
    </section>
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

function listenListTrash() {
  const listTrashes = document.querySelectorAll(".js-list-trash");

  listTrashes.forEach((listTrash) => {
    listTrash.addEventListener("click", async (event) => {
      const list = event.target.closest(".js-list");
      const listId = +list.dataset.id;

      try {
        await deleteList(listId);
        STORE.deleteList(listId);

        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function listenSubmitForm() {
  const form = document.querySelector(".js-list-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { name } = event.target.elements;

    try {
      const list = await createList({ name: name.value });
      STORE.addList(list);

      DOMHandler.reload();
    } catch (error) {
      console.log(error);
    }
  });
}

// Listeners - END

function ListPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenLogout();
      listenListTrash();
      listenSubmitForm();
    },
    state: {
      errors: {},
    },
  };
}

export default ListPage;

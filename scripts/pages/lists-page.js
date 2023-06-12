import { tokenKey, root } from "../config.js";
import { createCard, deleteCard } from "../services/cards-service.js";
import { deleteList, createList } from "../services/lists-service.js";
import DOMHandler from "../dom-handler.js";
import LoginPage from "./login-page.js";
import STORE from "../store.js";

const sortByPos = (a, b) => a.pos - b.pos;
// const sortByID = (a, b) => a.id - b.id

// render - START
function renderHeader() {
  return `
    <header class="bg-gray-200 p-y-3 flex justify-center">
      <img src="/assets/images/doable-logo.png" alt="doable logo" />
    </header>
  `;
}

function renderCard(card) {
  return `
  <div class="card js-card" data-id="${card.id}">
    <p>${card.title}</p>
    <img src="/assets/icons/trash.svg" alt="trash" class="js-card-trash"/>
  </div>
  `;
}

function renderList(list) {
  const cards = list.cards;
  const sortedCards = cards.sort(sortByPos);

  return `
    <div class="list js-list" data-id="${list.id}">
      <div class="list__header">
        <h2 class="heading heading--xs">${list.name}</h2>
        <img src="/assets/icons/trash.svg" alt="trash" class="js-list-trash" />
      </div>
      <hr class="full-width m-0" />
      <div class="card-list js-list-container" data-listName="${list.name}">
        
        ${sortedCards.map(renderCard).join("")}
      
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
  const sortedList = lists.sort(sortByPos);

  return `
    ${renderHeader()}
    <button class="button button--sm js-logout">Log out</button>
    <section
      class="section-sm flex gap-8 items-start wrap js-lists-container"
      data-listName="lists"
    >

      ${sortedList.map(renderList).join("")}

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

function listenSubmitCard() {
  const cardForms = document.querySelectorAll(".js-card-form");

  cardForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { title } = event.target.elements;
      const listId = +event.target.dataset.listId;

      try {
        // Estamos guardando en la base de datos
        // y retornando el newCard
        const newCard = await createCard(listId, { title: title.value });
        // Almacenando en el STORE la nueva card guardada.
        STORE.addCard(listId, newCard);

        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function listenCardTrash() {
  const listDivs = document.querySelectorAll(".js-list");

  listDivs.forEach((list) => {
    list.addEventListener("click", async (event) => {
      const cardTrash = event.target.closest(".js-card-trash");

      if (!cardTrash) return;

      const card = cardTrash.closest(".js-card");
      const cardId = +card.dataset.id;
      const listId = +list.dataset.id;

      try {
        await deleteCard(listId, cardId);
        STORE.deleteCard(listId, cardId);

        DOMHandler.reload();
      } catch (error) {
        console.log(error);
      }
    });
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
      listenSubmitCard();
      listenCardTrash();
      listenListTrash();
      listenSubmitForm();
    },
    state: {
      errors: {},
    },
  };
}

export default ListPage;

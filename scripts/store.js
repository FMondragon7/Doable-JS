import { fromLocalStorage, saveLocalStorage } from "./utils.js";

const STORE = {
  currentPage: fromLocalStorage("current-page") || "login",
  user: null,
  lists: [],
  setUser(data) {
    this.user = data;
  },
  setCurrentPage(page) {
    saveLocalStorage("current-page", page);
    this.currentPage = page;
  },
  setLists(data) {
    this.lists = data;
  },
  addCard(listId, card) {
    const list = this.lists.find((list) => list.id === listId);
    list.cards.push(card);
  },
  deleteCard(listId, id) {
    const list = this.lists.find((list) => list.id === listId);
    const newCardList = list.cards.filter((card) => card.id !== id);

    list.cards = newCardList;
  },
  deleteList(id) {
    const newLists = this.lists.filter((list) => list.id !== id);
    this.lists = newLists;
  },
  addList(list) {
    this.lists.push(list);
  },
};

export default STORE;

import { fromLocalStorage, saveLocalStorage } from "./utils.js";

const STORE = {
  currentPage: fromLocalStorage("current-page") || "login",
  user: null,
  tasks: [],
  setUser(data) {
    this.user = data;
  },
  setCurrentPage(page) {
    saveLocalStorage("current-page", page);
    this.currentPage = page;
  },
  setTasks(data) {
    this.tasks = data;
  },
  deleteTask(id) {
    const newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = newTasks;
  },
  addTask(task) {
    this.tasks.push(task);
  },
};

export default STORE;

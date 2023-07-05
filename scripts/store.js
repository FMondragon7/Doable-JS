import { fromLocalStorage, saveLocalStorage } from "./utils.js";

const STORE = {
  currentPage: fromLocalStorage("current-page") || "login",
  user: null,
  grossFilterTasks: [],
  tasks: [],
  sort: null,
  filter: {
    pending: false,
    important: false,
  },
  setUser(data) {
    this.user = data;
  },
  setCurrentPage(page) {
    saveLocalStorage("current-page", page);
    this.currentPage = page;
  },
  setFilter(type) {
    this.filter[type] = !this.filter[type];
  },
  setSort(value) {
    this.sort = value;
  },
  setTasks(data) {
    this.grossFilterTasks = data;
  },
  setSortedTasks(data) {
    this.tasks = data;
  },
  deleteTask(id) {
    const newTasks = this.grossFilterTasks.filter((task) => task.id !== id);
    this.grossFilterTasks = newTasks;
  },
  addTask(task) {
    this.grossFilterTasks.push(task);
  },
  updateTask(updatedTask) {
    const index = this.grossFilterTasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (index === -1) return;

    const updatedArray = [
      ...this.grossFilterTasks.slice(0, index),
      updatedTask,
      ...this.grossFilterTasks.slice(index + 1),
    ];

    this.grossFilterTasks = updatedArray;
  },
};

export default STORE;

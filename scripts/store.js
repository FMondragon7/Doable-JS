import { fromLocalStorage, saveLocalStorage } from "./utils.js";

const STORE = {
  currentPage: fromLocalStorage("current-page") || "login",
  user: null,
  unfilterTasks: [],
  tasks: [],
  sort: "Alphabetical (a-z)",
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
    this.unfilterTasks = data;
  },
  setSortedTasks(data) {
    this.tasks = data;
  },
  deleteTask(id) {
    const newTasks = this.tasks.filter((task) => task.id !== id);
    this.unfilterTasks = newTasks;
  },
  addTask(task) {
    this.unfilterTasks.push(task);
  },
  updateTask(updatedTask) {
    const index = this.unfilterTasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (index === -1) return;

    const updatedArray = [
      ...this.unfilterTasks.slice(0, index),
      updatedTask,
      ...this.unfilterTasks.slice(index + 1),
    ];

    this.unfilterTasks = updatedArray;
  },
};

export default STORE;

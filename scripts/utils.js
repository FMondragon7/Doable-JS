import { appKey } from "./config.js";
import STORE from "./store.js";

export function fromLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(appKey)) || {};
  return data[key];
}

export function saveLocalStorage(key, value) {
  let data = JSON.parse(localStorage.getItem(appKey)) || {};
  data = { ...data, [key]: value };

  localStorage.setItem(appKey, JSON.stringify(data));
}

export function filterList(allTasks) {
  if (!STORE.filter.pending && !STORE.filter.important) return allTasks;

  const filterList = [];
  if (STORE.filter.pending && STORE.filter.important) {
    const pendingFilter = allTasks.filter((task) => task.pending === true);
    const importantFilter = pendingFilter.filter(
      (task) => task.important === true
    );
    filterList.push(importantFilter);
  }

  if (STORE.filter.pending) {
    const pendingFilter = allTasks.filter((task) => task.pending === true);
    filterList.push(pendingFilter);
  }

  if (STORE.filter.important) {
    const importantFilter = allTasks.filter((task) => task.important === true);
    filterList.push(importantFilter);
  }

  return filterList;
}

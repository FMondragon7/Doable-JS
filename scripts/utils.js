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

  if (STORE.filter.pending && STORE.filter.important) {
    const pendingFilter = allTasks.filter((task) => task.completed === false);
    const importantFilter = pendingFilter.filter(
      (task) => task.important === true
    );
    return importantFilter;
  }

  if (STORE.filter.pending) {
    const pendingFilter = allTasks.filter((task) => task.completed === false);
    return pendingFilter;
  }

  if (STORE.filter.important) {
    const importantFilter = allTasks.filter((task) => task.important === true);
    return importantFilter;
  }
}

export function sortedList(allTasks) {
  let sortedList;
  switch (STORE.sort) {
    case "Alphabetical (a-z)":
      sortedList = allTasks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Due date":
      sortedList = allTasks
        .sort((a, b) => {
          if (a.due_date === "" && b.due_date === "") {
            return 0; // No change in order for tasks without due date
          }
          if (a.due_date === "") {
            return 1; // a comes after b if a doesn't have a due date
          }
          if (b.due_date === "") {
            return -1; // a comes before b if b doesn't have a due date
          }

          const dateA = new Date(a.due_date);
          const dateB = new Date(b.due_date);

          if (dateA < dateB) {
            return -1; // a comes before b if a's due date is earlier than b's due date
          }
          if (dateA > dateB) {
            return 1; // a comes after b if a's due date is later than b's due date
          }
          return 0; // No change in order for tasks with the same due date
        })
        .sort((a, b) => {
          // Move tasks with due date to the top
          if (a.due_date !== "" && b.due_date === "") {
            return -1; // a comes before b if a has a due date and b doesn't
          }
          if (a.due_date === "" && b.due_date !== "") {
            return 1; // a comes after b if b has a due date and a doesn't
          }
          return 0; // No change in order for tasks with the same due date status
        });
      break;
    case "Importance":
      sortedList = allTasks.sort((a, b) => {
        if (a.important && !b.important) {
          return -1;
        }
        if (!a.important && b.important) {
          return 1;
        }
        return 0;
      });
      break;
    default:
      break;
  }

  return sortedList;
}

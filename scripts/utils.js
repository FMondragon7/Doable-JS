import { appKey } from "./config.js";

export function fromLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(appKey)) || {};
  return data[key];
}

export function saveLocalStorage(key, value) {
  let data = JSON.parse(localStorage.getItem(appKey)) || {};
  data = { ...data, [key]: value };

  localStorage.setItem(appKey, JSON.stringify(data));
}

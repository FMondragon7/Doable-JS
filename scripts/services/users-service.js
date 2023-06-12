import { tokenKey } from "../config.js";

export function createUser({ username, password } = {}) {
  return new Promise((resolve, reject) => {
    const errors = {};
    if (!username) errors.username = "can't be blank";
    if (!password) errors.password = "can't be blank";

    if (Object.keys(errors).length > 0) {
      reject(new Error(JSON.stringify(errors)));
    } else {
      resolve({
        username,
        email: "testino@mail.com",
        token: "super_secret_token_1234",
      });
    }
  });
}

export function getUser() {
  const token = sessionStorage.getItem(tokenKey);

  if (!token) {
    return Promise.reject("Unauthorized");
  }

  if (token !== "super_secret_token_1234") {
    return Promise.reject("Unauthorized");
  }

  return Promise.resolve({
    username: "testino",
    email: "testino@mail.com",
    token: "super_secret_token_1234",
  });
}

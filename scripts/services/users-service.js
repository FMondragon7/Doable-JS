import { tokenKey, base_uri } from "../config.js";

export async function createUser(credentials) {
  const response = await fetch(`${base_uri}/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return data;
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

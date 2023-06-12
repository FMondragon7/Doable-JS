import { base_uri } from "../config.js";

export async function login(credentials) {
  const response = await fetch(`${base_uri}/login`, {
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

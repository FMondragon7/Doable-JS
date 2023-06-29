import { tokenKey, base_uri } from "../config.js";

const tasksKey = "trackable_task";

export async function getTasks() {
  const token = sessionStorage.getItem(tokenKey);

  const response = await fetch(`${base_uri}/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Token token=${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const data = await response.json();

  return data;
}

export async function createTask({ title, due_date }) {
  const token = sessionStorage.getItem(tokenKey);

  const response = await fetch(`${base_uri}/tasks`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token token=${token}`,
    },
    body: JSON.stringify({
      title: title,
      due_date: due_date,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const data = await response.json();

  return data;
}

export async function editTask(updatedData, id) {
  const token = sessionStorage.getItem(tokenKey);

  const response = await fetch(`${base_uri}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Token token=${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  const data = await response.json();

  return data;
}

export function getMaxPos(data) {
  // Math.max(...data.map(elemento => elemento.pos))
  // retorna un solo valor

  // Reduzca a un solo valor.
  return data.reduce(
    // acc => prev = -1
    // current.pos = 1 => prev < current.post
    // => prev = 1

    // prev = 1
    // current.pos = 0 => prev < current.post
    // prev = 1
    (prev, current) => (prev < current.pos ? current.pos : prev),
    -1
  );

  // return 1
}

export function save(data) {
  localStorage.setItem(tasksKey, JSON.stringify(data));
}

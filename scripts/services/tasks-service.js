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
  console.log(due_date);
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

  if (!title)
    return Promise.reject(
      new Error(JSON.stringify({ title: "can't be blank" }))
    );

  const data = await response.json();

  return data;
}

export async function deleteTask(id) {
  const tasks = await getTasks();

  const newTasks = tasks.filter((task) => task.id !== id);
  save(newTasks);

  return Promise.resolve(null);
}

// idsInOrder
// [123,234,356]
// [123,356,234]
// [356,234,123]

// [{pos: 0}, {pos: 1}, {pos: 2} ]
export async function updateTasksOrder(idsInOrder) {
  const tasks = await getTasks();

  const newTasks = idsInOrder.map((id, index) => {
    const task = tasks.find((task) => task.id === id);
    task.pos = index;

    return task;
  });

  save(newTasks);
  return Promise.resolve(newTasks);
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

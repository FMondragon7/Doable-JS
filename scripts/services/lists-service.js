import { tokenKey, base_uri } from "../config.js";

const listsKey = "trackable_list";

export async function getLists() {
  const token = sessionStorage.getItem(tokenKey);

  const response = await fetch(`${base_uri}/tasks`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
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

export async function createList({ name }) {
  const lists = await getLists();

  if (!name)
    return Promise.reject(
      new Error(JSON.stringify({ name: "can't be blank" }))
    );

  const newList = {
    id: Date.now(),
    name,
    pos: getMaxPos(lists) + 1,
    cards: [],
  };

  lists.push(newList);
  save(lists);

  return Promise.resolve(newList);
}

export async function deleteList(id) {
  const lists = await getLists();

  const newLists = lists.filter((list) => list.id !== id);
  save(newLists);

  return Promise.resolve(null);
}

// idsInOrder
// [123,234,356]
// [123,356,234]
// [356,234,123]

// [{pos: 0}, {pos: 1}, {pos: 2} ]
export async function updateListsOrder(idsInOrder) {
  const lists = await getLists();

  const newLists = idsInOrder.map((id, index) => {
    const list = lists.find((list) => list.id === id);
    list.pos = index;

    return list;
  });

  save(newLists);
  return Promise.resolve(newLists);
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
  localStorage.setItem(listsKey, JSON.stringify(data));
}

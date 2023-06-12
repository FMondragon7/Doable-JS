import { tokenKey } from "../config.js";

const initialData = [
  {
    id: 1646205111298,
    name: "First list",
    pos: 1,
    cards: [
      { id: 1646205111299, title: "Note 1.1", pos: 1 },
      { id: 1646205111300, title: "Note 1.2", pos: 0 },
      { id: 1646205111301, title: "Note 1.3", pos: 2 },
    ],
  },
  {
    id: 1646205111302,
    name: "Second list",
    pos: 0,
    cards: [
      { id: 1646205111303, title: "Note 2.1", pos: 2 },
      { id: 1646205111304, title: "Note 2.2", pos: 0 },
      { id: 1646205111305, title: "Note 2.3", pos: 1 },
    ],
  },
];

const listsKey = "trackable_list";

export async function getLists() {
  const token = sessionStorage.getItem(tokenKey);

  if (!token) return Promise.reject(new Error("Access denied"));

  let data = JSON.parse(localStorage.getItem(listsKey));

  if (!data) localStorage.setItem(listsKey, JSON.stringify(initialData));

  return Promise.resolve(data || initialData);
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

import { getLists, save, getMaxPos } from "./lists-service.js";

export async function createCard(listId, { title }) {
  const lists = await getLists();
  const list = lists.find((list) => list.id === listId);

  if (!title)
    return Promise.reject(
      new Error(JSON.stringify({ title: "can't be blank" }))
    );

  const newCard = {
    id: Date.now(),
    title,
    pos: getMaxPos(list.cards) + 1,
  };

  list.cards.push(newCard);
  save(lists);

  return Promise.resolve(newCard);
}

export async function deleteCard(listId, id) {
  const lists = await getLists();
  const list = lists.find((list) => list.id === listId);

  const newCards = list.cards.filter((card) => card.id !== id);
  list.cards = newCards;
  save(lists);
  return Promise.resolve(null);
}

export async function updateCardsOrder(listId, idsInOrder) {
  const lists = await getLists();
  const list = lists.find((list) => list.id === listId);

  const newCards = idsInOrder.map((id, index) => {
    const card = list.cards.find((card) => card.id === id);
    card.pos = index;
    return card;
  });

  list.cards = newCards;
  save(lists);
  return Promise.resolve(lists);
}

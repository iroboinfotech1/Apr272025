interface Item {
  id: number;
  name: string;
  category: string;
  buildings: string[];
  spaces: string[];
  schedule: string[];
  image: string;
}

let items: Item[] = [
  { id: 1, name: 'Coffee', category: 'Catering', buildings: ['Vertex Tower', 'Summit Plaza', 'Astra Heights'], spaces: ['Room', 'Desk'], schedule: ['All Day'], image: 'coffee-icon' },
  { id: 2, name: 'Projector', category: 'IT Services', buildings: ['Astra Heights'], spaces: ['Room'], schedule: ['All Day'], image: 'projector-icon' },
];

export const fetchItems = async (): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...items]);
    }, 500);
  });
};

export const addItem = async (item: Item): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      items.push(item);
      resolve();
    }, 500);
  });
};

export const updateItem = async (updatedItem: Item): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = items.findIndex((i) => i.id === updatedItem.id);
      if (index !== -1) {
        items[index] = updatedItem;
        resolve();
      } else {
        reject(new Error('Item not found'));
      }
    }, 500);
  });
};

export const deleteItem = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      items = items.filter((i) => i.id !== id);
      resolve();
    }, 500);
  });
}; 
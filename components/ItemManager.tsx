import React, { useEffect, useState } from 'react';
import { addItem, deleteItem, fetchItems, updateItem } from '../services/itemService';

interface Item {
  id: number;
  name: string;
  category: string;
  buildings: string[];
  spaces: string[];
  schedule: string[];
  image: string;
}

const ItemManager: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Partial<Item>>({});
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [originalItems, setOriginalItems] = useState<{ [key: number]: Item }>({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
    const initialEditMode = data.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {} as { [key: number]: boolean });
    setEditMode(initialEditMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id?: number) => {
    const { name, value } = e.target;
    if (id) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
      );
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = async () => {
    const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    await addItem({ id: newId, ...newItem } as Item);
    setNewItem({});
    loadItems();
  };

  const handleEditClick = (item: Item) => {
    setEditMode({ ...editMode, [item.id]: true });
    setOriginalItems({ ...originalItems, [item.id]: { ...item } });
  };

  const handleSaveClick = async (item: Item) => {
    await updateItem(item);
    setEditMode({ ...editMode, [item.id]: false });
    loadItems();
  };

  const handleCancelClick = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? originalItems[id] : item))
    );
    setEditMode({ ...editMode, [id]: false });
  };

  const handleDeleteItem = async (id: number) => {
    await deleteItem(id);
    loadItems();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Items</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Item Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Building</th>
            <th className="py-2 px-4 border-b">Item Image</th>
            <th className="py-2 px-4 border-b">Spaces</th>
            <th className="py-2 px-4 border-b">Schedule</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="name"
                value={newItem.name || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <select
                name="category"
                value={newItem.category || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              >
                <option value="">Select</option>
                <option value="Catering">Catering</option>
                <option value="IT Services">IT Services</option>
              </select>
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="buildings"
                value={newItem.buildings?.join(', ') || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="image"
                value={newItem.image || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="spaces"
                value={newItem.spaces?.join(', ') || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="schedule"
                value={newItem.schedule?.join(', ') || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={handleAddItem}
              >
                Add
              </button>
            </td>
          </tr>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  name="category"
                  value={item.category}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                >
                  <option value="Catering">Catering</option>
                  <option value="IT Services">IT Services</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="buildings"
                  value={item.buildings.join(', ')}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="image"
                  value={item.image}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="spaces"
                  value={item.spaces.join(', ')}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="schedule"
                  value={item.schedule.join(', ')}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[item.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                {editMode[item.id] ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleSaveClick(item)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      onClick={() => handleCancelClick(item.id)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemManager; 
import React, { useEffect, useState } from 'react';
import { addSchedule, deleteSchedule, fetchSchedules, updateSchedule } from '../services/scheduleService';

interface Schedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

const ScheduleManager: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({});
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [originalSchedules, setOriginalSchedules] = useState<{ [key: number]: Schedule }>({});

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const data = await fetchSchedules();
    setSchedules(data);
    const initialEditMode = data.reduce((acc, schedule) => {
      acc[schedule.id] = false;
      return acc;
    }, {} as { [key: number]: boolean });
    setEditMode(initialEditMode);
  };

  const formatTimeInput = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 2) {
      return cleaned;
    }
    const hours = cleaned.slice(0, 2);
    const minutes = cleaned.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const { name, value } = e.target;
    const formattedValue = 
    false ? formatTimeInput(value) : value;
    if (id) {
      setSchedules((prev) =>
        prev.map((schedule) => (schedule.id === id ? { ...schedule, [name]: formattedValue } : schedule))
      );
    } else {
      setNewSchedule((prev) => ({ ...prev, [name]: formattedValue }));
    }
  };

  const handleAddSchedule = async () => {
    if (validateSchedule(newSchedule)) {
      const newId = schedules.length ? Math.max(...schedules.map((s) => s.id)) + 1 : 1;
      await addSchedule({ id: newId, ...newSchedule } as Schedule);
      setNewSchedule({});
      loadSchedules();
    }
  };

  const handleEditClick = (schedule: Schedule) => {
    setEditMode({ ...editMode, [schedule.id]: true });
    setOriginalSchedules({ ...originalSchedules, [schedule.id]: { ...schedule } });
  };

  const handleSaveClick = async (schedule: Schedule) => {
    if (validateSchedule(schedule)) {
      await updateSchedule(schedule);
      setEditMode({ ...editMode, [schedule.id]: false });
      loadSchedules();
    }
  };

  const handleCancelClick = (id: number) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === id ? originalSchedules[id] : schedule))
    );
    setEditMode({ ...editMode, [id]: false });
  };

  const handleDeleteSchedule = async (id: number) => {
    await deleteSchedule(id);
    loadSchedules();
  };

  const validateSchedule = (schedule: Partial<Schedule>): boolean => {
    if (!schedule.name || !schedule.startTime || !schedule.endTime) {
      alert('All fields are required');
      return false;
    }
    if (!isValidTime(schedule.startTime) || !isValidTime(schedule.endTime)) {
      alert('Invalid time format');
      return false;
    }
    if (schedule.startTime >= schedule.endTime) {
      alert('End time must be later than start time');
      return false;
    }
    return true;
  };

  const isValidTime = (time: string): boolean => {
    const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(time);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order will be received at these times</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Item Name</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="name"
                value={newSchedule.name || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="startTime"
                value={newSchedule.startTime || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                name="endTime"
                value={newSchedule.endTime || ''}
                onChange={(e) => handleInputChange(e)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <button
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={handleAddSchedule}
              >
                Add
              </button>
            </td>
          </tr>
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="name"
                  value={schedule.name}
                  onChange={(e) => handleInputChange(e, schedule.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[schedule.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="startTime"
                  value={schedule.startTime}
                  onChange={(e) => handleInputChange(e, schedule.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[schedule.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  name="endTime"
                  value={schedule.endTime}
                  onChange={(e) => handleInputChange(e, schedule.id)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  disabled={!editMode[schedule.id]}
                />
              </td>
              <td className="py-2 px-4 border-b">
                {editMode[schedule.id] ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleSaveClick(schedule)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      onClick={() => handleCancelClick(schedule.id)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
                      onClick={() => handleEditClick(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteSchedule(schedule.id)}
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

export default ScheduleManager; 
interface Schedule {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

let schedules: Schedule[] = [
  { id: 1, name: 'Breakfast', startTime: '07:00', endTime: '10:30' },
  { id: 2, name: 'Brunch', startTime: '10:30', endTime: '12:00' },
  { id: 3, name: 'Lunch', startTime: '12:00', endTime: '14:00' },
  { id: 4, name: 'All Day', startTime: '07:00', endTime: '22:30' },
  { id: 5, name: 'Dinner', startTime: '19:00', endTime: '22:30' },
];

export const fetchSchedules = async (): Promise<Schedule[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...schedules]);
    }, 500);
  });
};

export const addSchedule = async (schedule: Schedule): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      schedules.push(schedule);
      resolve();
    }, 500);
  });
};

export const updateSchedule = async (updatedSchedule: Schedule): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = schedules.findIndex((s) => s.id === updatedSchedule.id);
      if (index !== -1) {
        schedules[index] = updatedSchedule;
        resolve();
      } else {
        reject(new Error('Schedule not found'));
      }
    }, 500);
  });
};

export const deleteSchedule = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      schedules = schedules.filter((s) => s.id !== id);
      resolve();
    }, 500);
  });
}; 
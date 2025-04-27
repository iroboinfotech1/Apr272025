export interface Meeting {
    id: number;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    items: {
      kitchen: { item: string; quantity: number; notes: string }[];
      itServices: { item: string; quantity: number; notes: string }[];
    };
    notes: string;
    category: string;
  }

let meetings: Meeting[] = [
  {
    id: 1,
    name: 'Annual General Body Meeting',
    date: '17/02/2025',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Einstein Room',
    items: {
      kitchen: [
        { item: 'Coffee', quantity: 2, notes: 'No Sugar' },
        { item: 'Sandwich', quantity: 2, notes: 'Vegetarian' },
      ],
      itServices: [
        { item: 'Projector', quantity: 1, notes: 'HDMI required' },
      ],
    },
    notes: '1 x Black Coffee No Sugar, 1 x Milk Coffee',
    category: 'Catering',
  },
  {
    id: 2,
    name: 'Product Design Review',
    date: '17/02/2025',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Madras Room',
    items: {
      kitchen: [
        { item: 'Tea', quantity: 2, notes: 'With Milk' },
      ],
      itServices: [
        { item: 'Microphone', quantity: 1, notes: 'Wireless' },
      ],
    },
    notes: '1 x Black Coffee No Sugar, 1 x Milk Coffee',
    category: 'IT Services',
  },
];

export const fetchMeetings = async (): Promise<Meeting[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...meetings]);
    }, 500);
  });
}; 
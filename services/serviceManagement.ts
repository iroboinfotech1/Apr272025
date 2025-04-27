interface Building {
  name: string;
  email: string;
}

interface CategoryData {
  [key: string]: Building[];
}

const mockData: CategoryData = {
  Catering: [
    { name: 'Vertex Tower', email: 'catering@asd.com' },
    { name: 'Astra Heights', email: 'astracatering@asd.com' },
    { name: 'Summit Plaza', email: 'cateringsummit@asd.com' },
  ],
  'IT Services': [
    { name: 'Vertex Tower', email: 'itvertex@asd.com' },
    { name: 'Astra Heights', email: 'itastra@asd.com' },
    { name: 'Summit Plaza', email: 'itsummit@asd.com' },
  ],
};

export const fetchCategories = async (): Promise<CategoryData> => {
  // Simulate a network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
};

export const updateEmail = async (category: string, buildingName: string, email: string): Promise<void> => {
  // Simulate a network delay and update
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categoryData = mockData[category];
      const building = categoryData.find((b) => b.name === buildingName);
      if (building) {
        building.email = email;
        resolve();
      } else {
        reject(new Error('Building not found'));
      }
    }, 500);
  });
}; 
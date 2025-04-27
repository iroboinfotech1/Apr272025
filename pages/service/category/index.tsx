import React, { useEffect, useState } from 'react';
import { fetchCategories, updateEmail } from '../../../services/serviceManagement';

import Layout from '../../../components/Layout';
import ServiceCategory from '../../../components/ServiceCategory';

const IndexPage: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({
    Catering: [],
    'IT Services': [],
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleUpdateEmail = async (category: string, buildingName: string, email: string) => {
    try {
      await updateEmail(category, buildingName, email);
      setCategories((prevCategories) => ({
        ...prevCategories,
        [category]: prevCategories[category].map((building) =>
          building.name === buildingName ? { ...building, email } : building
        ),
      }));
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Service Categories</h2>
      {Object.keys(categories).map((category) => (
        <ServiceCategory
          key={category}
          categoryName={category}
          buildings={categories[category]}
          onUpdateEmail={(buildingName, email) => handleUpdateEmail(category, buildingName, email)}
        />
      ))}
    </Layout>
  );
};

export default IndexPage;
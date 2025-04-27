import React, { useEffect, useState } from 'react';

interface Building {
  name: string;
  email: string;
}

interface CategoryProps {
  categoryName: string;
  buildings: Building[];
  onUpdateEmail: (buildingName: string, email: string) => void;
}

const ServiceCategory: React.FC<CategoryProps> = ({ categoryName, buildings, onUpdateEmail }) => {
  const [emails, setEmails] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [originalEmails, setOriginalEmails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialEmails = buildings.reduce((acc, building) => {
      acc[building.name] = building.email;
      return acc;
    }, {} as { [key: string]: string });
    setEmails(initialEmails);
    setOriginalEmails(initialEmails);

    const initialEditMode = buildings.reduce((acc, building) => {
      acc[building.name] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    setEditMode(initialEditMode);
  }, [buildings]);

  const handleEmailChange = (buildingName: string, email: string) => {
    setEmails({ ...emails, [buildingName]: email });
  };

  const handleEditClick = (buildingName: string) => {
    setEditMode({ ...editMode, [buildingName]: true });
  };

  const handleSaveClick = (buildingName: string) => {
    const email = emails[buildingName];
    if (validateEmail(email)) {
      onUpdateEmail(buildingName, email);
      setEditMode({ ...editMode, [buildingName]: false });
      setOriginalEmails({ ...originalEmails, [buildingName]: email });
      console.log(`Saving email for ${buildingName}: ${email}`);
    } else {
      alert('Invalid email format');
    }
  };

  const handleCancelClick = (buildingName: string) => {
    setEmails({ ...emails, [buildingName]: originalEmails[buildingName] });
    setEditMode({ ...editMode, [buildingName]: false });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
      {buildings.length === 0 ? (
        <p className="text-red-500">Please add building(s) under space management to configure categories</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Building</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building.name} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{building.name}</td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="email"
                    className={`border border-gray-300 rounded px-2 py-1 w-full ${
                      editMode[building.name] ? 'bg-white' : 'bg-gray-100'
                    }`}
                    value={emails[building.name]}
                    onChange={(e) => handleEmailChange(building.name, e.target.value)}
                    disabled={!editMode[building.name]}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  {editMode[building.name] ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                        onClick={() => handleSaveClick(building.name)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                        onClick={() => handleCancelClick(building.name)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(building.name)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceCategory; 
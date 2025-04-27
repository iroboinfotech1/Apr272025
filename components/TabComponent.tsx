import React, { useState } from 'react';

interface TabComponentProps {
  tabs: string[];
  onSelect: (tab: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, onSelect }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onSelect(tab);
  };

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabComponent; 
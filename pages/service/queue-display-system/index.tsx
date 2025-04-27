import React, { useState } from 'react';

import Layout from '../../../components/Layout';
import QueueDisplay from '../../../components/QueueDisplay';
import TabComponent from '../../../components/TabComponent';

const IndexPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Kitchen');

  return (
    <Layout>
      <TabComponent
        tabs={['Kitchen', 'IT Services', 'Meeting Summary']}
        onSelect={setSelectedTab}
      />
      <div className="mt-4">
        {selectedTab === 'Kitchen' && <QueueDisplay type="Kitchen" />}
        {selectedTab === 'IT Services' && <QueueDisplay type="IT Services" />}
        {selectedTab === 'Meeting Summary' && <QueueDisplay type="Meeting Summary" />}
      </div>
    </Layout>
  );
};

export default IndexPage;
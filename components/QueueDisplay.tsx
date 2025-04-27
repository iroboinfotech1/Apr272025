import React, { useEffect, useState } from 'react';

import { fetchMeetings, Meeting } from '../services/meetingService';

const QueueDisplay: React.FC<{ type: string }> = ({ type }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const data = await fetchMeetings();
    setMeetings(data);
  };

  const filteredMeetings = meetings.filter((meeting) => {
    if (type === 'Kitchen') {
      return meeting.items.kitchen.length > 0;
    }
    if (type === 'IT Services') {
      return meeting.items.itServices.length > 0;
    }
    return true;
  });

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuilding(e.target.value);
  };

  const handleRowClick = (meeting: Meeting) => {
    // Display floor plan logic here
    console.log(`Display floor plan for ${meeting.location}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Services Queue - {type}</h2>
      <select onChange={handleBuildingChange} className="mb-4 border border-gray-300 rounded px-2 py-1">
        <option value="">Select Building</option>
        <option value="Einstein Room">Einstein Room</option>
        <option value="Madras Room">Madras Room</option>
      </select>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Meeting</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">StartTime</th>
            <th className="py-2 px-4 border-b">EndTime</th>
            <th className="py-2 px-4 border-b">Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeetings.map((meeting) => (
            <tr key={meeting.id} className="hover:bg-gray-100" onClick={() => handleRowClick(meeting)}>
              <td className="py-2 px-4 border-b">
                {meeting.name}
                <div className="text-sm text-gray-500">
                  {type === 'Kitchen' && (
                    <>
                      Items: {meeting.items.kitchen.map(item => `${item.item} x ${item.quantity}`).join(', ')}
                      <br />
                      Notes: {meeting.items.kitchen.map(item => item.notes).join(', ')}
                    </>
                  )}
                  {type === 'IT Services' && (
                    <>
                      Items: {meeting.items.itServices.map(item => `${item.item} x ${item.quantity}`).join(', ')}
                      <br />
                      Notes: {meeting.items.itServices.map(item => item.notes).join(', ')}
                    </>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 border-b">{meeting.date}</td>
              <td className="py-2 px-4 border-b">{meeting.startTime}</td>
              <td className="py-2 px-4 border-b">{meeting.endTime}</td>
              <td className="py-2 px-4 border-b">{meeting.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueDisplay; 
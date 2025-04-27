import React, { useEffect, useState } from "react";
import UpcomingMeetingCard from "../common/UpcomingMeetingCard";
import { IBookedMeetingAndDesk } from "../../pages/bookSpaces/types/bookSpace";
import dayjs from "dayjs";

export interface IMeetings {
  bookedMeetingDetails: IBookedMeetingAndDesk[];
}

const UpcomingMeetings = (props: IMeetings) => {
  const { bookedMeetingDetails } = props;
  const [upcomingMeetings, setUpCommingMeetings] = useState<
    IBookedMeetingAndDesk[]
  >([]);
  useEffect(() => {
    const upcomingMeetings = bookedMeetingDetails.filter(
      (meeting: IBookedMeetingAndDesk) =>
        dayjs(meeting.startDate).diff(dayjs(), "minutes") > 0
    );
    setUpCommingMeetings(upcomingMeetings);
  }, [bookedMeetingDetails]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>Upcoming Meetings</span>
        <button
          className="btn btn-primary rounded-[20px] text-sm
        "
        >
          View All
        </button>
      </div>
      {upcomingMeetings && upcomingMeetings.length > 0 && (
        <div className="grid grid-cols-2 gap-6 mt-4">
          {upcomingMeetings.map((upcomingMeeting, i) => (
            <UpcomingMeetingCard meeting={upcomingMeeting} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;

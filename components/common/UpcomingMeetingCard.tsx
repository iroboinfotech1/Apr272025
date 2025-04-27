import { Card } from "@mui/material";
import React from "react";
import Avatar from "./Avatar";
import {
  IBookedMeetingAndDesk,
  IBookedSpaceResource,
} from "../../pages/bookSpaces/types/bookSpace";
import dayjs from "dayjs";
import { spaceResourceConfig } from "../../src/constants/spaceManagement/config";
import Participanticon from "/assets/icons/dashboard card icons/partipanticon.svg";
import Calendaricon from "/assets/icons/dashboard card icons/calendaricon.svg";
import Clock from "/assets/icons/dashboard card icons/clock.svg";

export interface IMeeting {
  meeting: IBookedMeetingAndDesk;
}

const UpcomingMeetingCard = (props: IMeeting) => {
  const { meeting: upcomingMeeting } = props;
  return (
    <Card className="min-h-[195px] border shadow w-full flex justify-center flex-col p-4 gap-2">
      <div className="min-h-[35px]">
        <h4>
          {upcomingMeeting && upcomingMeeting.meetingName
            ? upcomingMeeting.meetingName
            : "Desk "}
        </h4>
        <p></p>
      </div>
      <div className="mb-2 text-xs" style={{ fontSize: "0.8rem" }}>
      <div className="flex items-center space-x-1">
        <Calendaricon />
        <span className="pb-2 leading-none">{dayjs(upcomingMeeting.startDate).format("MMM DD, YYYY")}</span>
       </div>
       <br/>
       <div className="flex items-center space-x-1">
        <Clock />
        <span className="pb-2 leading-none">
          {`${dayjs(upcomingMeeting.startDate).format("hh:mm A")} - ${dayjs(
            upcomingMeeting.endDate
          ).format("hh:mm A")}`}
        </span>
      </div>
      </div>
      <div>
        <Avatar />
      </div>
      <span className="flex gap-2 mt-2">
        {spaceResourceConfig
          .filter((spaceResource) => {
            return upcomingMeeting?.spaceResources?.some(
              (meetingSpaceResource: IBookedSpaceResource) =>
                meetingSpaceResource.resourceId === spaceResource.resourceId
            );
          })
          .map((spaceResource, index: number) => (
            <div key={index}>{spaceResource.resourceIcon}</div>
          ))}
      </span>
    </Card>
  );
};

export default UpcomingMeetingCard;

import React from "react";
import Participanticon from "/assets/icons/dashboard card icons/partipanticon.svg";
import Calendaricon from "/assets/icons/dashboard card icons/calendaricon.svg";
import { AcUnit, Group, Tv } from "@mui/icons-material";
import Clock from "/assets/icons/dashboard card icons/clock.svg";
import Image from "next/image";
import {
  IBookedMeetingAndDesk,
  IBookedSpaceResource,
} from "../types/bookSpace";
import dayjs from "dayjs";
import { spaceResourceConfig } from "../../../src/constants/spaceManagement/config";
import cardImage from '../../../assets/images/cardImage.jpeg';


interface IMyBookingCardProps {
  meeting: IBookedMeetingAndDesk;
}

function MyBookingCard(props: IMyBookingCardProps) {
  const { meeting } = props;

  return (
    <div className="border p-3 shadow-md flex flex-col w-[505px]">
      <div className="flex gap-2">
        <div>
          <Image
            height={"95"}
            width={"85"}
            src={meeting!=null && meeting.spaceImage !=null ? meeting.spaceImage :cardImage}
            alt="Booking image"
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-md font-bold text-gray-500">
            {meeting ? meeting.meetingName : ""}
          </span>
          <span className="text-sm font-light text-gray-500 flex gap-3 items-center justify-start">
            {meeting ? meeting.spaceName : ""}
             <Participanticon style={{ size: "20px" }} /> {meeting ? meeting.resourceCount : ""}
          </span>
          <span className="flex gap-4">
            <span className="flex gap-1 text-xs font-light text-gray-500 items-center justify-start">
             <Calendaricon />
              {meeting ? dayjs(meeting.startDate).format("MMM DD, YYYY") : ""} </span>
            <span className="flex gap-1 text-xs font-light text-gray-500 items-center justify-start pb-0.5 leading-none">
             <Clock />
              {meeting ? dayjs(meeting.startDate).format("hh:mm A") : ""} -{" "}
              {meeting ? dayjs(meeting.endDate).format("hh:mm A") : ""}
            </span>
          </span>
          <span className="flex gap-2 mt-2">
            {spaceResourceConfig
              .filter((spaceResource) => {
                return (
                  meeting &&
                  meeting.spaceResources?.some(
                    (meetingSpaceResource: IBookedSpaceResource) =>
                      meetingSpaceResource.resourceId ===
                      spaceResource.resourceId
                  )
                );
              })
              .map((spaceResource, index: number) => (
                <div key={index}>{spaceResource.resourceIcon}</div>
              ))}
          </span>
        </div>
      </div>
      <div className="text-xs font-light text-gray-500">#BRID02102</div>
    </div>
  );
}

export default MyBookingCard;

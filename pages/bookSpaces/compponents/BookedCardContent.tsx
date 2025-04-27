import { Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import {
  IBookedMeetingAndDesk,
  IBookedSpaceResource,
} from "../types/bookSpace";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import Participanticon from "/assets/icons/dashboard card icons/partipanticon.svg";
import Calendaricon from "/assets/icons/dashboard card icons/calendaricon.svg";
import Clock from "/assets/icons/dashboard card icons/clock.svg";
import { spaceResourceConfig } from "../../../src/constants/spaceManagement/config";
import cardImage from '../../../assets/images/cardImage.jpeg';

export interface IBookRoomCardContent {
  bookingDetails: IBookedMeetingAndDesk;
}
const BookedCardContent = (props: IBookRoomCardContent) => {
  const { bookingDetails } = props;
 
  return (
    <div className="text-sm mt-4 px-2 md:px-2">
      <Card className="rounded-md">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="float-left p-3.5">
              <Image
                src={ bookingDetails?.spaceImage ? bookingDetails?.spaceImage : cardImage }
                alt=""
                className="rounded-md outline outline-1 ring-blue-500"
                width="100"
                height="60"
              />
              {/* <span className="relative inset-y-2">{roomDetails?.spaceId}</span> */}
            </div>
            <div className="float-left p-3.5 text-center">
              <Typography className="text-xs">{`#BRID${
                bookingDetails &&
                (bookingDetails.meetingId + 100000).toString().slice(1, 6)
              }`}</Typography>
            </div>
          </div>

          <CardContent className="flex-auto">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <span className="text-base font-bold">
                  {bookingDetails &&
                  bookingDetails.meetingName &&
                  bookingDetails.meetingName !== ""
                    ? bookingDetails?.meetingName
                    : "Desk"}
                </span>
              </div>
              <div className="d-flex">
                <span className="text-sm">{`${bookingDetails?.spaceName} - Meeting Room`}</span>
                <div className="d-flex ms-2">
                  <Participanticon style={{ size: "20px" }} />
                  <span className="text-sm">
                    {bookingDetails?.noOfAttendees}
                  </span>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Calendaricon />
                  <span className="text-xs pt-0.5">
                    {dayjs(bookingDetails?.startDate).format("MMM DD,YYYY")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Clock />
                  <span className="text-xs pt-0.5">
                    {`${dayjs(bookingDetails?.startDate).format(
                      "HH:mm A"
                    )} - ${dayjs(bookingDetails?.endDate).format("HH:mm A")}`}
                  </span>
                </div>
              </div>
              <div
                className="pt-3"
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
                {spaceResourceConfig
                  .filter((spaceResource) => {
                    return bookingDetails?.spaceResources?.some(
                      (meetingSpaceResource: IBookedSpaceResource) =>
                        meetingSpaceResource.resourceId ===
                        spaceResource.resourceId
                    );
                  })
                  .map((spaceResource, index: number) => (
                    <div key={index}>{spaceResource.resourceIcon}</div>
                  ))}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BookedCardContent;

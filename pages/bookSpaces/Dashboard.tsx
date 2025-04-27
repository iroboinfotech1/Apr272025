import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import InstandBooking from "../../components/features/InstantBooking";
import UpcomingMeetings from "../../components/features/UpcomingMeetings";
import CurrentMeeting from "../../components/features/CurrentMeeting";
import { BookingDetailsNew } from "../../models/Booking";
import { faker } from "@faker-js/faker";
import MyBookingCard from "./compponents/MyBookingCard";
import { IBookMeetingByMeetingId } from "./types/bookSpace";
import { getAvailableMeeting,getAvailableMeetingWithParams, getCurrentMeetingIds, getPastMeetingIds } from "../../services/bookSpace.service";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const myBookings: BookingDetailsNew[] = Array(2)
  .fill(0)
  .map((_, i) => ({
    id: faker.company.buzzAdjective(),
    date: faker.date.future(),
    meetingRoomName: faker.company.name(),
    title: faker.company.buzzPhrase(),
    fromTime: faker.date.future(),
    toTime: faker.date.future(),
    image: faker.image.url({ height: 400, width: 400 }),
    amenities: [
      {
        Projector: true,
        Whiteboard: true,
        Wifi: true,
        "Video Conferencing": true,
        Speaker: true,
        Microphone: true,
        TV: true,
        Telephone: true,
      },
    ],
  }));

const Dashboard = () => {
  const [bookedMeetingDetails, setBookedMeedingDetails] =
    useState<IBookMeetingByMeetingId>({} as IBookMeetingByMeetingId);
  const [currentMeetingIds, setCurrentMeetingIds] = useState<string[]>([]);
  const [pastMeetingIds, setPastMeetingIds] = useState<string[]>([]);
  const [spaceId, setSpaceId] = useState<number>(0);
  const [startDate, setStartDate] = React.useState(dayjs().format("YYYY-MM-DD hh:mm:ss a"));
  const [endDate, setEndDate] = React.useState(dayjs().add(30, 'minute').format("YYYY-MM-DD hh:mm:ss a"));
  useEffect(() => {
    (async () => {
      
      const bookedMeetingDetails = await getAvailableMeeting();
      const bookedMeetingByMeetingId: IBookMeetingByMeetingId =  bookedMeetingDetails;
      setBookedMeedingDetails(bookedMeetingByMeetingId);
    })();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMeetingIds(getCurrentMeetingIds(bookedMeetingDetails));
      setPastMeetingIds(getPastMeetingIds(bookedMeetingDetails));
    }, 1000);
    return () => clearInterval(interval);
  }, [bookedMeetingDetails]);

  // function getNewMeetingData() {
  //   //const bookedMeetingDetails = await getAvailableMeeting();
  //   //const bookedMeetingByMeetingId: IBookMeetingByMeetingId =  mapBookedMeetingDetialsByMeetingId(bookedMeetingDetails);
  //   getAvailableMeetingWithParams({spaceId, startDate, endDate}).then((response) => {
  //     const bookedMeetingByMeetingId: IBookMeetingByMeetingId =  response;
  //     setBookedMeedingDetails(bookedMeetingByMeetingId);
  //   }
  //   );
  // }

  async function getNewMeetingData() {
    const startdate = dayjs(startDate);
    const enddate = dayjs(endDate);
    let isServerSideFilter=true;
    if(isServerSideFilter)
    {
      getAvailableMeetingWithParams({spaceId, startDate, endDate}).then((response) => {
        const bookedMeetingByMeetingId: IBookMeetingByMeetingId =  response;
        setBookedMeedingDetails(bookedMeetingByMeetingId);
      }
      );
    }
    else
    {
      const bookedMeetingDetails = await getAvailableMeeting();
      const filteredMeetings: IBookMeetingByMeetingId =bookedMeetingDetails.filter((x)=>x.spaceId==spaceId && dayjs(x.startDate).isBetween(startdate.subtract(1,'minute'), enddate.add(1,'minute'), null, '[]')  && dayjs(x.endDate).isBetween(startdate.subtract(1,'minute'), enddate.add(1,'minute'), null, '[]'));
      setBookedMeedingDetails(filteredMeetings);
    }
  }

  
  return (
    <div className="text sm:pb-12 h-screen">
      <Layout>
        <h2 className="header2">Dashboard</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Manage your past & upcoming bookings{" "}
        </span>
        <div className="container mt-2 mx-0 px-0 ">
          <InstandBooking 
          spaceId={spaceId}
          startDate={startDate}
          endDate={endDate}
          setSpaceId={setSpaceId}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          getNewMeetingData={getNewMeetingData}
          />
        </div>
        <div className="container mt-4 mx-0 px-0 flex justify-between gap-6 xl:flex-col">
          <span className="flex-1">
            <UpcomingMeetings
              bookedMeetingDetails={Object.keys(bookedMeetingDetails).map(
                (bookedMeetingId: string) =>
                  bookedMeetingDetails[bookedMeetingId]
              )}
            />
          </span>
          <span className="flex-1 mt-2">
            <h4 className="mb-6">Current Meeting</h4>
            {currentMeetingIds.map((meetingId: string, index: number) => {
              return (
                <CurrentMeeting
                  key={index}
                  meeting={bookedMeetingDetails[meetingId]}
                />
              );
            })}
            <div className="mt-4 flex flex-col gap-2">
              <h4>Past Events</h4>
              {pastMeetingIds.map((meetingId) => (
                meetingId!=null && bookedMeetingDetails[meetingId]!=null?
                <MyBookingCard
                  meeting={bookedMeetingDetails[meetingId]}
                  key={bookedMeetingDetails[meetingId].meetingId}
                />:null
              ))}
            </div>
          </span>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;

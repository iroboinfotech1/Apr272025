import Layout from "../../components/Layout";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { IBookedMeetingAndDesk, IBookedSpaceResource } from "./types/bookSpace";
import { getAvailableMeeting } from "../../services/bookSpace.service";
import BookedCardContent from "./compponents/BookedCardContent";
import Router from "next/router";
import { useSetRecoilState } from "recoil";
import { selectedBookingDetails } from "../_app";
const MyBookings = () => {
  const [bookedMeetingDetails, setBookedMeetingDetails] = useState<{
    [key: number]: IBookedMeetingAndDesk;
  }>(
    {} as {
      [key: number]: IBookedMeetingAndDesk;
    }
  );

  const setSelectedBookingDetails = useSetRecoilState(selectedBookingDetails);
  useEffect(() => {
    (async () => {
      const transformedData: IBookedMeetingAndDesk[] = await getAvailableMeeting();
      setBookedMeetingDetails(transformedData);
    })();
  }, []);

  return (
    <Layout>
      <div className="px-4">
        <h2 className="text-xl font-bold">My Bookings</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Manage your past & upcoming bookings{" "}
        </span>
      </div>
      <div className="py-4">
        <Grid container spacing={1}>
          {Object.keys(bookedMeetingDetails).map(
            (bookedMeetingId: string, index: number) => (
              <Grid xs={6} key={index}>
                <div
                  onClick={() => {
                    setSelectedBookingDetails(
                      bookedMeetingDetails[bookedMeetingId]
                    );
                    Router.push("/bookSpaces/MyBookings/BookingDetails");
                  }}
                >
                  <BookedCardContent
                    bookingDetails={bookedMeetingDetails[bookedMeetingId]}
                  ></BookedCardContent>
                </div>
              </Grid>
            )
          )}
        </Grid>
      </div>
    </Layout>
  );
};

export default MyBookings;

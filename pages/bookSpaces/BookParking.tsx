import Grid from "@mui/material/Unstable_Grid2";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Layout from "../../components/Layout";
import { getAvailableMeeting, getAvailableMeetingMock } from "../../services/bookSpace.service";
import { flowFlagState, selectedCardDetailState, bookMeetingFormState, } from "../_app";
import BookedCardContent from "./compponents/BookedCardContent";
import { IBookedMeetingAndDesk, IBookedSpaceResource } from "./types/bookSpace";

const BookParking = () => {
  const [meetingFormState, setMeetingFormState] = useRecoilState(bookMeetingFormState);
  const [bookedMeetingDetails, setBookedMeetingDetails] = useState<{
    [key: number]: IBookedMeetingAndDesk;
  }>(
    {} as {
      [key: number]: IBookedMeetingAndDesk;
    }
  );
  const [flowFlag, setFlowFlag] = useRecoilState(flowFlagState);

  const [selectedCardDetails, setSelectedCardDetails] = useRecoilState(
    selectedCardDetailState
  );
  useEffect(() => {
    (async () => {
      const transformedData: IBookedMeetingAndDesk[] = await getAvailableMeeting();
      setBookedMeetingDetails(transformedData);
    })();
  }, []);
  const onClickParkingCard = (bookedMeeting: IBookedMeetingAndDesk) => {
    setMeetingFormState({
      allDays: false,
      meetingName: "",
      meetingType: 0,
      notes: "",
      participants:bookedMeeting.participants,
      referenceNumber: "",
      reminder: 0,
    });
    setSelectedCardDetails(bookedMeeting);
    setFlowFlag({
      isFlowFromBookSpace: false,
      isFlowFromBookDesk: false,
      isFlowFromManageVisitor: false,
    });
    Router.push("/bookSpaces/bookParking/ParkingView");
  };
  return (
    <Layout>
      <div className="px-4">
        <h2 className="text-xl font-bold">Book Parking</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Select booking from the below list{" "}
        </span>
      </div>
      <div className="py-4">
        <div
          className="flex flex-wrap">
          {Object.keys(bookedMeetingDetails).map(
            (bookedMeetingId: string, index: number) => (
              <Grid xs={6} key={index}>
                <div
                  onClick={() =>
                    onClickParkingCard(bookedMeetingDetails[bookedMeetingId])
                  }
                >
                  <BookedCardContent
                    bookingDetails={bookedMeetingDetails[bookedMeetingId]}
                  ></BookedCardContent>
                </div>
              </Grid>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookParking;

import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import DialogModal from "../../components/common/dialogModal";
import { getAvailableMeeting, getAvailableMeetingMock } from "../../services/bookSpace.service";
import AddServicesModal from "./Modals/addServicesModal";
import BookedCardContent from "./compponents/BookedCardContent";
import { IBookedMeetingAndDesk, IBookedSpaceResource } from "./types/bookSpace";

const BookService = () => {
  const [isServiceOpen, setIsServiceOpen] = React.useState(false);
  const [selectedCardId, setSelectedCardId] = React.useState(0);
  const [bookedMeetingDetails, setBookedMeetingDetails] = useState<{
    [key: number]: IBookedMeetingAndDesk;
  }>(
    {} as {
      [key: number]: IBookedMeetingAndDesk;
    }
  );
  useEffect(() => {
    (async () => {
      const transformedData: IBookedMeetingAndDesk[] = await getAvailableMeeting();
      setBookedMeetingDetails(transformedData);
    })();
  }, []);
  const onClickServiceCard = (selectedCardId: number) => {
    setSelectedCardId(selectedCardId);
  };

  return (
    <Layout>
      <div className="px-4">
        <h2 className="text-xl font-bold">Book Services</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Select booking from the below list{" "}
        </span>
      </div>
      <div>
        <div
          className="flex flex-wrap"
          onClick={(e) => {
            setIsServiceOpen(true);
          }}
        >
          {Object.keys(bookedMeetingDetails).map(
            (bookedMeetingId: string, index: number) => (
              <Grid xs={6} key={index}>
                <div
                  onClick={() => onClickServiceCard(parseInt(bookedMeetingDetails[bookedMeetingId]?.meetingId))}
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
      <DialogModal
        open={isServiceOpen}
        onClose={() => {
          setIsServiceOpen(false);
        }}
        modalTitle="Select Services"
      >
        <AddServicesModal
          onClose={() => {
            setIsServiceOpen(false);
          }}
          modalFrom="bookService"
          selectedMeetingId={selectedCardId}
        ></AddServicesModal>
      </DialogModal>
    </Layout>
  );
};

export default BookService;

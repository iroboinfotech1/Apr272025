import React from "react";
import Layout from "../../../components/Layout";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import { Button, DialogTitle, IconButton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import momenttz from "moment-timezone";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import AdminApps from "/assets/icons/admin.svg";
import SpaceManagement from "/assets/icons/spacemanagement.svg";
import CalendarIcon from "/assets/icons/calendarIcon.svg";
import { Theme, useTheme } from "@mui/material/styles";
import AddServicesModal from "../Modals/addServicesModal";
import DialogModal from "../../../components/common/dialogModal";
import { useRecoilState } from "recoil";
import {
  bookDeskState,
  flowFlagState,
  searchBookRoomState,
  selectedDeskState,
  selectedMeetingServiceState,
  selectedParkingSlotState,
} from "../../_app";
import Image from "next/image";
import dayjs from "dayjs";
import { IBookDesk, IBookDeskDetail, ISpaceResource } from "../types/bookSpace";
import { bookDesk } from "../../../services/bookSpace.service";
import { spaceResourceConfig } from "../../../src/constants/spaceManagement/config";
import moment from "moment";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const BookDeskForm = () => {
  const [isServiceOpen, setIsServiceOpen] = React.useState(false);
  const [flowFlag, setFlowFlag] = useRecoilState(flowFlagState);
  const [selectedDesk, setSelectedDesk] = useRecoilState(selectedDeskState);
  const [searchBooking, setSearchBooking] = useRecoilState(searchBookRoomState);
  const [selectedMeetingServices, setSelectedMeetingServices] = useRecoilState(
    selectedMeetingServiceState
  );
  const [selectedParkingSlot, setSelectedParkingSlot] = useRecoilState(
    selectedParkingSlotState
  );
  const [bookedDeskDetail, setBookDeskDetail] = useRecoilState(bookDeskState);

  const onBookDeskClick = async () => {
    debugger;
    const payload: IBookDeskDetail = preparePayload();
    const response: IBookDeskDetail = await bookDesk(payload);
    setBookDeskDetail(response);
    Router.push("/bookSpaces/bookDesk/confirmDesk");
  };

  const preparePayload = (): IBookDeskDetail => {
    const bookDeskPayload: IBookDeskDetail = {} as IBookDeskDetail;
    bookDeskPayload.desk = {
      alldays: searchBooking.allDays,
      buildingId: parseInt(searchBooking.buildingId),
      deskId: selectedDesk.spaceId,
      deskName: selectedDesk.spaceName,
      endDateTime: moment(searchBooking.endDate).format(),
      floorId: parseInt(searchBooking.floorId),
      orgId: parseInt(searchBooking.orgId),
      reminder: searchBooking.reminder,
      startDateTime: moment(searchBooking.startDate).format(),
      timezone:momenttz.tz.guess(),
      userId: 1,
      userName: "PixelCubeUser",
    } as IBookDesk;
    bookDeskPayload.services = selectedMeetingServices;
    bookDeskPayload.parkings = selectedParkingSlot;
    return bookDeskPayload;
  };

  return (
    <Layout>
      <div className="flex justify-between sm:block sm:px-16 mt-4 px-16 md:px-2">
        <div className="col-md-6 flex md-flex-wrap justify-between">
          <Card sx={{ maxWidth: 500 }} className="shadow-none bg-transparent">
            <Image
              src={
                (selectedDesk && selectedDesk.organisationImage) ||
                "/assets/images/userprofile.png"
              }
              alt=""
              className="float-left md:float-none sm:float-none lg:float-none"
              width="100"
              height="60"
            />
            <CardContent className="float-right">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="text-base"
              >
                {selectedDesk &&
                  `${selectedDesk.spaceName} - Meeting ${selectedDesk.spaceType}`}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-xs"
              >
                {selectedDesk &&
                  `${selectedDesk.floorName}, ${selectedDesk.address}`}
              </Typography>
              {selectedDesk && (
                <div
                  className="pt-3"
                  style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
                >
                  {spaceResourceConfig
                    .filter((spaceResource) => {
                      return selectedDesk.spaceResources?.some(
                        (meetingSpaceResource: ISpaceResource) =>
                          meetingSpaceResource.resourceId ===
                          spaceResource.resourceId
                      );
                    })
                    .map((spaceResource, index: number) => (
                      <div key={index}>{spaceResource.resourceIcon}</div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-md-6 lg:flex md:flex flex justify-end items-end sm:block">
          <div className="flex justify-between items-end md-flex-wrap md:block sm:block lg:block">
            <div className="px-4">
              <Card
                sx={{ maxWidth: 345 }}
                className="shadow-none bg-transparent h-20"
              >
                <div className="float-left pt-5 pl-1.5">
                  <CalendarIcon />
                </div>
                <CardContent className="float-right sm:float-none sm:pl-12 p-3">
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="text-xs text-text-light"
                  >
                    Start Date & Start Time
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="text-xs font-bold"
                  >
                    {dayjs(searchBooking.startDate).format("MMMM DD hh:mm A")}
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <div className="flex md-flex-wrap md:block sm:block justify-between items-end">
              <div className="px-4">
                <Card
                  sx={{ maxWidth: 345 }}
                  className="shadow-none bg-transparent h-20"
                >
                  <div className="float-left pt-5 pl-1.5">
                    <CalendarIcon />
                  </div>
                  <CardContent className="float-right sm:float-none sm:pl-12 p-3">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="text-xs text-text-light"
                    >
                      End Date & End Time
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="text-xs font-bold"
                    >
                      {dayjs(searchBooking.endDate).format("MMMM DD hh:mm A")}
                    </Typography>
                    <div className="pt-2"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <hr></hr>
      <FormGroup>
        <div className="row w-full text-sm mt-4 px-80 lg:px-2 md:px-2 sm:px-1">
          <div className="flex flex-col py-2">
            <div className="text-sm">
              <Stack direction="row" spacing={5}>
                <Button
                  variant="outlined"
                  className="flex-1 w-64"
                  onClick={(e) => {
                    setIsServiceOpen(true);
                  }}
                >
                  {selectedMeetingServices && selectedMeetingServices.length > 0
                    ? "Update Services"
                    : "Add Services"}
                </Button>
                <Button
                  variant="outlined"
                  className="flex-1 w-64"
                  onClick={(e) => {
                    setFlowFlag({
                      isFlowFromBookDesk: true,
                      isFlowFromBookSpace: false,
                      isFlowFromManageVisitor: false,
                    });
                    Router.push("/bookSpaces/bookParking/ParkingView");
                  }}
                >
                  {selectedParkingSlot && selectedParkingSlot.length > 0
                    ? "Update Parking"
                    : "Add Parking"}
                </Button>
              </Stack>
            </div>
            <div className="text-sm">
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <Button
                  variant="contained"
                  className="w-100"
                  onClick={() => onBookDeskClick()}
                >
                  Book Desk
                </Button>
              </FormControl>
            </div>
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
          ></AddServicesModal>
        </DialogModal>
      </FormGroup>
    </Layout>
  );
};
export default BookDeskForm;

  import React, { useState,useEffect } from "react";
  import Layout from "../../../components/Layout";
  import Card from "@mui/material/Card";
  import Grid from "@mui/material/Unstable_Grid2";
  import CardContent from "@mui/material/CardContent";
  import { Button, Stack } from "@mui/material";
  import Typography from "@mui/material/Typography";
  import Router from "next/router";
  import FormControl from "@mui/material/FormControl";
  import FormGroup from "@mui/material/FormGroup";
  import Select, { SelectChangeEvent } from "@mui/material/Select";
  import InputLabel from "@mui/material/InputLabel";
  import MenuItem from "@mui/material/MenuItem";
  import TextField from "@mui/material/TextField";
  import roomData from "../data/bookRoomData.json";
  import SystemManagement from "/assets/icons/systemmanagement.svg";
  import AdminApps from "/assets/icons/admin.svg";
  import SpaceManagement from "/assets/icons/spacemanagement.svg";
  import CalendarIcon from "/assets/icons/calendarIcon.svg";
  import momenttz from "moment-timezone";
  import { Theme, useTheme } from "@mui/material/styles";
  import Box from "@mui/material/Box";
  import OutlinedInput from "@mui/material/OutlinedInput";
  import Chip from "@mui/material/Chip";
  import AddServicesModal from "../Modals/addServicesModal";
  import DialogModal from "../../../components/common/dialogModal";
  import { useRecoilState, useRecoilValue } from "recoil";
  import {
    bookMeetingFormState,
    bookMeetingState,
    flowFlagState,
    searchBookRoomState,
    selectedBookingDetails,
    selectedMeetingServiceState,
    selectedParkingSlotState,
    selectedRoomState,
  } from "../../_app";
  import { IBookMeetingDetail, ISpaceResource, IAvailableSpaceDetail } from "../types/bookSpace";
  import Image from "next/image";
  import moment from "moment";
  import {
    bookMeeting
  } from "../../../services/bookSpace.service";
  import { spaceResourceConfig } from "../../../src/constants/spaceManagement/config";
  // import SpaceContext from "../../../context/BookSpaceContext";
  import UsermanagementService from "../../../services/usermanagement.service";
  import dayjs from "dayjs";
  import DefaultSpaceImage from "../../../assets/images/DefaultSpaceImage.png";
  import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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

  function getStyles(name: string, participantsId: readonly string[], theme: Theme) {
    return {
      fontWeight:
      participantsId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const BookMeetingForm = () => {
    const theme = useTheme();
    const [participantsId, setParticipantsId] = useState<string[]>([]);
    const [meetingName, setMeetingName] = useState<string>("");
    const [meetingNotes, setMeetingNotes] = useState<string>("");
    const [selectedMeetingType, setSelectedMeetingType] = useState(0);
    const [selectedRemainder, setSelectedRemainder] = useState(0);
    const bookingMeetingDetail = useRecoilValue(selectedBookingDetails);
    const [selectedRoomDetails, setSelectedRoomDetails] =
      useRecoilState(selectedRoomState);
    const [searchBookRoom, setSearchBookingState] =
      useRecoilState(searchBookRoomState);
    const [selectedMeetingServices, setSelectedMeetingServices] = useRecoilState(
      selectedMeetingServiceState
    );
    const [meetingFormDetails, setMeetingFormDetails] =
      useRecoilState(bookMeetingFormState);
    const [selectedParkingSlot, setSelectedParkingSlot] = useRecoilState(
      selectedParkingSlotState
    );
    const [flowFlag, setFlowFlag] = useRecoilState(flowFlagState);
    const [bookMeetingInfo, setBookMeetingInfo] =
      useRecoilState(bookMeetingState);
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState(""); // Store formatted date string

  useEffect(() => {
      if (bookingMeetingDetail) {
        setMeetingFormDetails({
          meetingName: bookingMeetingDetail.meetingName,
          notes: bookingMeetingDetail.notes,
          participants: bookingMeetingDetail.participants,
          meetingType: 1,
          reminder: 10,
          referenceNumber: bookingMeetingDetail.meetingId.toString(),
          noOfAttendees: bookingMeetingDetail.noOfAttendees,
          allDays:
            dayjs(searchBookRoom.endDate).diff(
              dayjs(searchBookRoom.startDate),
              "minutes"
            ) === 540
              ? true
              : false,
        });
        setStartDate(
          dayjs(bookingMeetingDetail.startDate).format("YYYY-MM-DD hh:mm:ss a")
        );
        setEndDate(
          dayjs(bookingMeetingDetail.endDate).format("YYYY-MM-DD hh:mm:ss a")
        );
      }
    }, [
      bookingMeetingDetail,
      searchBookRoom.endDate,
      searchBookRoom.startDate,
      setMeetingFormDetails,
    ]);
    const handleParticipantsChange = 
    (event: SelectChangeEvent<typeof participantsId>)=>{
      const {
        target: { value },
      } = event;
      setParticipantsId(typeof value === "string" ? value.split(",") : value);
      setMeetingFormDetails({
        ...meetingFormDetails,
        participants: typeof value === "string" ? value.split(",") : value,
      });
    };
    const [valueTab, setValueTab] = React.useState(0);

    const [isServiceOpen, setIsServiceOpen] = React.useState(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [userList,setUserList]=useState<any[]>([]);

    useEffect(() => {
      fetchMyApi();
    }, []);

    async function fetchMyApi() {
      setLoader(true);
      var response = await UsermanagementService.getuserlist();
      console.log("UsermanagementService addUser", response);
      if (response?.data != null) {
        let userListTemp: any[] = [];
        response.data.forEach((userItem: any) => {
          var user: any = { 'userId': userItem.userId, 'userNameEmailId': userItem.userName + '<' + userItem.email + '>'}
          userListTemp.push(user);
        });
        setUserList(userListTemp);
      }
      setLoader(false);
      console.log("UsermanagementService-getuserlist", response);
    }
    const onBookMeetClick = async () => {
      const payload: IBookMeetingDetail = preparePayload();
      const meetingInfo = await bookMeeting(payload);
      setBookMeetingInfo(meetingInfo.meeting);
      Router.push("/bookSpaces/bookroom/confirmMeeting");
    };

    const onCancelClick = () => {
      Router.push("/bookSpaces/MyBookings");
    };

    const onUpdateClick = async () => {
      const payload: IBookMeetingDetail = preparePayload();
      payload.meeting.action = "update";
      payload.meeting.meetingId = bookingMeetingDetail.meetingId;
      const meetingInfo = await bookMeeting(payload);
      (meetingInfo.meeting.referenceNumber = `BRID${
        10000 + bookingMeetingDetail.meetingId
      }`), // Code to be removed after svc fix
        setBookMeetingInfo(meetingInfo.meeting);
      Router.push("/bookSpaces/bookroom/confirmMeeting");
    };

    const preparePayload = () => {
      return {
        meeting: {
          buildingId: selectedRoomDetails[valueTab].buildingId,
          spaceId: selectedRoomDetails[valueTab].spaceId,
          orgId: selectedRoomDetails[valueTab].orgId,
          floorId: selectedRoomDetails[valueTab].floorId,
          endDateTime:
            endDate && endDate !== ""
              ? moment(endDate).format()
              : moment(searchBookRoom.endDate).format(),
          startDateTime:
            startDate && startDate !== ""
              ? moment(startDate).format()
              : moment(searchBookRoom.startDate).format(),
          allDays: searchBookRoom.allDays,
          noOfAttendees: searchBookRoom.attendies,
          meetingName: meetingFormDetails.meetingName,
          reminder: meetingFormDetails.reminder,
          meetingType: meetingFormDetails.meetingType,
          notes: meetingFormDetails.notes,
          participants: meetingFormDetails.participants,
          referenceNumber: "",
          timezone:momenttz.tz.guess(),
        },
        services: selectedMeetingServices,
        parkings: selectedParkingSlot,
      } as IBookMeetingDetail;
    };

    return (
      <Layout>
        <div className="flex justify-between sm:block sm:px-16 mt-4 px-16 md:px-2">
          <div className="col-md-6 flex md-flex-wrap justify-between">
            <Card sx={{ maxWidth: 500 }} className="shadow-none bg-transparent">
              <Image
                src={
                  (selectedRoomDetails &&
                    selectedRoomDetails.length > 0 &&
                    selectedRoomDetails[valueTab].organisationImage) ||
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
                  {selectedRoomDetails &&
                    selectedRoomDetails.length > 0 &&
                    `${selectedRoomDetails[valueTab].spaceName} - Meeting ${selectedRoomDetails[valueTab].spaceType}`}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-xs"
                >
                  {selectedRoomDetails &&
                    selectedRoomDetails.length > 0 &&
                    `${selectedRoomDetails[valueTab].floorName}, ${selectedRoomDetails[valueTab].address}`}
                </Typography>
                {selectedRoomDetails && selectedRoomDetails.length > 0 && (
                  <div
                    className="pt-3"
                    style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
                  >
                    {spaceResourceConfig
                      .filter((spaceResource) => {
                        return selectedRoomDetails[valueTab].spaceResources?.some(
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
            {(selectedRoomDetails[valueTab] && !selectedRoomDetails[valueTab].isEditMode && (
                <>
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
                          {moment(searchBookRoom.startDate).format(
                            "MMMM DD hh:mm A"
                          )}
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
                            {moment(searchBookRoom.endDate).format(
                              "MMMM DD hh:mm A"
                            )}
                          </Typography>
                          <div className="pt-2"></div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )) || (
                <div className="flex flex-row gap-[20px]">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="flex justify-between gap-[20px] sm:flex-col">
                      <FormControl fullWidth size="small">
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}
                          label="Start Date & Start Time"
                          value={dayjs(startDate)}
                          onChange={(newValue) => {
                            if (newValue) {
                              const formattedNewStartDate = newValue.format(
                                "YYYY-MM-DD hh:mm:ss a"
                              );
                              setStartDate(formattedNewStartDate);
                              // Ensure newValue is a dayjs object and use add to calculate end date
                              const formattedEndDate = dayjs(newValue)
                                .add(30, "minute")
                                .format("YYYY-MM-DD hh:mm:ss a");
                              setEndDate(formattedEndDate); // Store formatted string for endDate
                            }
                          }}
                        />
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <DateTimePicker
                          renderInput={(props) => <TextField {...props} />}
                          label="End Date & End Time"
                          value={dayjs(endDate)} // Convert formatted string back to dayjs
                          onChange={(newValue) => {
                            if (newValue) {
                              // Ensure newValue is a dayjs object and format it before storing
                              const formattedNewEndDate = newValue.format(
                                "YYYY-MM-DD hh:mm:ss a"
                              );
                              setEndDate(formattedNewEndDate);
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                  </LocalizationProvider>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onUpdateClick}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onCancelClick}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <br></br>
        <hr></hr>
        <FormGroup>
          <div className="row w-full text-sm mt-4 px-80 lg:px-2 md:px-2 sm:px-1">
            <div className="flex flex-col py-2">
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <TextField
                  id="outlined-basic"
                  label="Meeting Title"
                  variant="outlined"
                  value={
                    meetingName ||
                    meetingFormDetails.meetingName ||
                    bookingMeetingDetail?.meetingName
                  }
                  onChange={(e: any) => {
                    console.log(e);
                    setMeetingName(e.target.value);
                    setMeetingFormDetails({
                      ...meetingFormDetails,
                      meetingName: e.target.value,
                    });
                  }}
                />
              </FormControl>

              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <InputLabel id="demo-multiple-chip-label">
                  Participants
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  rows={4}
                  value={meetingFormDetails.participants}
                  onChange={handleParticipantsChange}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Participants"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {userList && userList.length > 0 && userList?.map((name:any) => (
                    <MenuItem
                      key={name.userId}
                      value={name.userNameEmailId}
                      style={getStyles(name.userNameEmailId, participantsId, theme)}
                    >
                      {name.userNameEmailId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <TextField
                  id="outlined-basic"
                  label="Notes"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={
                    meetingNotes ||
                    meetingFormDetails.notes ||
                    bookingMeetingDetail.notes
                  }
                  onChange={(e: any) => {
                    setMeetingNotes(e.target.value);
                    setMeetingFormDetails({
                      ...meetingFormDetails,
                      notes: e.target.value,
                    });
                  }}
                />
              </FormControl>

              <div className="flex">
                <FormControl
                  fullWidth
                  sx={{ margin: "20px 20px 0px 0px" }}
                  size="small"
                >
                  <InputLabel id="locationLabel">Meeting Type</InputLabel>
                  <Select
                    labelId="locationLabel"
                    label="Meeting Type"
                    className="text-sm"
                    value={selectedMeetingType || meetingFormDetails.meetingType}
                    onChange={(e: any) => {
                      setSelectedMeetingType(e.target.value);
                      setMeetingFormDetails({
                        ...meetingFormDetails,
                        meetingType: e.target.value,
                      });
                    }}
                  >
                    {roomData.meetingType.map((x, i) => {
                      return (
                        <MenuItem key={i} value={x.id}>
                          {x.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ margin: "20px 0px 0px 20px" }}
                  size="small"
                >
                  <InputLabel id="locationLabel">Notification</InputLabel>
                  <Select
                    labelId="locationLabel"
                    label="Notification"
                    className="text-sm"
                    value={selectedRemainder || meetingFormDetails.reminder}
                    onChange={(e: any) => {
                      setSelectedRemainder(e.target.value);
                      setMeetingFormDetails({
                        ...meetingFormDetails,
                        reminder: e.target.value,
                      });
                    }}
                  >
                    {roomData.reminders.map((x) => {
                      return (
                        <MenuItem key={x.id} value={x.id}>
                          {x.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <br></br>
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
                        isFlowFromBookSpace: true,
                        isFlowFromBookDesk: false,
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
              {selectedRoomDetails[valueTab] && !selectedRoomDetails[valueTab].isEditMode && (
                <div className="pb-16">
                  <Button
                    variant="contained"
                    className="w-100 mt-4"
                    onClick={() => onBookMeetClick()}
                  >
                    Book Meeting
                  </Button>
                </div>
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
            ></AddServicesModal>
          </DialogModal>
        </FormGroup>
      </Layout>
    );
  };
  export default BookMeetingForm;

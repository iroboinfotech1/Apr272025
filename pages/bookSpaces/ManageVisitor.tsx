import Layout from "../../components/Layout";
import InputBox from "../../components/features/InputBox/InputBox";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import momenttz from "moment-timezone";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import roomData from "../bookSpaces/data/bookRoomData.json";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, Stack } from "@mui/material";
import AddServicesModal from "../bookSpaces/Modals/addServicesModal";
import DialogModal from "../../components/common/dialogModal";
import Router from "next/router";
import {
  bookDesk,
  getOrganizationById,
} from "../../services/bookSpace.service";
import {
  IBookDesk,
  IBookDeskDetail,
  IOrganization,
  initializeDataType,
} from "./types/bookSpace";
import { KVP } from "../../models/masters/Industry";
import { useRecoilState } from "recoil";
import {
  bookDeskState,
  flowFlagState,
  manageVisitorState,
  selectedMeetingServiceState,
  selectedParkingSlotState,
} from "../_app";
import moment from "moment";
import VisitorUpdate from "./Modals/VisitorUpdate";
import UsermanagementService from "../../services/usermanagement.service";
import { ToastContainer } from "react-toastify";

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
const ManageVisitor = () => {
  const [startDate, setStartDate] = useState<string>(
    dayjs().format("YYYY-MM-DD hh:mm:ss a")
  );
  const [endDate, setEndDate] = useState<string>(
    dayjs().format("YYYY-MM-DD hh:mm:ss a")
  );
  const [bookingServiceDetails, setBookingServiceDetials] =
    useState<initializeDataType>({} as initializeDataType);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isaddvisitorservice, setIsaddvisitorServiceOpen] = useState(false);
  const [meetingReason, setMeetingReason] = useState<string>("");
  const [flowFlag, setFlowFlag] = useRecoilState(flowFlagState);
  const [location, setLocation] = useState("");
  const [selectedMeetingServices, setSelectedMeetingServices] = useRecoilState(
    selectedMeetingServiceState
  );
  const [manageVisitor, setManageVisitor] = useRecoilState(manageVisitorState);
  const [selectedParkingSlot, setSelectedParkingSlot] = useRecoilState(
    selectedParkingSlotState
  );
  const [bookedDeskDetail, setBookDeskDetail] = useRecoilState(bookDeskState);
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<any>({});

  useEffect(() => {
    const fetchMyApi = async () => {
      const orgResponse = await getOrganizationById();
      const updatedBookingService = {
        ...bookingServiceDetails,
        locations: orgResponse.map((org: IOrganization) => {
          return {
            id: org.orgId,
            name: `${org.orgName}, ${org.cityName}, ${org.countryName}`,
          } as KVP;
        }),
      };
      setBookingServiceDetials(updatedBookingService);
    };
    fetchMyApi();
    fetchUserList();
    setSelectedParkingSlot([]);
    setSelectedMeetingServices([]);
  }, []);

  const fetchUserList = async () => {
    const accessToken = null; // Replace with actual access token
    const isvistor = true; // Set to true or false as needed
    const response = await UsermanagementService.getuserlistforVisitor(accessToken, isvistor);
    setUserList(response.data);
  };
  const handleBookMeeting = async () => {
    const payload: IBookDeskDetail = preparePayload();
    const response: IBookDeskDetail = await bookDesk(payload);
    setBookDeskDetail(response);
    Router.push("/bookSpaces/bookDesk/confirmDesk");
  };

  const preparePayload = (): IBookDeskDetail => {
    const bookDeskPayload: IBookDeskDetail = {} as IBookDeskDetail;
    bookDeskPayload.desk = {
      alldays: false,
      buildingId: 0,
      deskId: 0,
      deskName: "dummyDesk",
      endDateTime: moment(manageVisitor.endDate).format(),
      floorId: 0,
      orgId: manageVisitor.location,
      reminder: 0,
      startDateTime: moment(manageVisitor.startDate).format(),
      userId: 1,
      userName: "PixelCubeUser",
      timezone:momenttz.tz.guess(),
    } as IBookDesk;
    bookDeskPayload.services = selectedMeetingServices;
    bookDeskPayload.parkings = selectedParkingSlot;
    return bookDeskPayload;
  };

  return (
    <Layout>
      <div>
        <h2 className="text-xl font-bold">Manage Visitor</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Let&apos;s manage your visitor{" "}
        </span>
      </div>
      <FormGroup>
      <div className="text-sm mt-4 max-w-xl mx-auto mb-20 flex-col">
      <div className="flex justify-between gap-[20px] sm:flex-col">
          {/* Select Visitor Dropdown */}
          <FormControl
            className="flex-[7] mb-4"
            size="small"
          >
            <InputLabel id="selvisitor">Select Visitor</InputLabel>
            <Select
              labelId="lblvisitor"
              label="Select Visitor"
              className="text-sm"
               value={selectedVisitor}
              onChange={(e) => setSelectedVisitor(e.target.value)}
              renderValue={(selected) => {
                return userList.find((x) => x.userId === selected)?.email;
              }}
            >
              {userList.map((x, i) => {
                return (
                  <MenuItem key={i} value={x?.userId}>
                    {x.email}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Add/Update Button */}
          <FormControl
            className="flex-[3] mb-4"
            size="small"
          >
            <Button
              variant="contained"
              className="w-full"
              onClick={(e) => {
                setIsaddvisitorServiceOpen(true);
              }}
            >
              Add/Update
            </Button>
          </FormControl>
      </div>
           <FormControl
            fullWidth
            className="mb-6"
            size="small"
           >
            <InputLabel id="locationLabel">Location</InputLabel>
            <Select
              labelId="locationLabel"
              label="Location"
              className="text-sm"
              value={
                manageVisitor.location ? manageVisitor.location.toString() : ""
              }
              onChange={(e: SelectChangeEvent<string>) =>
                setManageVisitor({
                  ...manageVisitor,
                  location: parseInt(e.target.value),
                })
              }
            >
              {bookingServiceDetails?.locations?.map((x, i) => {
                return (
                  <MenuItem key={i} value={x.id}>
                    {x.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <div className="flex justify-between gap-[20px] sm:flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl fullWidth size="small">
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField {...props} className="text-sm" />
                  )}
                  label="Start Date & Start Time"
                  value={manageVisitor.startDate}
                  onChange={(newValue) => {
                    setManageVisitor({
                      ...manageVisitor,
                      startDate: dayjs(newValue).format(
                        "MM/DD/YYYY hh:mm:ss A"
                      ),
                    });
                  }}
                />
              </FormControl>
            <FormControl fullWidth size="small">
                <DateTimePicker
                  className="text-sm"
                  renderInput={(props) => <TextField {...props} />}
                  label="End Date & End Time"
                  value={manageVisitor.endDate}
                  onChange={(newValue) => {
                    setManageVisitor({
                      ...manageVisitor,
                      endDate: dayjs(newValue).format("MM/DD/YYYY hh:mm:ss A"),
                    });
                  }}
                />
              </FormControl>
            </LocalizationProvider>
          </div>
          <div className="flex flex-col gap-4">
            <FormControl
              fullWidth
              className="mt-4"
              size="small"
            >
              <InputLabel id="meetLabel">Whom to meet</InputLabel>
              <Select
                labelId="meetLabel"
                label=" Whom to meet   "
                className="text-sm"
                // value={
                //   manageVisitor.personToMeetId
                //     ? manageVisitor.personToMeetId.toString()
                //     : ""
                // }
                // onChange={(e: SelectChangeEvent<string>) =>
                //   setManageVisitor({
                //     ...manageVisitor,
                //     personToMeetId: parseInt(e.target.value),
                //     personToMeetName: e.target.name,
                //   })
                // }
              >
                {names.map((name, index) => {
                  return (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
                size="small"
            >
              <TextField
                id="outlined-basic"
                label="Purpose of visit"
                variant="outlined"
                value={manageVisitor.purposeOfVisit}
                onChange={(e: any) => {
                  setManageVisitor({
                    ...manageVisitor,
                    purposeOfVisit: e.target.value,
                  });
                }}
              />
            </FormControl>
            <div className="flex sm:flex-col gap-2 my-4">
              {/* <Stack direction="row" spacing={2}> */}
                <Button
                  variant="outlined"
                  className="w-full"
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
                  className="w-full"
                  onClick={(e) => {
                    setFlowFlag({
                      isFlowFromBookSpace: false,
                      isFlowFromBookDesk: false,
                      isFlowFromManageVisitor: true,
                    });
                    Router.push("/bookSpaces/bookParking/ParkingView");
                  }}
                >
                  {selectedParkingSlot && selectedParkingSlot.length > 0
                    ? "Update Parking"
                    : "Add Parking"}
                </Button>
              {/* </Stack> */}
            </div>
            <div className="flex justify-between">
              <div>
                <FormControl
                  fullWidth
                  size="small"
                >
                  <FormLabel component="legend">
                    Are you Covid positive
                  </FormLabel>
                  <div className="flex">
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={manageVisitor.covidPositiveStatus}
                          onChange={() =>
                            setManageVisitor({
                              ...manageVisitor,
                              covidPositiveStatus: true,
                            })
                          }
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={!manageVisitor.covidPositiveStatus}
                          onChange={() =>
                            setManageVisitor({
                              ...manageVisitor,
                              covidPositiveStatus: false,
                            })
                          }
                        />
                      }
                      label="No"
                    />
                  </div>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  size="small"
                >
                  <FormLabel component="legend">Covid question No2?</FormLabel>
                  <div className="flex">
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={manageVisitor.covidQuestion2}
                          onChange={() =>
                            setManageVisitor({
                              ...manageVisitor,
                              covidQuestion2: true,
                            })
                          }
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={!manageVisitor.covidQuestion2}
                          onChange={() =>
                            setManageVisitor({
                              ...manageVisitor,
                              covidQuestion2: false,
                            })
                          }
                        />
                      }
                      label="No"
                    />
                  </div>
                </FormControl>
              </div>
            </div>
            <div className="flex sm:flex-col justify-between my-4">
              <FormControl
                fullWidth
                size="small"
              >
                <Button
                  variant="contained"
                  className="w-100"
                  onClick={(x) => handleBookMeeting()}
                >
                  Book Meeting
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
        <DialogModal
          open={isaddvisitorservice}
          onClose={() => {
            setIsaddvisitorServiceOpen(false);
          }}
          modalTitle="Manage Visitor"
        >
         <VisitorUpdate
          selectedUser={selectedVisitor ? userList.find((x) => x.userId === selectedVisitor) : {}}
            onClose={() => {
              setIsaddvisitorServiceOpen(false);
            }}
          ></VisitorUpdate>
        </DialogModal>
      </FormGroup>
      <ToastContainer />
    </Layout>
  );
};
export default ManageVisitor;

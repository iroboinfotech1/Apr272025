import FormControl from "@mui/material/FormControl";
import Router from "next/router";
import Layout from "../../components/Layout";

import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
// import FormInput from '../components/FormInput';
import { Button, Stack } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { RecoilRoot, atom, useRecoilState, useSetRecoilState } from "recoil";
import BookSpaceContext from "../../context/BookSpaceContext";
import DialogModal from "../../components/common/dialogModal";
import SetRecurringModal from "./Modals/setRecurringModal";
import {
  getBuildingByOrgId,
  getFloorByBuildingId,
  getOrganizationById,
} from "../../services/bookSpace.service";
import {
  IBuilding,
  IFloor,
  IOrganization,
  ISearchBookingRoom,
  initializeDataType,
} from "./types/bookSpace";
import { bookRoomState, searchBookRoomState } from "../_app";
import moment from "moment";
import roomData from "./data/bookRoomData.json";


interface KVP {
  id: number;
  name: string;
}


const BookRoom = () => {
  const [bookingServiceDetails, setBookingServiceDetials] =
    useState<initializeDataType>({} as initializeDataType);
  const bookingRecoilServiceDetails = useRecoilState(bookRoomState);
  const searchBookingRoomRecoil = useSetRecoilState(searchBookRoomState);
  const setBookingRecoilServiceDetails = useSetRecoilState(bookRoomState);
  const [isRecurringDialog, setIsRecurringDialog] = React.useState(false);


  const [startDate, setStartDate] = React.useState(dayjs().format("YYYY-MM-DD hh:mm:ss a"));
  const [endDate, setEndDate] = React.useState(dayjs().add(30, 'minute').format("YYYY-MM-DD hh:mm:ss a")); // Store formatted date string
  // const [endDate, setEndDate] = React.useState<string>(
  //   moment().format("YYYY-MM-DD hh:mm:ss a")
  // );
  const [selectedStartDate, setSelectedStartDate] = React.useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = React.useState<string>("");
  const [location, setLocation] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [allDays, setAllDays] = useState<boolean>(false);
  const [remainder, setReminder] = useState(0);
  const [attendies, setAttendies] = useState("");

  useEffect(() => {
    const fetchMyApi = async () => {
      const orgResponse = await getOrganizationById();
      const updatedBookingService = {
        ...bookingServiceDetails,
         locations: orgResponse.map((org: IOrganization) => {
          const locationParts = [org.orgName, org.cityName, org.countryName].filter(part => part);
          const locationName = locationParts.join(", ");
          return {
            id: org.orgId,
            name: locationName,
          } as KVP;
        }),
      };
      setBookingServiceDetials(updatedBookingService);
      setBookingRecoilServiceDetails(updatedBookingService);
      console.log(bookingRecoilServiceDetails);
    };
    if (bookingServiceDetails?.locations?.length === 1) {
      const singleLocationId = bookingServiceDetails.locations[0].id;
      setLocation(singleLocationId);
      handleLocationChange(singleLocationId);
    }

    fetchMyApi();
  }, []);

  const onMakeRecurring = () => {
    setIsRecurringDialog(true);
  }

  // useEffect(() => {
  //   // Check if there's only one location in the list
  //   debugger;
  //   if (bookingServiceDetails?.locations?.length === 1) {
  //     const singleLocationId = bookingServiceDetails.locations[0].id;
  //     setLocation(singleLocationId);
  //     handleLocationChange(singleLocationId);
  //   }
  // }, [bookingServiceDetails.locations]);


  const handleChange = (e) => {
    const value = e.target.value;
    // Regular expression to allow only integers
    const regex = /^[0-9]*$/;

    if (regex.test(value)) {
      setAttendies(value);
    }
  };
 
  const onSearchClick = () => {
    let formattedStartDate = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    let formattedEndDate = dayjs(endDate as any).format("YYYY-MM-DD HH:mm:ss");

    const searchInfo: ISearchBookingRoom = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      orgId: location,
      buildingId: building,
      attendies: attendies !== "" ? parseInt(attendies) : 0,
      floorId: floor,
      allDays: allDays,
      reminder: remainder,
      space_type_id: 1
    };
    searchBookingRoomRecoil(searchInfo);
    Router.push("/bookSpaces/bookroom/searchList");
  };

  const handleLocationChange = async (locationId: string) => {
    setLocation(locationId);
    const buildingResponse = await getBuildingByOrgId(locationId);
    const updatedBookingServiceDetails = {
      ...bookingServiceDetails,
      buildings: buildingResponse.map((building: IBuilding) => {
        return { id: building.buildingId, name: building.buildingName } as KVP;
      }),
    };
    setBookingServiceDetials(updatedBookingServiceDetails);
    setBookingRecoilServiceDetails(updatedBookingServiceDetails);
  };

  useEffect(() => {
    if (bookingServiceDetails.locations && bookingServiceDetails.locations.length === 1) {
      const singleLocationId = bookingServiceDetails.locations[0].id;
      setLocation(singleLocationId);
      handleLocationChange(singleLocationId);
    }
  }, [bookingServiceDetails.locations]);
  
  const handleBuildingChange = async (buildingId: string) => {
    setBuilding(buildingId);
    const floorResponse = await getFloorByBuildingId(buildingId);
    const updatedBookingServiceDetails: initializeDataType = {
      ...bookingServiceDetails,
      floors: floorResponse.map((floor: IFloor) => {
        return { id: floor.floorId, name: floor.floorName } as KVP;
      }),
      floorsMaster: floorResponse,
    } as initializeDataType;
    setBookingServiceDetials(updatedBookingServiceDetails);
    setBookingRecoilServiceDetails(updatedBookingServiceDetails);
  };

  const handleAllDaysChange = () => {
    setAllDays((prev) => !prev);
    if (!allDays) {
      const _startDate = moment((startDate! as any).$d).format(
        "YYYY-MM-DD 09:00:00"
      );
      const _endDate = moment((endDate! as any).$d).format(
        "YYYY-MM-DD 18:00:00"
      );
      setStartDate(_startDate);
      setEndDate(_endDate);
      setSelectedEndDate(endDate);
      setSelectedStartDate(startDate);
    } else {
      setStartDate(selectedStartDate);
      setEndDate(selectedEndDate);
    }
  };

  // const navigate = useNavigate();
  return (
    <RecoilRoot>
      <Layout>
        <div>
          <h2 className="text-xl font-bold">Book Room</h2>
          <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
            {" "}
            Check availabilty{" "}
          </span>
        </div>
        <FormGroup>
          <div className="text-sm mt-4 max-w-xl mx-auto mb-20">
          <div className="flex justify-end">
          <Button
            variant="text"
            className="normal-case"
            onClick={() => onMakeRecurring()}
          >
            Make Recurring
          </Button>
          </div>
            <div className="flex gap-[20px] py-4 sm:flex-col">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allDays}
                    onChange={() => {
                      handleAllDaysChange();
                    }}
                  />
                }
                label="All Day"
                className="w-full"
              />
              <FormControl
                fullWidth
                sx={{ margin: "20px 0px 0px 0px" }}
                size="small"
                className="w-full"
              >
                <InputLabel id="reminderLabel">Reminder</InputLabel>
                <Select
                  labelId="reminderLabel"
                  label="Reminders"
                  className="text-sm"
                  onChange={(e) => {
                    setReminder(parseInt(e.target.value + ""));
                  }}
                >
                  {roomData.reminders.map((x) => {
                    return (
                      <MenuItem value={x.name} key={x.id}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="flex sm:flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex justify-between gap-[20px] sm:flex-col">
                <FormControl fullWidth size="small">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Date & Start Time"
                    value={startDate}
                    disabled={allDays}
                    onChange={(newValue) => {
                      if (newValue) {
                        setStartDate(newValue);
                        // Ensure newValue is a dayjs object and use add to calculate end date
                        const formattedEndDate = dayjs(newValue).add(30, 'minute').format("YYYY-MM-DD hh:mm:ss a");
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
                    disabled={allDays}
                    onChange={(newValue) => {
                      if (newValue) {
                        // Ensure newValue is a dayjs object and format it before storing
                        const formattedNewEndDate = newValue.format("YYYY-MM-DD hh:mm:ss a");
                        setEndDate(formattedNewEndDate);
                      }
                    }}
                  />
                </FormControl>
              </div>
            </LocalizationProvider>
            </div>
            <div className="flex flex-col py-2">
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <InputLabel id="locationLabel">Organization</InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Location"
                  value={location}
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleLocationChange(e.target.value)
                  }
                >
                  {bookingServiceDetails?.locations?.map((x) => {
                    return (
                      <MenuItem value={x.id} key={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <InputLabel id="buildingLabel">Building</InputLabel>
                <Select
                  labelId="buildingLabel"
                  label="Building"
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleBuildingChange(e.target.value)
                  }
                >
                  {bookingServiceDetails?.buildings?.map((x) => {
                    return (
                      <MenuItem value={x.id} key={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <InputLabel id="floorLabel">Floor</InputLabel>
                <Select
                  labelId="builfloorLabeldingLabel"
                  label="Floor"
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFloor(e.target.value)
                  }
                >
                  {bookingServiceDetails?.floors?.map((x) => {
                    return (
                      <MenuItem value={x.id} key={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ margin: "20px 20px 0px 0px" }}
                size="small"
              >
                <TextField
                  id="attendies"
                  label="No. of attendies"
                  variant="outlined"
                  value={attendies}
                  onChange={handleChange}
                />
              </FormControl>
              <br></br>
              <div className="flex sm:flex-col gap-4">
                <Button variant="outlined" className="flex-1 w-64">
                  Clear
                </Button>
                <Button
                  variant="contained"
                  className="flex-1 w-64"
                  onClick={() => onSearchClick()}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </FormGroup>
      </Layout>
      <DialogModal
        open={isRecurringDialog}
        onClose={() => {
          setIsRecurringDialog(false);
        }}
        modalTitle="Appointment Recurrence"
      >
        <SetRecurringModal
          onClose={() => {
            setIsRecurringDialog(false);
          }}
          modalFrom="bookService"
        ></SetRecurringModal>
      </DialogModal>
    </RecoilRoot>
  );
};
export default BookRoom;

import Layout from "../../components/Layout";
import InputBox from "../../components/features/InputBox/InputBox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
// import FormInput from '../components/FormInput';
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
import React, { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Button, Stack } from "@mui/material";
// import SpaceContext, {
//   initializeDataType,
// } from "../../context/BookSpaceContext";
import Router from "next/router";
import {
  IBuilding,
  IFloor,
  IOrganization,
  ISearchBookingRoom,
  initializeDataType,
} from "./types/bookSpace";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import { bookRoomState, searchBookRoomState } from "../_app";
import {
  getBuildingByOrgId,
  getFloorByBuildingId,
  getOrganizationById,
} from "../../services/bookSpace.service";
import { KVP } from "../../models/masters/Industry";

export const shift = {
  fHalf: {
    startHour: "9",
    endHour: "13",
  },
  sHalf: {
    startHour: "13",
    endHour: "18",
  },
  fullDay: {
    startHour: "9",
    endHour: "18",
  },
};

const BookDesk = () => {
  const [bookingServiceDetails, setBookingServiceDetials] =
    useState<initializeDataType>({} as initializeDataType);
  const bookingRecoilServiceDetails = useRecoilState(bookRoomState);
  const searchBookingRoomRecoil = useSetRecoilState(searchBookRoomState);
  const setBookingRecoilServiceDetails = useSetRecoilState(bookRoomState);
  const [dayShift, setDayShift] = useState("fullDay");
  // const spaceContextValue = React.useContext(SpaceContext);
  const [startDate, setStartDate] = React.useState<string>(
    dayjs()
      .startOf("day")
      .add(shift[dayShift]?.startHour, "h")
      .format("YYYY-MM-DD hh:mm:ss a")
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs()
      .startOf("day")
      .add(shift[dayShift]?.endHour, "h")
      .format("YYYY-MM-DD hh:mm:ss a")
  );
  const [selectedStartDate, setSelectedStartDate] = React.useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = React.useState<string>("");
  const [location, setLocation] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [allDays, setAllDays] = useState<boolean>(false);
  const [remainder, setReminder] = useState(0);

const fetchMyApi = useCallback(async () => {
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
  }, [bookingServiceDetails]);  
  useEffect(() => {
    fetchMyApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchClick = () => {
    const searchInfo: ISearchBookingRoom = {
      startDate: dayjs(startDate).format("YYYY-MM-DD hh:mm:01"),
      endDate: dayjs(endDate).format("YYYY-MM-DD hh:mm:00"),
      orgId: location,
      buildingId: building,
      attendies: 1,
      floorId: floor,
      allDays: allDays,
      reminder: remainder,
      space_type_id:3,
    };
    searchBookingRoomRecoil(searchInfo);
    Router.push("bookDesk/searchList");
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
      const _startDate = dayjs(startDate).format("YYYY-MM-DD 09:00:00");
      const _endDate = dayjs(endDate).format("YYYY-MM-DD 18:00:00");
      setStartDate(_startDate);
      setEndDate(_endDate);
      setSelectedEndDate(endDate);
      setSelectedStartDate(startDate);
      setDayShift("fullDay");
    } else {
      setStartDate(selectedStartDate);
      setEndDate(selectedEndDate);
    }
  };
  // const []

  return (
    <RecoilRoot>
      <Layout>
        <div>
          <h2 className="text-xl font-bold">Book Desk</h2>
          <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
            {" "}
            Check availabilty{" "}
          </span>
        </div>
        <FormGroup>
          <div className="text-sm mt-4 max-w-xl mx-auto mb-20">
            <div className="py-4">
              <RadioGroup
                className="flex justify-between sm:flex-col"
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue={dayShift}
                name="row-radio-buttons-group"
                value={dayShift}
                onChange={(e) => {
                  setDayShift(e.currentTarget.value);
                  setStartDate(
                    dayjs()
                      .startOf("day")
                      .add(shift[e.currentTarget.value]?.startHour, "h")
                      .format("YYYY-MM-DD hh:mm:ss a")
                  );
                  setEndDate(
                    dayjs()
                      .startOf("day")
                      .add(shift[e.currentTarget.value]?.endHour, "h")
                      .format("YYYY-MM-DD hh:mm:ss a")
                  );
                }}              >
                <FormControlLabel
                  value="fullDay"
                  control={<Radio />}
                  label="Full Day"
                  disabled={allDays}
                />
                <FormControlLabel
                  value="fHalf"
                  control={<Radio />}
                  label="First Half"
                  disabled={allDays}
                />
                <FormControlLabel
                  value="sHalf"
                  control={<Radio />}
                  label="second Half"
                  disabled={allDays}
                />
              </RadioGroup>
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
                  {roomData.reminders.map((x, i) => {
                    return (
                      <MenuItem key={i} value={x.id}>
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
                  <FormControl size="small">
                    <DateTimePicker
                    renderInput={(props) => (
                      <TextField {...props} className="text-sm" />
                    )}
                    label="Start Date & Start Time"
                    value={startDate}
                    disabled={allDays}
                    onChange={(newValue) => {
                      if (newValue) {
                        setStartDate(
                          dayjs(newValue).format("MM/DD/YYYY hh:mm:ss A")
                        );
                      }
                    }}
                    />
                  </FormControl>
                  <FormControl size="small">
                    <DateTimePicker
                    className="text-sm"
                    renderInput={(props) => <TextField {...props} />}
                    label="End Date & End Time"
                    value={endDate}
                    disabled={allDays}
                    onChange={(newValue) => {
                      if (newValue) {
                        setEndDate(
                          dayjs(newValue).format("MM/DD/YYYY hh:mm:ss A")
                        );
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
                <InputLabel id="locationLabel">Location</InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Location"
                  className="text-sm"
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
                  className="text-sm"
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
                  className="text-sm"
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
            </div>
            <br></br>
            <div className="flex sm:flex-col gap-4 ">
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
        </FormGroup>
      </Layout>
    </RecoilRoot>
  );
};
export default BookDesk;

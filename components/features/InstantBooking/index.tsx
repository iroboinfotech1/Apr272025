import {
  Card,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../common/Button";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Space from "../../../models/spacemgmt/space";
import SpaceService from "../../../services/space.service";
import moment from "moment";
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
type InstantBookingProps = {
  spaceId: number;
  startDate: string;
  endDate: string;
  setSpaceId: (spaceId: number) => void;
  setStartDate: (startDate: string ) => void;
  setEndDate: (endDate: string) => void;
  getNewMeetingData: () => void;
};

function InstantBooking({ spaceId, startDate, endDate, setSpaceId, setStartDate, setEndDate, getNewMeetingData }: InstantBookingProps) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allDays, setAllDays] = useState<boolean>(false);
  
  useEffect(() => {
    function getData(){
    SpaceService.getAll().then((response) => {
      if (response.status === true) {
        setSpaces(response.data);
      }
    });
  }
    getData()
  }
  , []);

  return (
    <Card className="min-h-[110px] border shadow w-full flex items-center justify-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale={navigator.language.toLocaleLowerCase()}>
        <div className="flex gap-2 mx-4 w-full sm:flex-col sm:gap-4 sm:py-4">
          <FormControl className="w-[30%] sm:w-full">
            <InputLabel id="demo-simple-select-helper-label">
              Select Space
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Select Space"
              size="small"
              title="Select Space"
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value as number)}
              >
              {spaces.map((space) => (
                <MenuItem key={space.spaceId} value={space.spaceId}>
                  {space.spaceAliasName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

         <DateTimePicker className="text-sm instant-booking w-[30%] sm:w-full"
            renderInput={(props) => <TextField {...props} />}
            label="Start Date & Start Time"
            value={dayjs(startDate)}
            disabled={allDays}
            onChange={(newValue) => {
              if (newValue) {
                const formattedNewStartDate = newValue.format("YYYY-MM-DD hh:mm:ss a");
                setStartDate(formattedNewStartDate);
                // Ensure newValue is a dayjs object and use add to calculate end date
                const formattedEndDate = dayjs(newValue).add(30, 'minute').format("YYYY-MM-DD hh:mm:ss a");
                setStartDate(formattedEndDate); // Store formatted string for endDate
              }
            }}
          />
           <DateTimePicker
                className="text-sm instant-booking w-[30%] sm:w-full"
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
          <button className="btn btn-primary min-w-[100px] w-[10%] sm:w-full text-sm"
          onClick={() => getNewMeetingData()}
          >Find Space</button>
        </div>
      </LocalizationProvider>
    </Card>
  );
}

export default InstantBooking;

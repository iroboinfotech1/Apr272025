import dayjs from "dayjs";
import { createContext } from "react";
import { KVP } from "../models/masters/Industry";


export type initializeDataType = {
  locations?: KVP[];
  buildings?: KVP[];
  floors?: KVP[];
  reminders?: KVP[];
  IsDataAvailable?: boolean;
  mapDetails?: KVP[];
};

export const initialvalue = {
  isBookSpaceMenu: false,
  selectedMenu: -1,
  bookingServiceDetails: null,
  bookRoomInfo: {
    location: "",
    building: "",
    floor: "",
    startDate: dayjs("2022-04-07"),
    endDate: dayjs("2022-04-07"),
    attendies: "",

  },
};
type spaceContextDataType = {
  bookingServiceDetails: initializeDataType | null;
  isBookSpaceMenu: boolean;
  selectedMenu: number;
  bookRoomInfo: {
    location: string;
    building: string;
    floor: string;
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
    attendies: string;
  };
};
const SpaceContext = createContext<spaceContextDataType>(initialvalue);
export default SpaceContext;

import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/globals.css";
import "primereact/resources/themes/md-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import "../styles/prime-react-overwrite.css";

import type { AppProps } from "next/app";
import { RecoilRoot, atom, useSetRecoilState } from "recoil";
import {
  IAvailableFloorDetail,
  IAvailableSpaceDetail,
  IBookDeskDetail,
  IBookMeeting,
  IBookMeetingForm,
  IBookParking,
  IBookedMeetingAndDesk,
  IFlowFlag,
  IMeetingService,
  ISearchBookingRoom,
  initializeDataType,
  IManageVisitor,
} from "./bookSpaces/types/bookSpace";

export const bookRoomState = atom<initializeDataType>({
  key: "bookingRoom",
  default: {} as initializeDataType,
});

export const searchBookRoomState = atom<ISearchBookingRoom>({
  key: "searchBookingRoom",
  default: {
    startDate: null,
    endDate: null,
    orgId: "",
    buildingId: "",
    attendies: 0,
    floorId: "",
    allDays: false,
  } as ISearchBookingRoom,
});

export const selectedRoomState = atom<IAvailableSpaceDetail[]>({
  key: "selectedRoomState",
  default: [],
});

export const bookMeetingState = atom<IBookMeeting>({
  key: "bookMeeting",
  default: {} as IBookMeeting,
});

export const bookDeskState = atom<IBookDeskDetail>({
  key: "bookDesk",
  default: {} as IBookDeskDetail,
});

export const manageVisitorState = atom<IManageVisitor>({
  key: "ManageVisitor",
  default: {} as IManageVisitor,
});

export const selectedCardDetailState = atom<IBookedMeetingAndDesk>({
  key: "selectedCardDetail",
  default: {} as IBookedMeetingAndDesk,
});

export const selectedParkingSlotState = atom<IBookParking[]>({
  key: "selectedParkingSlot",
  default: [] as IBookParking[],
});

export const flowFlagState = atom<IFlowFlag>({
  key: "flowFlag",
  default: {} as IFlowFlag,
});

export const selectedDeskState = atom<IAvailableSpaceDetail>({
  key: "selectedDesk",
  default: {} as IAvailableSpaceDetail,
});

export const bookMeetingFormState = atom<IBookMeetingForm>({
  key: "bookMeetingFormDetails",
  default: {
    allDays: false,
    meetingName: "",
    meetingType: 0,
    notes: "",
    participants: [],
    referenceNumber: "",
    reminder: 0,
  } as IBookMeetingForm,
});

export const selectedMeetingServiceState = atom<IMeetingService[]>({
  key: "selectedMeetingService",
  default: [] as IMeetingService[],
});

export const selectedBookingDetails = atom<IBookedMeetingAndDesk>({
  key: "selectedBookingDetails",
  default: {} as IBookedMeetingAndDesk,
});
// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }
// import { AuthProvider } from "../context/AuthContext";
// export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
//   return (
//       <AuthProvider>
//         <RecoilRoot>
//           <Component {...pageProps} />
//         </RecoilRoot>
//       </AuthProvider>
//   );
// }

import { SessionProvider } from "next-auth/react";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}


import { SpaceManagementEndPoint as http } from "./http-common";

import {
  IBuilding,
  IFloor,
  IOrganization,
  IResponse,
  IAvailableSpaceDetail,
  ISearchBookingRoom,
  IBookMeetingDetail,
  IBookedMeetingAndDesk,
  IMeetingService,
  IBookParking,
  IDesk,
  ISpace,
  IBookDeskDetail,
  IBookMeetingByMeetingId,
} from "../pages/bookSpaces/types/bookSpace";
import dayjs from "dayjs";

const getOrganizationById = async (): Promise<IOrganization[]> => {
  const result = await http.get<IResponse<IOrganization[]>>(
    "api/SMSService/Organizations/getList"
  );
  return result.data.data;
};

const getBuildingByOrgId = async (orgId: string): Promise<IBuilding[]> => {
  const result = await http.get<IResponse<IBuilding[]>>(
    `api/SMSService/Buildings/getBuildingsbyOrg?id=${orgId}`
  );
  return result.data.data;
};

const getFloorByBuildingId = async (buildingId: string): Promise<IFloor[]> => {
  const result = await http.get<IResponse<IFloor[]>>(
    `api/SMSService/Floors/GetFloorByBuilding?id=${buildingId}`
  );
  return result.data.data;
};

const getSpaceByFloorId = async (floorId: number): Promise<ISpace[]> => {
  const result = await http.post<IResponse<ISpace[]>>(
    `api/SMSService/Spaces/GetSpacebyFloorId?floorid=${floorId}`
  );
  return result.data.data;
};
const getSpaceBySpaceId = async (spaceId: number): Promise<ISpace> => {
  const result = await http.get<IResponse<ISpace>>(
    `api/SMSService/Spaces/${spaceId}`
  );
  return result.data.data;
};

const getSpaceBySearchCriteria = async (
  serachCriteria: ISearchBookingRoom
): Promise<IAvailableSpaceDetail[]> => {
  const result = await http.post<IResponse<IAvailableSpaceDetail[]>>(
    `api/SMSService/Spaces/GetAvailableSpace`,
    serachCriteria
  );
  return result.data.data;
};

const getAvailableMeeting = async () => {
  const result = await http.get<IResponse<IBookedMeetingAndDesk[]>>(
    `api/SMSService/BookMeeting`
  );
  //return transformResponse(mockResponse);
  return result.data.data;
};
const getAvailableMeetingWithParams = async (
  query : any ) => {
  const strQuery = Object.keys(query).map((key) => key + "=" + query[key]).join("&");
  const result = await http.get<IResponse<IBookedMeetingAndDesk[]>>(
    `api/SMSService/BookMeeting?${strQuery}`
  );
  return result.data.data;
}
const transformResponse = (response: any): IBookedMeetingAndDesk[] => {
  return response.data.map((item: any) => ({
    meetingId: item.meetingId,
    meetingName: item.meetingName,
    spaceName: item.spaceName,
    buildingName: item.buildingName,
    floorName: item.floorName,
    orgName: item.orgName,
    noOfAttendees: item.noOfAttendees,
    startDate: item.startDate,
    endDate: item.endDate,
    spaceResources: item.spaceresourcesList.map((res: any) => ({
      resourceId: res.resourceId,
      resourceCount: res.resourceCount,
      resourceIcon: res.resourceIcon,
      resourceName: res.resourceName,
    })),
    image: item.image,
  }));
};

const getAvailableMeetingMock = async () => {
  return transformResponse(mockResponse);
  //return mockResponse;
};
const getBookedServicesByMeetingId = async (meetingId: number) => {
  const result = await http.get<IResponse<IMeetingService[]>>(
    `api/SMSService/BookServices/GetBookServices/${meetingId}`
  );
  return result.data.data;
};

const getBookedParkingsByMeetingId = async (meetingId: number) => {
  const result = await http.get<IResponse<IBookParking[]>>(
    `api/SMSService/BookParking/${meetingId}`
  );
  return result.data.data;
};

const getServicesOnDemand = async () => {
  // Yet to be implemented
};

const updateBookedService = async (services: IMeetingService[]) => {
  await http.post("api/SMSService/BookServices/UpdateBookServices", services);
};

const updateParking = async (parking: IBookParking) => {
  await http.post("api/SMSService/BookParking", parking);
};

const bookMeeting = async (
  data: IBookMeetingDetail
): Promise<IBookMeetingDetail> => {
  const response = await http.post<IResponse<IBookMeetingDetail>>(
    `api/SMSService/BookMeeting`,
    data
  );
  return response.data.data;
};

const bookDesk = async (data: IBookDeskDetail): Promise<IBookDeskDetail> => {
  const response = await http.post<IResponse<IBookDeskDetail>>(
    `api/SMSService/BookMeeting/CreateDeskBooking`,
    data
  );
  return response.data.data;
};

const getAvailableDesk = async (
  request: ISearchBookingRoom
): Promise<IAvailableSpaceDetail[]> => {
  const response = await http.post<IResponse<IAvailableSpaceDetail[]>>(
    `api/SMSService/Desks/GetDesk`,
    request
  );
  return response.data.data;
};

const mockResponse = {
  data: [
    {
      spaceId: 31,
      meetingId: 68,
      meetingName: "Meeting with Rajinikanth",
      spaceName: "TESLA PARKING",
      floorName: "TeslaFloor1",
      buildingName: "TESLA BUILDING",
      orgName: "TESLA",
      image: null,
      startDate: "2024-07-06T07:33:10",
      endDate: "2024-07-06T07:33:10",
      noOfAttendees: 1,
      spaceresourcesList: [
        {
          spaceId: 31,
          resourceId: 100,
          resourceCount: 6,
          resourceIcon: null,
          resourceName: "Chair",
        },
        {
          spaceId: 31,
          resourceId: 105,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "Table",
        },
        {
          spaceId: 31,
          resourceId: 110,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "WIFI",
        },
      ],
    },
    {
      spaceId: 31,
      meetingId: 69,
      meetingName: "Meeting with Elon Musk",
      spaceName: "TESLA PARKING",
      floorName: "TeslaFloor1",
      buildingName: "TESLA BUILDING",
      orgName: "TESLA",
      image: null,
      startDate: "2024-07-06T19:23:01",
      endDate: "2024-07-06T19:55:00",
      noOfAttendees: 1,
      spaceresourcesList: [
        {
          spaceId: 31,
          resourceId: 100,
          resourceCount: 6,
          resourceIcon: null,
          resourceName: "Chair",
        },
        {
          spaceId: 31,
          resourceId: 105,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "Table",
        },
        {
          spaceId: 31,
          resourceId: 110,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "WIFI",
        },
      ],
    },
    {
      spaceId: 31,
      meetingId: 72,
      meetingName: "Meeting with Arun Musk",
      spaceName: "TESLA PARKING",
      floorName: "TeslaFloor1",
      buildingName: "TESLA BUILDING",
      orgName: "TESLA",
      image: null,
      startDate: "2024-07-06T19:30:01",
      endDate: "2024-07-06T19:55:00",
      noOfAttendees: 1,
      spaceresourcesList: [
        {
          spaceId: 31,
          resourceId: 100,
          resourceCount: 6,
          resourceIcon: null,
          resourceName: "Chair",
        },
        {
          spaceId: 31,
          resourceId: 105,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "Table",
        },
        {
          spaceId: 31,
          resourceId: 110,
          resourceCount: 1,
          resourceIcon: null,
          resourceName: "WIFI",
        },
      ],
    },
  ],
  statusCode: 200,
  status: true,
  message: "Record Found",
};

// Utility function to filter current meeting IDs
const getCurrentMeetingIds = (bookedMeetingDetails: IBookMeetingByMeetingId): string[] => {
  return Object.keys(bookedMeetingDetails).filter((meetingId: string) => {
    const currentMeetingDuration = dayjs(bookedMeetingDetails[meetingId].startDate).diff(dayjs(), 'minutes');
    const totalMeetingDuration = dayjs(bookedMeetingDetails[meetingId].startDate).diff(bookedMeetingDetails[meetingId].endDate, 'minutes');
    return currentMeetingDuration <= 0 && currentMeetingDuration > totalMeetingDuration;
  });
};

// Utility function to filter past meeting IDs
const getPastMeetingIds = (bookedMeetingDetails: IBookMeetingByMeetingId): string[] => {
  return Object.keys(bookedMeetingDetails).filter((meetingId: string) => {
    const currentMeetingDuration = dayjs(bookedMeetingDetails[meetingId].startDate).diff(dayjs(), 'minutes');
    const totalMeetingDuration = dayjs(bookedMeetingDetails[meetingId].startDate).diff(bookedMeetingDetails[meetingId].endDate, 'minutes');
    return currentMeetingDuration < 0 && currentMeetingDuration <= totalMeetingDuration;
  });
};
export {
  getOrganizationById,
  getBuildingByOrgId,
  getFloorByBuildingId,
  getSpaceByFloorId,
  getSpaceBySpaceId,
  getSpaceBySearchCriteria,
  getAvailableMeetingMock,
  bookMeeting,
  getAvailableMeeting,
  getBookedServicesByMeetingId,
  updateBookedService,
  getServicesOnDemand,
  getBookedParkingsByMeetingId,
  updateParking,
  getAvailableDesk,
  getPastMeetingIds,
  getCurrentMeetingIds,
  bookDesk,
  getAvailableMeetingWithParams,
};

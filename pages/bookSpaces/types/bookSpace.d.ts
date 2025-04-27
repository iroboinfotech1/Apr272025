import dayjs from "dayjs";

export interface IResponse<T> {
  data: T;
  message: string;
  status: boolean;
  statusCode: number;
}

export interface IOrganization {
  orgId: number;
  orgGuid: string;
  orgName: string;
  industry?: string;
  buildingName?: string;
  mailingAddress?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  image?: string;
  logo?: string;
  countryId: number;
  countryName?: string | null;
  stateId: number;
  stateName?: string;
  cityId: number;
  cityName?: string | null;
}

export interface IBuilding {
  buildingId: number;
  buildingName: string;
  orgId: number;
  groupName: string;
  address: string;
  supportingFacilities: number[];
  floors: IFloor[];
  organization?: IOrganization;
}

export interface IFloor {
  floorId: number;
  buildingId: number;
  floorName: string;
  floorPlan: string;
}

export interface ISearchBookingRoom {
  startDate: string | null;
  endDate: string | null;
  orgId: string;
  buildingId: string;
  attendies: number;
  floorId: string;
  allDays: boolean;
  reminder: number;
  space_type_id :number;
}

export interface IAvailableFloorDetail {
  floorName: string;
  floorId: number;
  floorImage?: string;
  availableSpaceDetails: { [key: string]: IAvailableSpaceDetail };
}

export interface IAvailableSpaceDetail {
  spaceId: number;
  floorId: number;
  floorName: string;
  buildingId: number;
  orgId: number;
  spaceType: string;
  spaceName: string;
  coordinates: string;
  startDate?: string;
  endDate?: string;
  organisationImage?: string;
  buildingName?: string;
  address?: string;
  isAvailable?: boolean;
  resourceId?: number;
  resourceIcon?: string;
  facilityId: number;
  facilityName?: string;
  spaceResources?: ISpaceResource[];
  floorImage?: string;
  resourceCount: number;
  isEditMode?: boolean;
}

export interface ISpaceResource {
  resourceId?: number;
  resourceIcon?: string;
  facilityId: number;
  facilityName?: string;
  resourceCount: number;
}

export interface IFacilityResource {
  resourceId: number;
  name: string;
  facilityId: number;
  type: string;
  isEnabled: boolean;
  icon: string;
  resourceCount: number;
}

export interface ISpace {
  spaceId: number;
  floorId: number;
  buildingId: number;
  orgId: number;
  spaceAliasName: string;
  mappedCalendarIds: number[];
  email: string;
  directionNotes: string;
  servicingFacilities: int[];
  coordinates: string;
  workweekdays: string[];
  startTime: string;
  endTime: string;
  resources: any;
  role: any;
  spaceType: string;
}

export interface IFloorSlot {
  id: string;
  isAvailable: boolean;
  left: string;
  top: string;
}

export interface IFloorViewer {
  imageSrc?: string | ArrayBuffer;
  floorSlots: IFloorSlot[];
  onSlotClick: (slotId: string) => void;
  selectedSlots: IBookParking[];
}

export interface IBookSpaceFloorViewer {
  //imageSrc?: string | ArrayBuffer;
  imageSrc?: any;
  coordinates?: string;
  floorSlots: IParkingSlot[];
  onSlotClick: (slotId: string) => void;
  onImageClick: () => void;
  selectedSlots: IBookParking[];
}

export interface initializeDataType {
  locations?: KVP[];
  buildings?: KVP[];
  floors?: KVP[];
  reminders?: KVP[];
  IsDataAvailable?: boolean;
  mapDetails?: KVP[];
  floorsMaster?: IFloor[];
}

export interface IBookMeetingDetail {
  meeting: IBookMeeting;
  services?: IMeetingService[];
  parkings: IBookParking[];
}

export interface IBookDeskDetail {
  desk: IBookDesk;
  services?: IMeetingService[];
  parkings?: IBookParking[];
}

export interface IBookDesk {
  alldays: boolean;
  reminder: number;
  startDateTime: string;
  endDateTime: string;
  orgId: number;
  buildingId: number;
  floorId: number;
  deskId: number;
  deskName: string;
  referenceNumber?: string;
  meetingId?: number;
  userId: number;
  userName: string;
  timezone:string;
}

export interface IBookMeetingForm {
  allDays: boolean;
  noOfAttendees?: number;
  meetingName: string;
  reminder: number;
  meetingType: number;
  notes: string;
  participants: string[];
  referenceNumber: string;
}

export interface IDesk {
  id: number;
  name: string;
  spaceId: number;
  deskCoordinated: string;
  floor: IFloor;
  building: IBuilding;
  organization: IOrganization;
  facilityResource: IFacilityResource;
  space: ISpace;
}

export interface IMeetingService {
  meetingId?: number;
  serviceId: number;
  serviceCount: number;
  action: string;
}

export interface IBookParking {
  parkingId?: number;
  meetingId?: number;
  participantName: string;
  participantId: number;
  vechicleNumber: string;
  slotId: number;
  slotName: string;
}

export interface IParkingDetail {
  floorDetails: IParkingFloor[];
}

export interface IParkingFloor {
  floorName: string;
  floorId: string;
  parkingSlots: IParkingSlot[];
  imageData: string | ArrayBuffer | null;
}

export interface IParkingSlot {
  top: string;
  left: string;
  isAvailable: boolean;
  id: string;
  name: string;
}

export interface IFlowFlag {
  isFlowFromBookSpace: boolean;
  isFlowFromBookDesk: boolean;
  isFlowFromManageVisitor: boolean;
}

export interface IService {
  serviceId: number;
  serviceCount: number;
}

export interface IBookMeeting {
  meetingId?: number;
  action: string;
  spaceId: number;
  allDays: boolean;
  reminder: number;
  meetingType: number;
  startDateTime: string;
  endDateTime: string;
  buildingId: number;
  floorId: number;
  noOfAttendees: number;
  meetingName: string;
  orgId: number;
  referenceNumber?: string;
  participants: strig;
  notes: string;
  timezone: string;
}

export interface IBookedSpaceResource {
  resourceId: number;
  resourceCount: number;
  resourceIcon: string;
  resourceName: string;
}

export interface IBookedMeetingAndDesk {
  address: string;
  meetingId: number;
  meetingName: string;
  spaceName: string;
  buildingName: string;
  floorName: string;
  orgName: string;
  noOfAttendees: number;
  participants: string[];
  startDate: string;
  endDate: string;
  spaceResources: IBookedSpaceResource[];
  image: string;
  resourceId: number;
  resourceIcon: string;
  resourceName: string;
  resourceCount: number;
  notes: string;
  spaceId:number;
  spaceImage:string;
}

export interface IManageVisitor {
  location: number;
  startDate: string;
  endDate: string;
  personToMeetId: number;
  personToMeetName: string;
  purposeOfVisit: string;
  covidPositiveStatus: boolean;
  covidQuestion2: boolean;
}

export interface IBookMeetingByMeetingId {
  [key: number]: IBookedMeetingAndDesk;
}

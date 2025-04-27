import Building from "./building";
import Organization from "./organization";

export default interface Space {
    spaceId: number;
    floorId: number;
    floorName: string;
    floorPlan: string;
    buildingId: number;
    orgId: number;
    spaceType: string;
    spaceAliasName?: any;
    groupname?:any;
    mappedConnectorIds?: any;
    mappedCalendarIds?: any;
    email?: any;
    directionNotes?: any;
    servicingFacilities?: any;
    coordinates?: any;
    workweekdays?: string;
    startTime?: any;
    endTime?: any;
    resources?: any;
    role?: any;
    organization: Organization;
    building: Building;
    allowRepeat?:boolean,
    allowWorkHours?:boolean,
    autoDecline:boolean,
    maximumDuration:string,
    autoAccept:boolean,
}
export interface SpaceType{
    
}
import Organization from "./organization";

export default interface Building {
    floors: any;
    buildingId: number;
    buildingName: string;
    orgId: number;
    address: string;
    groupName: string;
    organization: Organization;
}
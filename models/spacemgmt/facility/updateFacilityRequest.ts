export interface UpdateFacilityRequest {
    facilityId: number;
    facilityName: string;
    email: string;
    escalationPeriod: number;
    escalationEmail: string;
    notifyFacilities: boolean;
    notifyOrganizer: boolean;

}
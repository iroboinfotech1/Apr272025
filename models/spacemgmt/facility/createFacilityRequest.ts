export interface CreateFacilityRequest {
    facilityName: string;
    email: string;
    escalationPeriod: number;
    escalationEmail: string;
    notifyFacilities: boolean;
    notifyOrganizer: boolean;
    orgId: number;
}
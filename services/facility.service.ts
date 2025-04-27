import { UpdateFacilityRequest } from './../models/spacemgmt/facility/updateFacilityRequest';
import { CreateFacilityRequest } from './../models/spacemgmt/facility/createFacilityRequest';
import http from "./http-common";
import ApiResponse from "../models/ApiResponse";
import { Resource } from '../models/spacemgmt/facility/FacilityModel';

const create = (request: CreateFacilityRequest) => {
    return http.post<ApiResponse>("api/SMSService/facilities", request)
        .then(res => res.data);
}

const update = (request: UpdateFacilityRequest) => {
    return http.put<ApiResponse>("api/SMSService/facilities", request)
        .then(res => res.data);
}

const get = (id: number) => {
    return http.get<ApiResponse>("api/SMSService/facilities/" + id)
        .then(res => res.data);
}

const deleteByFacilityId = (id: number) => {
    return http.delete<ApiResponse>("api/SMSService/facilities/" + id)
        .then(res => res.data);
}

const getByOrgId = (orgId: number) => {
    return http.get<ApiResponse>("api/SMSService/facilities/getByOrganization/" + orgId)
        .then(res => res.data);
}

const getByOrgIdAndFacilityTypeId = (orgId: number,facilityTypeId : number) => {
    return http.get<ApiResponse>("api/SMSService/facilities/GetByOrganizationAndFacilityType/" + orgId + "/" + facilityTypeId)
        .then(res => res.data);
}

const GetAllFacilityTypes = () => {
    return http.get<ApiResponse>("api/SMSService/facilities/GetAllFacilityTypes")
        .then(res => res.data);
}

const getAll = () => {
    return http.get<ApiResponse>("api/SMSService/facilities/getall")
        .then(res => res.data);
}

const CreateResource = (request: Resource) => {
    return http.post<ApiResponse>("api/SMSService/Resources", request)
        .then(res => res.data);

}
const GetResourceList = (floorId: number) => {
    return http.get<ApiResponse>("api/SMSService/Resources/GetResourceList/" + floorId)
        .then(res => res.data);
}
const UpdateResourceStatus = (request: Resource) => {
    return http.put<ApiResponse>("api/SMSService/Resources/UpdateResourceStatus", request)
        .then(res => res.data);
}

const getFacilitiesById = (facilityId: number) => {
    return http.get<ApiResponse>("api/SMSService/facilities/GetFacilitiesById/" + facilityId)
        .then(res => res.data);
}

const FacilityService = {
    create,
    update,
    get,
    getByOrgId,
    getAll,
    CreateResource,
    deleteByFacilityId,
    GetResourceList,
    GetAllFacilityTypes,
    getByOrgIdAndFacilityTypeId,
    UpdateResourceStatus,
    getFacilitiesById
}

export default FacilityService
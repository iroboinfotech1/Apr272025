
//import http from "./http-common";
import ApiResponse from "../models/ApiResponse";
import http from 'axios';
import { API_BASE_URL } from "./config";
import { ConstantProperties } from "./properties";
import { Console } from "console";

const createOrgGeneralDetails = (request: any) => {
    return http.post<ApiResponse>(ConstantProperties.CREATE_ORG_URL, request)
        .then(res => res.data);
}

const updateOrgGeneralDetails = (request: any) => {
    return http.put<ApiResponse>(ConstantProperties.UPDATE_ORG_DETAILS_URL, request)
        .then(res => res.data);
}

const getList = () => {
    return http.get<ApiResponse>(ConstantProperties.GETLIST_ORG_URL)
        .then(res => res.data);
}

const deleteOrg = (id: number) => {
    return http.delete<ApiResponse>(ConstantProperties.DELETE_ORG_DETAILS_URL + id)
        .then(res => res.data);
}

const OrganizationService = {
    createOrgGeneralDetails,
    updateOrgGeneralDetails,
    getList,
    deleteOrg
}

export default OrganizationService
import { config } from './http-common';
import http from "./http-common";
import ApiResponse from "../models/ApiResponse";

const getIndustries = () => {
    return http.get<ApiResponse>("/api/SMSService/Industries", config).then(res => res.data);
}

const getCountries = () => {
    return http.get<ApiResponse>("/api/SMSService/Countries", config).then(res => res.data);
}


const getStates = (countryId: number) => {
    return http.get<ApiResponse>(`/api/SMSService/States/getByCountry/${countryId}`, config).then(res => res.data);
}

const getCities = (stateId: number) => {
    return http.get<ApiResponse>(`/api/SMSService/cities/getByState/${stateId}`, config).then(res => res.data);
}


const MasterService = {
    getIndustries,
    getCountries,
    getStates,
    getCities
}

export default MasterService
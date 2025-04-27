import http from "./http-common";
import ApiResponse from "../models/ApiResponse";

const getPlayerList = () => {
    return http.get<ApiResponse>("api/SMSService/PlayerManagement/")
        .then(res => res.data);
}

const getSpaces = () => {
    return http.get<ApiResponse>("api/SMSService/Spaces/")
        .then(res => res.data);
}

const getPlayerDetails = (id: string) => {
    return http.get<ApiResponse>("api/SMSService/PlayerManagement/" + id)
        .then(res => res.data);
}

const getPlayerSensitiveInformation = (serialNo: string) => {
    return http.get<ApiResponse>("api/SMSService/PlayerManagement/RetrievePlayerSensitiveInformation?serialNo=" + serialNo)
        .then(res => res.data);
}

const GetPlayerLogsBySerialNumber= (serialNo: string) => {
    return http.get<ApiResponse>("api/SMSService/PlayerManagement/GetPlayerLogsBySerialNumber?serialNo=" + serialNo)
        .then(res => res.data);
}

const addPlayer = (request: any) => {
    console.log("request ", request)
    return http.post<ApiResponse>("api/SMSService/PlayerManagement/", request)
        .then(res => res.data);
}

const updatePlayer = (request: any) => {
    console.log("request ", request)
    return http.put<ApiResponse>("api/SMSService/PlayerManagement/", request)
        .then(res => res.data);
}

const deletePlayer = (id: string) => {
    return http.delete<ApiResponse>("api/SMSService/PlayerManagement/" + id)
        .then(res => res.data);
}

const PlayerManagementService = {
    getPlayerList,
    getPlayerDetails,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerSensitiveInformation,
    getSpaces,
    GetPlayerLogsBySerialNumber
}


export default PlayerManagementService
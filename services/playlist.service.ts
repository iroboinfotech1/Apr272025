
import http from "./http-common";
import ApiResponse from "../models/ApiResponse";

//Users
const getAllPlayLists = () => {
    return http.get<ApiResponse>("api/SMSService/PlayList/")
        .then(res => res.data);
        //return UserList;
}

const getPlayListItems = (name: string) => {
    return http.get<ApiResponse>("api/SMSService/PlayList/" + name)
        .then(res => res.data);
}

const deletePlayList = (playListName: string) => {
    return http.delete<ApiResponse>("api/SMSService/PlayList/" + playListName)
        .then(res => res.data);
}

const deletePlayListItem = (id: number) => {
    return http.delete<ApiResponse>("api/SMSService/PlayList/" + id)
        .then(res => res.data);
}

const addPlayList = (request: any) => {
    console.log("request ", request)
    return http.post<ApiResponse>("api/SMSService/PlayList/", request)
        .then(res => res.data);
}

const updatePlayList = (request: any) => {
    console.log("request ", request)
    return http.put<ApiResponse>("api/SMSService/PlayList/", request)
        .then(res => res.data);
}

const PlayListService = {
    getAllPlayLists,
    getPlayListItems,
    addPlayList,
    updatePlayList,
    deletePlayList,
    deletePlayListItem
}

export default PlayListService;
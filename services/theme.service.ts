
import http from "./http-common";
import ApiResponse from "../models/ApiResponse";


const getAllThemes = () => {
    return http.get<ApiResponse>("api/SMSService/Theme/")
        .then(res => res.data);
}

const getThemeDetails = (id: number) => {
    return http.get<ApiResponse>("api/SMSService/Theme/GetById?id=" + id)
        .then(res => res.data);
}

const updateTheme = (request: any) => {
    console.log("request ", request)
    var payload = {
        id: request.id,
        themename: request.themename,
        themethumbnail: request.themethumbnail,
        themetype: request.themetype,
        logo:request.logo,
        background:request.background,
        themedata: JSON.stringify(request.themeData)
    }
    return http.put<ApiResponse>("api/SMSService/Theme/", payload)
        .then(res => res.data);
}

const addTheme = (request: any) => {
    console.log("request ", request)
    var payload = {
        id: request.id,
        themename: request.themename,
        themethumbnail: request.themethumbnail,
        themetype: request.themetype,
        logo:request.logo,
        background:request.background,
        themedata: JSON.stringify(request.themeData)
    }
    return http.post<ApiResponse>("api/SMSService/Theme/", payload)
        .then(res => res.data);
}

const upload = (FormData: FormData) => {
    console.log("request ", FormData)
    return http.post<ApiResponse>("api/SMSService/Theme/upload/", FormData)
        .then(res => res.data);
}

const deleteTheme = (id: number) => {
    return http.delete<ApiResponse>("api/SMSService/Theme/" + id)
        .then(res => res.data);
}

const ThemeService = {
    getAllThemes,
    getThemeDetails,
    updateTheme,
    addTheme,
    deleteTheme,
    upload
}

export default ThemeService;
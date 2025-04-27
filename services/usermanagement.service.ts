
import http from "./http-common";
import ApiResponse from "../models/ApiResponse";

//Users
const getuserlist = () => {
    return http.get<ApiResponse>("api/SMSService/UserManagement/")
        .then(res => res.data);
        //return UserList;
}

const getuserlistforVisitor = (accessToken, isvistor) => {
    return http
      .get<ApiResponse>(`api/SMSService/UserManagement?accessToken=${accessToken}&isvistor=${isvistor}`)
      .then((res) => res.data);
};

const getUser = (id: number) => {
    return http.get<ApiResponse>("api/SMSService/UserManagement/" + id)
        .then(res => res.data);
}

const deleteUser = (id: number) => {
    return http.delete<ApiResponse>("api/SMSService/UserManagement/" + id)
        .then(res => res.data);
}

const addUser = (request: any) => {
    console.log("request ", request)
    return http.post<ApiResponse>("api/SMSService/UserManagement/", request)
        .then(res => res.data);
}

const updateUser = (request: any) => {
    console.log("request ", request)
    return http.put<ApiResponse>("api/SMSService/UserManagement/", request)
        .then(res => res.data);
}

const getUserPreferences = (userid: any) => {
    console.log("getUserPreferences Request",userid);
    return http.post<ApiResponse>("api/SMSService/UserManagement/api/SMSService/UserManagement/GetUserPreferences?userid=" + userid)
        .then(res => res.data);
}

const createUserPreferences = (request: any) => {
    return http.post<ApiResponse>("api/SMSService/UserManagement/UserManagement/CreateUserPreferences/" , request)
        .then(res => res);
}

const updateUserPreferences = (request: any) => {
    console.log("updateUserPreferences Request",request);
    return http.put<ApiResponse>("api/SMSService/UserManagement/UserManagement/UpdateUserPreferences/" , request)
        .then(res => res);
}//Roles
const getroleslist = () => {
    return http.get<ApiResponse>("api/SMSService/UserManagement/Role/")
        .then(res => res.data);
    //return RolesandPermissionList;
}

const addRole = (request: any) => {
    console.log("request ", request)
    return http.post<ApiResponse>("api/SMSService/UserManagement/Role/", request)
        .then(res => res.data);
}

const getRoleDetails = (id: number) => {
    return http.get<ApiResponse>("api/SMSService/UserManagement/Role/" + id)
        .then(res => res.data);
}

const updateRole = (request: any) => {
    console.log("request ", request)
    return http.put<ApiResponse>("api/SMSService/UserManagement/Role/", request)
        .then(res => res.data);
}

const deleteRole = (id: number) => {
    return http.delete<ApiResponse>("api/SMSService/UserManagement/Role/" + id)
        .then(res => res.data);
}

const UsermanagementService = {
    getuserlist,
    getUser,
    getuserlistforVisitor,
    addUser,
    updateUser,
    deleteUser,
    getroleslist,
    addRole,
    getRoleDetails,
    updateRole,
    deleteRole,
    getUserPreferences,
    createUserPreferences,
    updateUserPreferences
    }
export const UserList = [
    {
        "userId": 1,
        "userName": "Test",
        "email": "test@gmail.com",
        "roleName": "Admin",
        "joined": "12/03/2013",
        "secretWord": "Test",
        "repeatSecretWord": "Test"
    }
]

export const RolesandPermissionList = [
    {
        role: "Admin",
        rolebase: "Features & Functions",
    }
]
export default UsermanagementService
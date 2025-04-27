import axios from "axios";

export default axios.create({
    baseURL: "/",
});
export const ConnectionManagementEndPoint = axios.create({
    baseURL: "/",
});
export const SpaceManagementEndPoint = axios.create({
    baseURL: "/",
});

export const config = { headers: { "Content-type": "application/json" },

connectionManagement:{
    baseURL: "/",
    AddCalender:"api/pixconnectors/connector/addcalendar",
    UpdateCalender:"api/pixconnectors/connector/updatecalendar",
    CreateConnectionFromFile:"api/pixconnectors/connector/createconnectionfromfile",
    DeleteCalender:"api/pixconnectors/connector/deletecalendar",
    CreateConnector:"api/pixconnectors/connector/create",
    UpdateConnector:"api/pixconnectors/connector/update",
    GetAllConnectors:"api/pixconnectors/connector/getall",
    GetConnectorByName:"api/pixconnectors/connector/getallbyname",
    deleteConnector:"api/pixconnectors/connector/delete"
}
};
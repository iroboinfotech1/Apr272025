import { ConnectionManagementEndPoint as http } from "./http-common";
import ApiResponse from "../models/ApiResponse";
import Meeting from "../models/connector/meeting";
import ConnectionDetails from "../models/connector/connectionDetails";
import CalendarDetails from "../models/connector/calendarDetails";
import DiscreteConnectionDetails from "../models/connector/discreteconnectionDetails";

const getCalenderInstances = (
  id: number,
  startTime: string,
  endTime: string
) => {
  if(id==undefined)
  {
    return new Promise<Meeting[]>((resolve, reject) => {
      reject("Invalid parameters");
    });
  } 
   return http
    .get<Meeting[]>(
      "api/pixconnectors/event/getinstances?calendarId=" +
        id +
        "&startTime=" +
        startTime +
        "&endTime=" +
        endTime
    )
    .then((res) => res.data);
};
const getSourceCalenders = (connectorName: string) => {
  return http
    .get<any[]>(
      "api/pixconnectors/connector/getcalendars?connectorName=" + connectorName
    )
    .then((res) => res.data);
};
const getCalenderFromSource = (
  connectorName: string = "GoogleTestVH"
): Promise<CalendarDetails[]> => {
  return http
    .get<CalendarDetails[]>(
      "api/pixconnectors/connector/getsourcecalendars?connectorName=" +
        connectorName
    )
    .then((res) => res.data);
};

const getAllConnectors =async () =>{
  const res = await http
    .get(
      "api/pixconnectors/connector/getall"
    );
  return res.data;
};

const getCalenders = async(connectorName: string) => {
  const resp = await http.get(
      "api/pixconnectors/connector/getcalendars?connectorName=" + connectorName
    );
  return resp.data;
};

const getConnectorByName =async (connectorName: string) =>{
  const res = await http
    .get<ConnectionDetails>(
      "api/pixconnectors/connector/getallbyname?name=" + connectorName
    );
  return res.data;
};

const getAuditAndLogs = (connectorName: string) => {
  return http
    .get<ConnectionDetails>(
      "api/pixconnectors/connector/get?name=" + connectorName
    )
    .then((res) => res.data);
};
const saveSettings = (connDetails: ConnectionDetails | undefined) => {
  return http
    .put<any>("api/pixconnectors/connector/update", connDetails)
    .then((res) => res.data);
};
const testConnection = async (connDetail: ConnectionDetails): Promise<CalendarDetails[]> => {
  return await http.post<CalendarDetails[]>(
    "api/pixconnectors/connector/testconnection",
    connDetail
  ).then((res)=>res.data).catch((error)=>error);
};

const CreateDiscreteConnector = async (request: DiscreteConnectionDetails) => {
  console.log("request ", request)
  return http.post<DiscreteConnectionDetails>("api/pixconnectors/connector/create", request)
      .then(res => res.data).catch((error)=>error);
}
const AddDiscreteCalendar = async (request: DiscreteConnectionDetails) => {
  console.log("request ", request)
  return http.post<DiscreteConnectionDetails>("api/pixconnectors/connector/addcalendar", request)
      .then(res => res.data).catch((error)=>error);
}

const ConnectorManagementService = {
  getCalenderInstances,
  getSourceCalenders,
  getAuditAndLogs,
  saveSettings,
  getCalenderFromSource,
  testConnection,
  getAllConnectors,
  getConnectorByName,
  getCalenders,
  CreateDiscreteConnector,
  AddDiscreteCalendar
};

export default ConnectorManagementService;

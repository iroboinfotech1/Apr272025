import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "../../../common/Button";
import LogDetails from "../../../../models/connector/logDetails";
import ConnectorManagementService from "../../../../services/connectorManagement.service";
import moment from "moment";
import { ConnectorContext } from "../../../../pages/connector";
import ConnectionDetails from "../../../../models/connector/connectionDetails";
import CalendarDetails from "../../../../models/connector/calendarDetails";

const marginVal = "40px";

function Logs() {
  const [testConnectionStatus,setTestConnectionStatus]=useState<String>("");
  const contextData: any = useContext(ConnectorContext);
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [connectorDetail, setConnectorDetail] = useState<ConnectionDetails>(
    {} as ConnectionDetails
  );

  useEffect(() => {
    FetchAuditAndLog();
  }, [contextData.connectorDetailId.name]);
  async function FetchAuditAndLog() {
    var connectorname = contextData.connectorDetailId.name
      ? contextData.connectorDetailId.name
      : "Pixel ser acc 2";
    console.log(connectorname);
    var auditLog = await ConnectorManagementService.getAuditAndLogs(
      connectorname
    );
    setConnectorDetail(auditLog);
    setLogs(auditLog.logs);
  }

  const handleTestConnection = async () => {
    let connectionStringOffice365= contextData!=null && contextData.connectorDetailId!=null? contextData.connectorDetailId.connectionStringOffice365:"";
    let connectionStringGoogle=contextData!=null && contextData.connectorDetailId!=null? contextData.connectorDetailId.connectionString:"";
    let source=contextData!=null && contextData.connectorDetailId!=null? contextData.connectorDetailId.source:"";
    let accessMode=contextData!=null && contextData.connectorDetailId!=null? contextData.connectorDetailId.accessMode:"";
    const testConnectionPayload = {
      source: source,
      accessMode: accessMode,
      delegatedUserId: "reserva@navi.com",
      connectionString: connectionStringGoogle,
      connectionStringOffice365:connectionStringOffice365
    } as ConnectionDetails;
    const calendarDetails: CalendarDetails[] =
      await ConnectorManagementService.testConnection(testConnectionPayload);
    if (calendarDetails.length > 0) {
      setTestConnectionStatus("Success");
      FetchAuditAndLog();
    }
    else
      setTestConnectionStatus("Failure");
  };

  return (
    <div className="flex flex-column items-center">
      <div className="py-3">
        <Button onClick={handleTestConnection}> Test Connection </Button>
      </div>
      {testConnectionStatus!==""?
      <div className="py-3" style={{color:testConnectionStatus=="Success"?"green":"red"}}>
        Test Connection {testConnectionStatus}
      </div>:null}
      <TableContainer
        sx={{
          margin: "20px",
          width: `calc(100% - ${marginVal})`,
          maxHeight: 370,
        }}
        component={Paper}
      >
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#dee2e6" }}>
              <TableCell>Activity</TableCell>
              <TableCell>Edited By</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.message}
                </TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>
                 {moment.utc(row.auditTime).local().format("MM/DD/YYYY hh:mm A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Logs;

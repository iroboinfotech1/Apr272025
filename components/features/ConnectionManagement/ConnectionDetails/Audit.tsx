import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../common/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConnectorManagementService from '../../../../services/connectorManagement.service';
import LogDetails from '../../../../models/connector/logDetails';
import moment from 'moment';
import { ConnectorContext } from '../../../../pages/connector';
const marginVal = '40px'

function Audit() {

  const [audits, setAudits] = useState<LogDetails[]>([])
  const contextData: any = useContext(ConnectorContext);

  useEffect(() => {
    FetchAuditAndLog();
  }, [contextData.connectorDetailId.name]);
  async function FetchAuditAndLog() {

    var connectorname =contextData.connectorDetailId.name ?contextData.connectorDetailId.name :"Pixel ser acc 2";
    var auditLog = await ConnectorManagementService.getAuditAndLogs(connectorname);
    setAudits(auditLog.audits)
  }


  return (
    <TableContainer sx={{ margin: '20px', width: `calc(100% - ${marginVal})`, maxHeight: 440 }} component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#dee2e6' }}>
            <TableCell >Activity</TableCell>
            <TableCell >Edited By</TableCell>
            <TableCell >Date & Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {audits.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.message}
              </TableCell>
              <TableCell >{row.userId}</TableCell>
              <TableCell >{moment.utc(row.auditTime).local().format("MM/DD/YYYY hh:mm A")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Audit
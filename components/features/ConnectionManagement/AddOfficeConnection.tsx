import {useState,useRef,useEffect,useCallback} from 'react';
import Modal from "../../lib/modalPopup/components/Modal";
import ModalBody from "../../lib/modalPopup/components/ModalBody";
import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../lib/modalPopup/components/ModalFooter";
import TextField from '@mui/material/TextField';
import Button from './../../common/Button';
import axios from "axios";
import { config } from '../../../services/http-common';
import ConnectorManagementService from '../../../services/connectorManagement.service';
import Connector from "./Connector";
import ModalService from '../../lib/modalPopup/services/ModalService';
import ConnectionDetails from '../../../models/connector/connectionDetails';
import CalendarDetails from '../../../models/connector/calendarDetails';

export default function AddOfficeConnection(props: any) {
  const [tenantValue, setTenantValue] = useState("");
  const [clientIdValue, setclientIdValue] = useState("");
  const [clientSecretValue, setclientSecretValue] = useState("");
  const serviceAccountEmail = useRef<any>(null);
  const clientId = useRef<any>(null);
  const tenantID = useRef<any>(null);
  const clientSecret = useRef<any>(null);

  const AddConnector = useCallback((e) => {

    let isEditFlow=props.modalResponse!=null ? props.modalResponse.isEditFlow:false;
    let isSaveReqd=e.target.innerText=="Save and Next"?true:false;
    if(isEditFlow && !isSaveReqd)
    {
      ModalService.open(Connector, props.modalResponse);
      return true;
    }
    const url = isEditFlow?`${config.connectionManagement.baseURL}${config.connectionManagement.UpdateConnector}`:`${config.connectionManagement.baseURL}${config.connectionManagement.CreateConnector}`;
    const req = {
      "name": props.connectorName,
      "source": "Office365",
      "accessMode": "Service Account",
      "connectionStringOffice365": {
        "instance": "https://login.microsoftonline.com/",
        "apiUrl": "https://graph.microsoft.com/",
        "tenant": tenantID.current.value,
        "clientId": clientId.current.value,
        "clientSecret": clientSecret.current.value
      },
      "orgId": "1",
      "noOfDaysToSyncBefore": 2,
      "noOfDaysToSyncAfter": 30,
      "noOfSecondsToSyncCalendar": 90
    };
    if(isEditFlow)
    {
      axios.put(url, req)
      .then((response) => {
        console.log(response);
        if(isEditFlow)
          ModalService.open(Connector, props.modalResponse);
        else
        {
          props.fetchConnectorList();
          fetchData();
        }
      })
      .catch((error) => {
        console.log(error);
        props.close();
      });
    }
    else
    {
      axios.post(url, req)
      .then((response) => {
        console.log(response);
        if(isEditFlow)
          ModalService.open(Connector, props.modalResponse);
        else
        {
          props.fetchConnectorList();
          fetchData();
        }
      })
      .catch((error) => {
        console.log(error);
        props.close();
      });
    }
  }, [props.connectorName, props.fetchConnectorList]);

  const fetchData = async () => {
      try {
        const response = await ConnectorManagementService.getAuditAndLogs(props.connectorName);
        const calenderSource = await ConnectorManagementService.getCalenderFromSource(props.connectorName);
        
        const connectorCalendar = calenderSource.filter(calendar =>
          !response.calendars.some(responseCalendar => responseCalendar.title === calendar.title)
        );
  
        const connectorResponse = response.calendars.concat(connectorCalendar);
        const modalResponse = {
          connectorName: props.connectorName,
          connectorResponse,
          source: "Office365",
          selectedCalandar: response.calendars,
          isEditFlow: true,
        };
  
        ModalService.open(Connector, modalResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show error message)
      }
    };

    let isEditReqd = () => {
      let ofz365ConStr=props!=null && props.modalResponse!=null && props.modalResponse.ofz365ConStr!=null?props.modalResponse.ofz365ConStr:null;
      if(ofz365ConStr==null || (
        (ofz365ConStr.tenant===tenantValue || ""===tenantValue) && 
        (ofz365ConStr.clientId===clientIdValue || ""===clientIdValue) && 
        (ofz365ConStr.clientSecret===clientSecretValue || ""===clientSecretValue)
      ) )
        return false;
      else
        return true;
    };
 

  return (
    <Modal>
      <ModalHeader>
        <div className="flex flex-column w-full b-4">
          <button className="opacity-30 ml-auto	" onClick={props.close}>✖</button>
          <h3 className="heading4 font-bold pb-4">{props!=null && props.modalResponse!=null && props.modalResponse.isEditFlow?"Edit":"Add"} a Connector</h3>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="py-3">
          <label className="w-full">
            <TextField value={props.connectorName} fullWidth id="outlined-basic" label="Connector Name" variant="outlined" required/> 
          </label>
        </div>
        <div className="py-3">
          <label className="w-full">
            <TextField value={tenantValue!=""?tenantValue:props!=null && props.modalResponse!=null && props.modalResponse.ofz365ConStr!=null?props.modalResponse.ofz365ConStr.tenant:""} onChange={(e)=>setTenantValue(e.target.value)} inputRef={tenantID} fullWidth id="outlined-basic" label="Tenant ID" variant="outlined" required/> 
          </label>
        </div>
        <div className="py-3">
          <label className="w-full">
            <TextField value={clientIdValue!=""?clientIdValue:props!=null && props.modalResponse!=null && props.modalResponse.ofz365ConStr!=null?props.modalResponse.ofz365ConStr.clientId:""} onChange={(e)=>setclientIdValue(e.target.value)} inputRef={clientId} fullWidth id="outlined-basic" label="Client ID" variant="outlined" required/> 
          </label>
        </div>
        <div className="py-3">
          <label className="w-full">
            <TextField value={clientSecretValue!=""?clientSecretValue:props!=null && props.modalResponse!=null && props.modalResponse.ofz365ConStr!=null?props.modalResponse.ofz365ConStr.clientSecret:""} onChange={(e)=>setclientSecretValue(e.target.value)} inputRef={clientSecret} fullWidth id="outlined-basic" label="Client Secret" type="password" variant="outlined" required/> 
          </label>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex py-4 w-full">
        <Button onClose={props.close}  onClick={(e) => AddConnector(e)} >{isEditReqd()?"Save and Next":"Next"}</Button>
        </div>
      </ModalFooter> 
    </Modal>
  );
}

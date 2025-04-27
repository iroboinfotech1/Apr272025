import { useEffect, useState } from "react";
import Modal from "../../lib/modalPopup/components/Modal";
import ModalBody from "../../lib/modalPopup/components/ModalBody";
import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../lib/modalPopup/components/ModalFooter";
import Button from "../../common/Button";
import ConnectorIcon from "../../../assets/icons/connectormanagement.svg";
import { ListBox } from "primereact/listbox";
import axios from "axios";
import { config } from "../../../services/http-common";
import SaveAlert from "../../common/saveAlert";
import ModalService from "../../lib/modalPopup/services/ModalService";
import momenttz from "moment-timezone";
import moment from "moment";

export default function Connector(props) {
  const calenders = [];
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  useEffect(() => {
    if (props.selectedCalandar) {
      const selectedCalendar = props.selectedCalandar.map((x) => {
        return {
          daysToSync: x.daysToSync,
          description: x.description,
          sourceCalendarId: x.sourceCalendarId,
          timeZone: x.timeZone,
          title: x.title,
        };
      });
      setSelectedCalendar(selectedCalendar);
    }
  }, [props.selectedCalandar]);

  if(props.connectorResponse!=null){
    props.connectorResponse.map((x) => {
      calenders.push({
        daysToSync: x.daysToSync,
        description: x.description,
        sourceCalendarId: x.sourceCalendarId,
        timeZone: x.timeZone,
        title: x.title,
      });
      return <li key={x.sourceCalendarId}>{x.title}</li>;
    });
}

  function filterSelectedCalendars(selectedCalendar, props) {
    // Ensure props.selectedCalendar is defined and not empty
    if (!props.selectedCalandar || props.selectedCalandar.length === 0) {
      return [];
    }
  
    // Filter to return only those calendars that exist in both `selectedCalendar` and `props.selectedCalendar`
    return selectedCalendar.filter(selected => 
      props.selectedCalandar.some(calendar => selected.sourceCalendarId === calendar.sourceCalendarId)
    );
  }

  function FilterDeleteSelectedCalendars(selectedCalendar, props) {
    // Ensure props.selectedCalendar is defined and not empty
    if (!props.selectedCalandar || props.selectedCalandar.length === 0) {
      return [];
    }
  
    // Filter and return an array of sourceCalendarIds as strings
    return selectedCalendar
      .filter(selected => 
        props.selectedCalandar.some(calendar => selected.sourceCalendarId === calendar.sourceCalendarId)
      )
      .map(selected => selected.sourceCalendarId.toString()); // Convert each ID to a string
  }


  function pushToCalendar(selectedCalendar) {
    const calendar = [];
    selectedCalendar.map(selected => {
      calendar.push({
        sourceCalendarId: selected.sourceCalendarId,
        timeZone: momenttz.tz.guess(),
        title: selected.title,
        description: selected.description ? selected.description : selected.title,
        allowedAccess: "writer",
      });
    });
    return calendar;
  }
  
  const onSave = async () => {
    //setLoader(true);
    let url =
      config.connectionManagement.baseURL +
      config.connectionManagement.AddCalender;
    const filteredCalendars = filterSelectedCalendars(selectedCalendar, props);
    if(filteredCalendars!==null && filteredCalendars.length>0)
    {
      //onUpdateCalendar();
      DeleteCalendar();
      return;
    }
    const calendar = pushToCalendar(  );
    const req = {
      name: props.connectorName,
      source: props.source ? props.source : "Google",
      accessMode: "Service Account",
      calendar: calendar,
      orgId: "1",
    };
    console.log(req);
    const result = await axios.post(url, req);
    if (result.status == 200) {
      openModel(SaveAlert, { message: "Successfully Saved" });
      console.log("Save Success");
      props.fetchConnectorList();
    } else openModel(SaveAlert, { message: "Save Failed" });
  };

  const onUpdateCalendar = async () => {
  debugger;
    let url =
      config.connectionManagement.baseURL +
      config.connectionManagement.UpdateCalender;
    const filteredCalendars = filterSelectedCalendars(selectedCalendar, props);
    const calendar = pushToCalendar(filteredCalendars);
    const req = {
      connectorName: props.connectorName,
      source: props.source ? props.source : "Google",
      accessMode: "Service Account",
      calendar: calendar,
      orgId: "1",
    };
    console.log(req);
    const result = await axios.post(url, req);
    if (result.status == 200) {
      openModel(SaveAlert, { message: "Successfully Saved" });
      console.log("Save Success");
      props.fetchConnectorList();
    } else openModel(SaveAlert, { message: "Save Failed" });
  };


  const DeleteCalendar = async () => {
     let url =
        config.connectionManagement.baseURL +
        config.connectionManagement.DeleteCalender;
      const filteredCalendars = FilterDeleteSelectedCalendars(selectedCalendar, props);
      const req = {
        connectorName: props.connectorName,
        sourceCalendarId: filteredCalendars,
        orgId: "1",
        title: "",
      };
      console.log(req);
      const result = await axios.post(url, req);
      if (result.status == 200) {
        openModel(SaveAlert, { message: "Successfully Saved" });
        console.log("Save Success");
        props.fetchConnectorList();
      } else openModel(SaveAlert, { message: "Save Failed" });
    };

  const openModel = (component, props) => {
    ModalService.open(component, props);
  };
 
  const handleChange = (e) => {
   
    console.log('Selected value Dinesh: ', e.value); // Check the value being passed
    setSelectedCalendar(e.value); // Update the state
  };

  return (
    <Modal>
      <ModalHeader>
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "20%", fontWeight: "bold" }}>
            <ConnectorIcon></ConnectorIcon>
          </div>
          <div style={{ width: "60%" }}>
            <h3 className="heading4 font-bold pb-4">{props.connectorName}</h3>
          </div>
          <div style={{ width: "20%", display: "flex", justifyContent: "center" }}>
            <button onClick={props.close}>✖</button>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="py-4 overflow-auto" style={{ maxHeight: "68vh" }}>
          <ListBox
            value={selectedCalendar}
            onChange={handleChange} // Use the method for onChange
            options={calenders}
            optionLabel="title"
            multiple
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex py-4 w-full">
          <Button onClose={props.close} onClick={onSave}>
            Save
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

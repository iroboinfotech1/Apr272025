import { useState, useRef } from "react";
import Modal from "../../lib/modalPopup/components/Modal";
import ModalBody from "../../lib/modalPopup/components/ModalBody";
import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../lib/modalPopup/components/ModalFooter";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "./../../common/Button";
import AddConnection from "../../../components/features/ConnectionManagement/AddConnection";
import AddOfficeConnection from "../../../components/features/ConnectionManagement/AddOfficeConnection";
import AddNativeConnector from "../../../components/features/ConnectionManagement/AddNativeConnector";
import ModalService from "../../../components/lib/modalPopup/services/ModalService";
import Connector from "./Connector";

export default function ChooseConnector(props: any) {
  const [calenderValue, setCalenderValue] = useState(
    props.modalResponse && props.modalResponse.source
      ? props.modalResponse.source.toLowerCase() === "google"
        ? "10"
        : "30"
      : ""
  );
  const connectorName = useRef<any>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setCalenderValue(event.target.value as string);
  };

  const AddConnector = () => {
    console.log(connectorName);
    const connectorDetails = {
      connectorName: connectorName.current.value,
      SelectedCalenderId: calenderValue,
      fetchConnectorList: props.fetchConnectorList,
      modalResponse:props.modalResponse
    };

    if(calenderValue=="30")
    {
      ModalService.open(AddOfficeConnection, connectorDetails);
    }
    else if(calenderValue=="20")
    {
      ModalService.open(AddNativeConnector, connectorDetails);
    }
    else if (props.modalResponse && props.modalResponse.isEditFlow) {
        ModalService.open(Connector, props.modalResponse);
      } 
    //  else ModalService.open(AddConnection, connectorDetails);
  };

  return (
    <Modal>
      <ModalHeader>
        <div className="flex flex-column w-full b-4">
          <button className="opacity-30 ml-auto	" onClick={props.close}>
            ✖
          </button>
          <h3 className="heading4 font-bold pb-4">{`${
            props.modalResponse && props.modalResponse.isEditFlow
              ? `Edit`
              : `Add`
          } a Connector`}</h3>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="py-3">
          <label className="w-full" htmlFor="orgSpace">
            <TextField
              inputRef={connectorName}
              fullWidth
              id="outlined-basic"
              label="Connector Name"
              variant="outlined"
              required
              value={props.modalResponse?.connectorName}
              disabled={props.modalResponse && props.modalResponse.isEditFlow}
            />
          </label>
        </div>
        <div className="py-3">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Calender
            </InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              value={calenderValue}
              id="demo-simple-select"
              label="Select Calender"
              onChange={handleChange}
              disabled={props.modalResponse && props.modalResponse.isEditFlow}
            >
              <MenuItem value={10}>Google Calender</MenuItem>
               <MenuItem value={20}>Native Calendar</MenuItem> 
               <MenuItem value={30}>
                Office 365 (Modern Authentication){" "}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex py-4 w-full">
          <Button onClick={AddConnector}>
            {props.modalResponse && props.modalResponse.isEditFlow
              ? `Edit`
              : `Add`}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

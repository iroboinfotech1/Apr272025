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
import AddButton from "./AddButton";
import axios from "axios";
import { config } from "../../../services/http-common";

export default function AddConnection(props: any) {
  const [calenderValue, setCalenderValue] = useState(props.SelectedCalenderId);
  const hiddenFileInput = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState("Import Json");
  const [responseData, setResponseData] = useState({});
  // const delegatedUserId = useRef<any>(null);
  const [delegatedUserId, setDelegatedUserId] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCalenderValue(event.target.value as string);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0].name);
    let url =
      config.connectionManagement.baseURL +
      config.connectionManagement.CreateConnectionFromFile;
    let file = event.target.files[0];
    uploadFile(url, file);
  };

  const uploadFile = (url: any, file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("OrgID", "1");
    formData.append("Name", props.connectorName);
    formData.append("DelegatedUserId", delegatedUserId);
    formData.append("Source", calenderValue === 10 ? "Google" : "Office 365");
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        fnSuccess(response);
      })
      .catch((error) => {
        fnFail(error);
      });
  };
  const fnSuccess = (response: any) => {
    if (response != null) {
      const data = {
        connectorName: props.connectorName,
        connectorResponse: response.data,
        fetchConnectorList: props.fetchConnectorList,
      };
      console.log(data);
      setResponseData(data);
    }
  };

  const fnFail = (error: any) => {
    //Add failed handling
  };

  const handleClick = (event: any) => {
    hiddenFileInput?.current?.click();
  };

  return (
    <Modal>
      <ModalHeader>
        <div className="flex flex-column w-full b-4">
          <button className="opacity-30 ml-auto	" onClick={props.close}>
            ✖
          </button>
          <h3 className="heading4 font-bold pb-4">Add a Connector</h3>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="py-3">
          <label className="w-full" htmlFor="orgSpace">
            <TextField
              value={props.connectorName}
              fullWidth
              id="outlined-basic"
              label="Connector Name"
              variant="outlined"
              required
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
            >
              <MenuItem value={10}>Google Calender</MenuItem>
              <MenuItem value={30}>Office 365 (Modern Authentication){" "}</MenuItem>
              <MenuItem value={20}>Native Calendar{" "}
              </MenuItem>
            </Select>

            <div className="py-3">
              <label className="w-full" htmlFor="delegatedUserId">
                <TextField
                  onChange={(e: any) => setDelegatedUserId(e.target.value)}
                  fullWidth
                  id="outlined-basic"
                  label="ServiceAccount User"
                  variant="outlined"
                  required
                  value={delegatedUserId}
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                color: "rgb(148 163 184)",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: "20px",
                borderStyle: "dashed",
                borderWidth: "2px",
                pointerEvents: delegatedUserId === "" ? "none" : "auto",
              }}
            >
              <img
                onClick={handleClick}
                src={"../assets/images/importIcon.png"}
                width="30"
                height="30"
              />
              <input
                ref={hiddenFileInput}
                id="files"
                hidden
                type="file"
                onChange={handleFileChange}
                accept=".json"
              />
              <label id="lblSelectedFile" htmlFor="files">
                &nbsp;&nbsp;{selectedFile}
              </label>
            </div>
            <div
              style={{
                display: "flex",
                color: "rgb(148 163 184)",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: "10px",
              }}
            >
              OR
            </div>
          </FormControl>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex py-4 w-full">
          <AddButton
            onClose={props.close}
            calenderValue={calenderValue}
            modelResponse={responseData}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}

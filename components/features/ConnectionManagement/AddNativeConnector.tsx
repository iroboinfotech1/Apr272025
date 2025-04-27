import {useState,useCallback} from 'react';
import Modal from "../../lib/modalPopup/components/Modal";
import ModalBody from "../../lib/modalPopup/components/ModalBody";
import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import ModalFooter from "../../lib/modalPopup/components/ModalFooter";
import DiscreteConnectionDetails from "../../../models/connector/discreteconnectionDetails"
import TextField from '@mui/material/TextField';
import * as XLSX from 'xlsx';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import ConnectorManagementService from "../../../services/connectorManagement.service";

export default function AddNativeConnector(props: any) {

  const[connectorname, setconnectorName]=useState(props.connectorName);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const timezones = ['UTC', 'EST', 'PST', 'CST', 'IST'];
  const [data, setData] = useState<{ resourceId: string; resourceName: string }[]>([]);
  const displayText = data.map(item => item.resourceName).join('\n');
  const [responsemessage,setresponsemessage]=useState("");

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      // Parse the file using XLSX
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      // Extract relevant columns
      const filteredData = jsonData.map((row) => ({
        resourceId: row["resourceId"], // Column name in Excel
        resourceName: row["resourceName"], // Column name in Excel
      }));

      setData(filteredData); // Set data to state
    };

    reader.readAsArrayBuffer(file); // Read file as array buffer
  };

// Handle Add Connector button click
const handleAddConnector = async () => {
  debugger;
  const createconnector = await checkconnectorExist();
  if(createconnector)
  {
    const mappedcalendar = data.map((item) => ({
      sourceCalendarId: item.resourceName + item.resourceId, // Maps to resourceId
      timeZone: "Asia/Kolkata", // Static value
      title: item.resourceName, // Maps to resourceName
      description: item.resourceName, // Maps to resourceName
      allowedAccess: "writer", // Static value
    }));
  
    const request: DiscreteConnectionDetails = {
      name: connectorname,
      source: "Discrete",
      accessMode: "",
      orgId: "1",
      calendar : mappedcalendar,
    };

    try {
      debugger;
      console.log(request);
      const response = await ConnectorManagementService.AddDiscreteCalendar(request);
      setresponsemessage("Calendar Entries Added Successfully");
      console.log("Connector added successfully:", response);
      // Optionally, handle the response (e.g., show a success message or close the modal)
    } catch (error) {
      console.error("Error adding connector:", error);
      setresponsemessage("Error Adding in Calendar Entries");
      // Optionally, handle the error (e.g., show an error message)
    }
  }
};

const checkconnectorExist = async() => {

  const request: DiscreteConnectionDetails = {
    name: connectorname,
    source: "Discrete",
    accessMode: "",
    orgId: "1",
    calendar: [],
  };
  try {
    debugger;
    console.log();
    const response = await ConnectorManagementService.getConnectorByName(connectorname);
    console.log("Connector Created successfully:", response);
    if (response && response[0] && response[0].name === connectorname && response[0].source=="Discrete") {
      setresponsemessage("ConnectorName Already Exist && Adding Calendar Entries");
       return true; // Connector found
    } 
    else {
      const response1 = await ConnectorManagementService.CreateDiscreteConnector(request);
      setresponsemessage("Connector Created Successfully");
      return true
      console.log("Connector Created successfully:", response);
    }
  } catch (error) {
    console.error("Error adding connector:", error);
    return false;
  }
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
      <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md">
        <div className="mb-4">
          <label className="w-full" htmlFor="orgSpace">
            <TextField
              fullWidth
              id="outlined-basic"
              label="Connector Name"
              variant="outlined"
              required
              value={connectorname}
              disabled={true}
            />
          </label>
        </div>
      <div className="mb-4">
        <TextField
          id="outlined-multiline-static"
          label="Select Calendar"
          multiline
          rows={4}
          value={displayText}
          disabled={true} 
          className="w-full"
        />
    </div>
     <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Timezone</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              value={selectedTimezone}
              id="demo-simple-select"
              label="Select Timezone"
              onChange={(e) => setSelectedTimezone(e.target.value)}
              disabled={props.modalResponse && props.modalResponse.isEditFlow}
            >
              {timezones.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
     </div>
     <div className="flex items-center gap-8 mb-8 mt-8 ml-1">
     <span className="font-medium whitespace-nowrap bg-blue-500 text-white px-2 py-1 rounded">Import CSV:</span>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="cursor-pointer"
      />
      </div>
      <div className="mb-4">
        <button
          className="btn btn-primary w-full"
          onClick={handleAddConnector}
        >
          Add Connector
        </button>
      </div>
      <div className="font-medium whitespace-nowrap bg-white-500 text-red-500 px-2 py-1 mb-4">
         {responsemessage}
      </div>
    </div>
      </ModalBody>
      <ModalFooter>
      </ModalFooter> 
    </Modal>
  );
}

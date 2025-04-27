import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ConnectorManagementService from "../../../../services/connectorManagement.service";
import React, { useContext, useEffect } from "react";
import ConnectionDetails from "../../../../models/connector/connectionDetails";
import { ConnectorContext } from "../../../../pages/connector";
import TextField from "@mui/material/TextField";
import IncDecCounter from "../../../incDecCounter";

function App({
  connectorStatus, setconnectorStatus
}) {
  const [settings, setSettings] = React.useState<ConnectionDetails>(
    {} as ConnectionDetails
  );
  
  const contextData: any = useContext(ConnectorContext);
  const [daysBefore, setDaysBefore] = React.useState<number>(contextData.connectorDetailId.noOfDaysBefore);
  const [daysAfter, setDaysAfter] = React.useState<number>(contextData.connectorDetailId.noOfDaysAfter);
  const [secToSync, setSecToSync] = React.useState<number>(contextData.connectorDetailId.noOfSecondsToSyncCalendar);
  // const [connectorStatus, setconnectorStatus] = React.useState<string>(contextData.connectorDetailId.status);
  const [inputValue, setInputValue] = React.useState<string>('00:00');
  const [errorText, setErrorText] = React.useState<string>('');
  const [isEventChanged, setEventChanged] = React.useState<boolean>(false);

  const convertToMMSS = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const convertToSeconds = (input) => {
    const [minutes, seconds] = input.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return minutes * 60 + seconds;
    }
    return null; // Return null if the input is invalid
  };
  

  useEffect(() => {
    ////debugger;
    FetchAuditAndLog();
  }, [contextData.connectorDetailId, daysBefore, daysAfter, secToSync,connectorStatus]);
 
  async function FetchAuditAndLog() {
    var connectorname = contextData.connectorDetailId.name ? contextData.connectorDetailId.name : "Pixel ser acc 2";
    var response = await ConnectorManagementService.getAuditAndLogs(connectorname); //call the get name API from dotnet
    if(!isEventChanged)
    {
      setInputValue(convertToMMSS(response.noOfSecondsToSyncCalendar))
    }   
    setSettings(response);
    
    UpdateSettings();
  }

  async function UpdateSettings() {
   
    if (settings !== undefined && settings.name!==undefined && settings.accessMode!==undefined && isEventChanged) {
      settings.orgId = settings.id.toString();
      settings.name=settings.name;
      settings.accessMode=settings.accessMode;
      settings.noOfDaysToSyncBefore = daysBefore;
      settings.noOfDaysToSyncAfter = daysAfter;
      settings.noOfSecondsToSyncCalendar = !isNaN(secToSync)? secToSync: convertToSeconds(secToSync);
      settings.status=connectorStatus;
     
      if(contextData!==undefined && contextData.connectorDetailId!==undefined)
      {
        contextData.connectorDetailId.noOfDaysBefore=daysBefore;
        contextData.connectorDetailId.noOfDaysAfter=daysAfter;
        contextData.connectorDetailId.noOfSecondsToSyncCalendar=settings.noOfSecondsToSyncCalendar;
        contextData.connectorDetailId.status=settings.status;
      }

      var resp1 = await ConnectorManagementService.saveSettings(settings); //call the Update Method to the dotnet

      setSettings(settings);

      setEventChanged(false);
    }
  }
  const handleCounter = (action:string,name:string) => {

    if(name == 'daysBefore')
    {
      setEventChanged(true);
      setDaysBefore(action == 'INCREASE' ? daysBefore + 1 : daysBefore - 1);
    }
    else if(name == 'daysAfter')
    {
      setEventChanged(true);
      setDaysAfter(action == 'INCREASE' ? daysAfter + 1 : daysAfter - 1);
    }
    // if(theme){
    //   const newTheme = {...theme};
    //   newTheme.themeData[name] = action == 'INCREASE' ? newTheme.themeData[name] + 1 : newTheme.themeData[name] - 1
    //   setTheme(newTheme);
    // }
  }

  const handleChange = (event: any, dType: string) => {
    switch (dType) {
      case "connectorstatus":
         setEventChanged(true);
          var tmpconnStatus = (event.target.checked? "Active" : "InActive");
          setconnectorStatus(tmpconnStatus);
      break;
      case "sync":
        setEventChanged(true);
        const value = event.target.value;
        const [minutes, seconds] = value.split(':').map(Number);
        // Validate minutes and seconds
        if (minutes > 59 || seconds > 59) {
          setErrorText('Minutes and seconds should not exceed 59.');
          return;
        }
        setInputValue(value);
        const regex = /^\d{0,2}:\d{0,2}$/;
          if (!regex.test(value)) {
            setErrorText('Invalid format. Please use minutes:seconds (e.g., 05:30)');
          } else {
            setErrorText('');
            var seconds1 = convertToSeconds(value);
            setSecToSync(seconds1);
          }
        break;
      case "before":
        setEventChanged(true);
        setDaysBefore(event.target.value);
        break;
      case "after":
        setEventChanged(true);
        setDaysAfter(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="mt-4 p-4">
      <div className="flex justify-between py-2">
        <div> Connector Status</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings?.status === "Active" ? true : false}
            onChange={(e) => handleChange(e, "connectorstatus")}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="flex justify-between py-2 items-center">
        <div> Synchronizing Calender</div>
        <div>
        <FormControl fullWidth size="small">
              <TextField
              label="Minutes:Seconds"
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={(e) => handleChange(e, "sync")}
              error={Boolean(errorText)}
              helperText={errorText}
            />
        </FormControl> 
        </div>
      </div>
      <div className="flex flex-col py-2">
        <div>Event Download Settings</div>
        <div>Download events that occur before and after current time</div>
        <div className="flex flex-col py-2">
          <FormControl
            fullWidth
            sx={{ margin: "20px 20px 0px 0px" }}
            size="small"
          >
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span>Before</span>
            <span >
              <IncDecCounter value={daysBefore} onDecreaseClick={() => handleCounter('DECREASE','daysBefore')} 
               onIncreaseClick={() => handleCounter('INCREASE','daysBefore')}></IncDecCounter>
            </span>
            <span>days</span>
          </div>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ margin: "20px 20px 0px 0px" }}
            size="small"
          >
            <div className="flex gap-6 mt-6 text-slate-500 items-center ">
            <span>After</span>
            <span >
              <IncDecCounter value={daysAfter} onDecreaseClick={() => handleCounter('DECREASE','daysAfter')} 
               onIncreaseClick={() => handleCounter('INCREASE','daysAfter')}></IncDecCounter>
            </span>
            <span>days</span>
          </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
export default App;

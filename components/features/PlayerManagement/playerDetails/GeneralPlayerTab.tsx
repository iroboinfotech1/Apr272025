import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { SyntheticEvent, useContext, useRef, useState,useEffect } from 'react';
import { PlayerContext } from '../../../../pages/player';
import styles from './playerDetails.module.css';
import { Autocomplete, TextField } from '@mui/material';
import PlayerManagementService from '../../../../services/player.service';
import ConnectorManagementService from '../../../../services/connectorManagement.service';
import { ConnectorContext } from '../../../../pages/connector';
import Meeting from '../../../../models/connector/meeting';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';
import PlayerActivityLogs from '../../../../models/player/PlayerActivityLogs';
import { playerDataAtom } from '../grid-view';
import { useRecoilState } from 'recoil';
import { addOneDay, getCurrentDate } from './dateutil';
import { strict } from 'assert';

interface SpaceDetail {
    spaceId: number;
    spaceAliasName: string;
    mappedConnectorIds: string[];
    mappedCalendarIds: string[];
}

function GeneralPlayerTab(){

    const [activityLogs, setActivityLogs] = useState<PlayerActivityLogs[]>([]);
    const [correctOTP,setCorrectOTP] = useState(null); // fetched from your server
    const [calendarid,setcalendarid] = useState(null); // fetched from your server
    const numberOfDigits=6;
    const [calenderList, setCalanderList] = useState<any[]>([]);
    let currentDate = getCurrentDate();
    const result = addOneDay(currentDate);
    const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
    const [otpError, setOtpError] = useState<string | null>(null);
    const otpBoxReference = useRef<HTMLInputElement[]>([]);
    const [roomSection,setRoomSection]=useState(false);
    const [eventSection,setEventSection]=useState(false);
    const [calData, setCalData] = useState<Meeting[]>([]);
    const contextData: any = useContext(ConnectorContext);
    const [rooms, setRooms] = useState<string[]>([]);
    const {selectedSerialNumber}: any = useContext(PlayerContext);
    const [playerData, setPlayerData] = useRecoilState(playerDataAtom);
    var selectedPlayerData=playerData.find( p => p.serialNumber == selectedSerialNumber);
    const [statusColor,setStatusColor]=useState<String>("red");
    const [spaceDetails, setSpaceDetails] = useState<SpaceDetail[]>([]);
    const playerActivityListColumn = [
        { field: 'statusIcon', headerName: '', width: 10 , hide: false,
    renderCell: (params: any) => {
      return (
        <div
        className="h-3.5 w-3.5 rounded-full"
        style={statusColor.toLowerCase()=="green"?{ backgroundColor: "rgb(34 197 94)" }:{ backgroundColor: "rgb(255 0 0)" }}
      ></div>
      );
    } 
  },
  { field: 'status', headerName: 'Status', width: 250,headerClassName:"font-bold-medium" },
  { field: 'loginsertdate', headerName: 'Date', width: 250,headerClassName:"font-bold-medium" },
        { field: 'activity', headerName: 'Activity', width: 490,headerClassName:"font-bold-medium" }    
     ];
     
    const getEvents=async (e)=>{
        if(e!=null && e.target.childNodes[0]==undefined)
            setEventSection(false);
        else
        {
            const conectionDetails = contextData.connectorDetailId;

            if(calendarid!=null)
              conectionDetails.calendarId=calendarid;
            else if(contextData.connectorDetailId!=null && contextData.connectorDetailId.calendarId!=null)
              conectionDetails.calendarId=contextData.connectorDetailId.calendarId;
            else
              conectionDetails.calendarId = null;
            var response = await ConnectorManagementService.getCalenderInstances(
            conectionDetails.calendarId,
            result.startOfDay,
            result.endOfDay
            );
            setCalData(response);
            setEventSection(true);
        }
    }

    function otpHandleChange(value, index) {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);
        if(value && index < numberOfDigits-1){
          otpBoxReference.current[index + 1].focus()
        }
        if(correctOTP!=null && newArr.join("") !== "" && newArr.join("") !== correctOTP){
            setOtpError("❌");
            setRoomSection(false);
            setEventSection(false);
        }else{
            setRoomSection(true);
            setEventSection(true);
        } 
      }

    function handleBackspaceAndEnter(e, index) {
        if(e.key === "Backspace")
            {
                setRoomSection(false);
                setEventSection(false);
                setCalData([]);
            }
        if(e.key === "Backspace" && !e.target.value && index > 0){
          otpBoxReference.current[index - 1].focus()
        }
        if(e.key === "Enter" && e.target.value && index < numberOfDigits-1){
          otpBoxReference.current[index + 1].focus()
        }
      }

      useEffect(() => {
        const fetchData = async () => {
          if (selectedPlayerData?.spaceName != null) {
            let connectorId, calendarId;
            const selectedSpace = spaceDetails.find(space => space.spaceAliasName === selectedPlayerData?.spaceName);
            if (selectedSpace) {
              let spaceId = selectedSpace.spaceId;
              calendarId = selectedSpace.mappedCalendarIds[0]; // Assuming there's only one calendarId
              connectorId = selectedSpace.mappedConnectorIds[0]; // Assuming there's only one connectorId
            }
            if(selectedSpace==null || selectedSpace.mappedCalendarIds==null || selectedSpace.mappedCalendarIds.length==0)
            {
                var playerRes = await PlayerManagementService.getPlayerDetails(selectedPlayerData?.serialNumber);
                if(playerRes!=null && playerRes.data!=null)
                {
                  calendarId=playerRes.data.calendarId;
                  connectorId=playerRes.data.connectorId;
                  setcalendarid(calendarId);
                }
            }
            const response = await ConnectorManagementService.getSourceCalenders(connectorId);
            setCalanderList(response);
            let calendar= getCalendarId(calendarId);
            setcalendarid(calendar);
            getEvents(null);
          }
          fetchActivityLogs();
        };
    
        fetchData();
      }, [selectedPlayerData, spaceDetails]);

      const getCalendarId = (sourceCalendarId) => {
        const calendar = calenderList?.find(cal => cal.sourceCalendarId === sourceCalendarId);
        return calendar ? calendar.calendarId : null;
      };

      useEffect(() => {
        if(correctOTP!=null && otp.join("") !== "" && otp.join("") !== correctOTP){
            setOtpError("❌");
        }else{
          setOtpError("valid");
        } 
       }, [otp]);

       useEffect(() => {
        fetchSpaces();
       }, []);

    async function fetchSpacedetails() {
        var response = await PlayerManagementService.getSpaces();
        if (response.data) {
          const spaceDetails: SpaceDetail[] = response.data.map((x: any) => ({
            spaceId: x.spaceId,
            spaceAliasName: x.spaceAliasName,
            mappedConnectorIds: x.mappedConnectorIds,
            mappedCalendarIds: x.mappedCalendarIds,
          }));
          const roomNames: string[] = Array.from(new Set(response.data.map((x: any) => x.spaceAliasName)));
          setRooms(roomNames);
          setSpaceDetails(spaceDetails);
        }
      }
     async function fetchSpaces() {
          var response = await PlayerManagementService.getPlayerSensitiveInformation(selectedSerialNumber);
          if (response.status == true) {
            if(response.data){
             setCorrectOTP(response.data.sixDigitCode);
            }
          }
         fetchSpacedetails();

        //   var playerResponse = await PlayerManagementService.getSpaces();
        //   if(playerResponse.data){
        //     const roomNames: string[] = playerResponse.data.map((x: any) => x.spaceAliasName);
        //         setRooms(roomNames);
        //     }
        }

      async function fetchActivityLogs() {
        var response = await PlayerManagementService.GetPlayerLogsBySerialNumber(selectedSerialNumber);
        if (response.status == true) {
          if(response.data){
            console.log(response.data);
            addItem(response.data);
          }
        }
    }

    const addItem = (item:PlayerActivityLogs) => {
        item.status.toLowerCase()=='success'?setStatusColor('green'):setStatusColor('red');
        const newLogs = [...activityLogs, item];
        setActivityLogs(newLogs);
    };


    return (
    <div className='flex flex-col gap-4'>
                    <div className='flex gap-6 border rounded-lg p-6 border-gray-400'>
                        <div className='w-[250px] border rounded-2xl p-3 border-gray-400 relative'>
                            <div className={styles.ipadLogo}></div>
                            {/* <img src={logo} alt="Logo" /> */}
                        </div>
                        <div className='flex-grow text-left'>
                            <div className='text-2xl font-semibold'>{selectedPlayerData?.deviceName}</div>
                            <div className='text-gray-400 mt-6'>Location</div>
                            <div className='text-lg mt-2 font-semibold'>{selectedPlayerData?.spaceName}</div>
                            <div className='mt-6 flex'>
                                <div className='mr-10'>
                                    <div className='text-gray-400'>Resolution</div>
                                    <div className='mt-2 text-lg font-semibold'>{selectedPlayerData?.resolution}</div>
                                </div>
                                <div className='pl-10 border-l border-gray-400'>
                                    <div className='text-gray-400'>Orientation</div>
                                    <div className='mt-2 text-lg font-semibold'>{selectedPlayerData?.orientation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col w-2/4 border rounded-lg border-gray-400'>
                            <div className='flex justify-between p-3 text-left'>
                                <span className='text-lg font-semibold'>Events</span>
                                <span className='text-lg font-semibold hidden'>Setting</span>
                            </div>
                            {eventSection?
                            <div className='flex flex-col gap-4 border-t border-gray-400 p-3 h-56 overflow-y-auto'>
                                    {calData.map((x: Meeting, index: number) => {
                                    return (
                                        <div key={x.id} className='border-t-4 border-b-4 p-4 bg-blue-100 border-t-green-400 border-b-gray-400'>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                 <div>{moment(x.startTime).utc().format('hh:mm')} - {moment(x.endTime).utc().format('hh:mm')}</div>
                                                 <div>{moment(x.startTime).utc().format('YYYY-MM-DD')} - {moment(x.endTime).utc().format('YYYY-MM-DD')}</div>
                                            </div>
                                            <div>{x.summary}</div>
                                            <div className='opacity-30 text-xs'>John Walker, fardeen, Diya Stakes, etc...</div>
                                        </div>
                                     )
                                    })} 
                            </div>:null}
                        </div>
                        <div className='flex flex-col w-2/4 border rounded-lg border-gray-400'>
                            <div className='flex justify-between p-3 text-left'>
                                <span className='text-lg font-semibold'>Channel</span>
                            </div>
                            <div className='flex flex-col gap-1 border-t border-gray-400 p-1 h-56 overflow-y-auto '>
                                {selectedPlayerData?.spaceName==null?
                            <div className='flex items-center justify-center gap-5 p-2 w-full'>
                                {otp.map((digit, index)=>(
                                    <input style={{textAlign:'center'}} key={index} value={digit} maxLength={1}  
                                    onChange={(e)=> otpHandleChange(e.target.value, index)}
                                    onKeyUp={(e)=> handleBackspaceAndEnter(e, index)}
                                    ref={(reference) => {
                                        if (reference) {
                                            otpBoxReference.current[index] = reference;
                                        }
                                    }}
                                    className="border-2 border-black w-[50px] h-auto text-black p-3 rounded-md block bg-white focus:border-black focus:outline-none appearance-none"
                                    />
                                ))}

                             </div>:null}
                             {(otpError!='valid' && otpError!=null)?<p className={`text-lg text-white mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>:null}
                             <div className='flex items-center justify-center gap-5 p-4 w-full'>
                            {(roomSection==false && selectedPlayerData?.spaceName==null)?null:<Autocomplete disabled={selectedPlayerData?.spaceName==null?false:true} defaultValue={selectedPlayerData?.spaceName} disablePortal id="combo-box-demo" options={rooms} sx={{ width: 400 }}
                                  onChange={(e)=>getEvents(e)} renderInput={(params) => 
                                    <TextField {...params} label="Rooms" />}/>}
                             </div>
                            </div>
                        </div>
                    </div>
                    <div className='border rounded-lg border-gray-400'>
                        <div className="row">
                            <div className="col-12" style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                rows={activityLogs}
                                columns={playerActivityListColumn}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                getRowId={(row) =>  row.activity}
                            />
                            </div>
                        </div>
                    </div>
                </div>
);
}
export default GeneralPlayerTab;
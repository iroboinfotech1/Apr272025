import React, { useContext, useState,useRef,useMemo } from 'react'
import MenuItem from '@mui/material/MenuItem';
import { Box, Card, FormControl, InputLabel, Select, Typography,Button } from '@mui/material';
import PlayerManagementService from '../../../../services/player.service';
import { useRecoilState } from 'recoil';
import { playerDataAtom } from '../grid-view';
import  ThemeService  from "../../../../services/theme.service";
import Theme from "../../../../models/theme/theme";
import { PlayerContext } from '../../../../pages/player';
import { SelectChangeEvent } from '@mui/material';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import ApiResponse from '../../../../models/ApiResponse';

const schema = yup.object().shape({
    contactPerson:yup.string(),
    department:yup.string(),
    deviceName:yup.string(),
    deviceStatus:yup.string(),
    ipAddress:yup.string(),
    locationName:yup.string(),
    orientation:yup.string(),
    resolution: yup.string(),
    serialNumber: yup.string(),
    spaceName: yup.string(),
    theme: yup.string()
});

interface SpaceDetail {
    spaceId: number;
    spaceAliasName: string;
    mappedConnectorIds: string[];
    mappedCalendarIds: string[];
}

function SettingPlayerTab() {
const [tabvalue, settabValue] = useState<number>(1); //
const spaceValue=useRef<any>(null);
const themeValue=useRef<any>(null);
const resolutionValue=useRef<any>(null);
const orientationValue=useRef<any>(null);
const [bannerMessage, setBannerMessage] = useState('');
const [isError, setIsError] = useState(false);
const [playerData, setPlayerData] = useRecoilState(playerDataAtom);
const { selectedSerialNumber}: any = useContext(PlayerContext)
var selectedPlayerData=playerData.find( p => p.serialNumber == selectedSerialNumber);
const { setOpenAddPlayerTab}: any = useContext(PlayerContext)

const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => {
    return selectedPlayerData;
    }, [selectedPlayerData])
});

const [loader, setLoader] = React.useState<boolean>(false);
const [theme, setTheme] = React.useState<Theme[]>([]);
const [rooms, setRooms] = React.useState<string[]>([]);
const [spaceDetails, setSpaceDetails] = useState<SpaceDetail[]>([]);

const portraitResolution=[
    '1080 x 1920','720 x 1280','1440 x 2560 (common for some high-resolution smartphones)'
];

const landscapeResolution=[
'1920 x 1080 (Full HD)','2560 x 1440 (Quad HD or 2K)','3840 x 2160 (Ultra HD or 4K)','7680 x 4320 (8K)'
];

const [resolutionList,setResolutionList] = React.useState<string[]>([]);

React.useEffect(() => {
    fetchThemes();
    fetchSpaces();
    if(selectedPlayerData!=null)
        setResolutionList(selectedPlayerData.orientation=='Portrait'?portraitResolution:landscapeResolution);
}, [])

async function fetchSpaces() 
{
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



async function fetchThemes() {
    setLoader(true);
    var response = await ThemeService.getAllThemes();
    if (response.status == true) {
    setTheme(response.data);
    }
    setLoader(false);
}

//const handleChangeMultiple = (event: React.ChangeEvent<{ value: unknown }>) => {
const handleChangeMultiple = (event: SelectChangeEvent<string>) => {
    switch(event.target.name) 
    {
        case "spaceName":
            setValue("spaceName",event.target.value as string);
            break;
        case "themeName":
            setValue("theme",event.target.value as string);
            break;
        case "resolutionName":
            setValue("resolution",event.target.value as string);
            break;
        case "orientationName":
            setValue("orientation",event.target.value as string);
            setResolutionList(event.target.value=='Portrait'?portraitResolution:landscapeResolution);
            break;
        default:
            break;
    }
};

const onSubmit = async (data: any) => {
    const formData = { ...data };
    const selectedSpace = spaceDetails.find(space => space.spaceAliasName === data.spaceName);
    if (selectedSpace) {
    formData.spaceId = selectedSpace.spaceId;
    formData.calendarId = selectedSpace.mappedCalendarIds[0]; // Assuming there's only one calendarId
    formData.connectorId = selectedSpace.mappedConnectorIds[0]; // Assuming there's only one connectorId
    }
    const response: ApiResponse = await PlayerManagementService.updatePlayer(formData);
    if (response.status) {
        setOpenAddPlayerTab(false);
        fetchMyApi();
        setBannerMessage('Data Updated successfully!');
        setIsError(false);
    }
    else{
        setBannerMessage('Error Updating data!!');
        setIsError(true);
    }
};

async function fetchMyApi() {
    setLoader(true);
    var response = await PlayerManagementService.getPlayerList();
    if (response.status) {
    setPlayerData(response.data);
    }
    setLoader(false);
}

return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
        {/* <TabPanel tabvalue={tabvalue} index={1}> */}
        <div className='flex flex-col gap-4 p-8'>
            <div className='flex gap-4'>
                <FormControl className='w-6/12' size="small">
                    <InputLabel id="demo-select-small">Space</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        {...register('spaceName')}
                        label="Space"
                        onChange={handleChangeMultiple}
                        name="spaceName"
                        defaultValue={selectedPlayerData?.spaceName}
                    >
                        {rooms.map((item: any, i: number) => {
                            return (
                                <MenuItem key={i} value={item}>{item}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl className='w-6/12' size="small">
                    <InputLabel id="demo-select-small">Theme</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        {...register('theme')}
                        label="Theme"
                        onChange={handleChangeMultiple}
                        name="themeName"
                        defaultValue={selectedPlayerData?.theme}
                    >
                        {theme.map((item: any, i: number) => {
                            return (
                                <MenuItem key={i} value={item.id}>{item.themename}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className='flex gap-4'>
                <FormControl className='w-6/12' size="small">
                    <InputLabel id="demo-select-small">Orientation</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        {...register('orientation')}
                        label="Resolution"
                        onChange={handleChangeMultiple}
                        name="orientationName"
                        defaultValue={selectedPlayerData?.orientation}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Landscape'}>Landscape</MenuItem>
                        <MenuItem value={'Portrait'}>Portrait</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className='w-6/12' size="small">
                    <InputLabel id="demo-select-small">Resolution</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        {...register('resolution')}
                        label="Resolution"
                        onChange={handleChangeMultiple}
                        name="resolutionName"
                        defaultValue={selectedPlayerData?.resolution}
                    >
                        {resolutionList.map((fruit, index) => (
                            <MenuItem key={index} value={fruit}>{fruit}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
            </div>
            <div>
            <div className="row">
                <div className="col-12 text-center mt-4 mb-4">
                    <Button variant="contained" type="submit">Update</Button>
                </div>
                {bannerMessage && (
                    <div 
                        className={
                        isError 
                            ? "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            : "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                        }
                      >
                       {bannerMessage}
                    </div>
                )}
            </div>
            </div>
        </div>
        </form>
        {/* </TabPanel> */} 
    </div>
);
}
export default SettingPlayerTab;
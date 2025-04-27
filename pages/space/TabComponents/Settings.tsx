import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import floor from '../../../assets/images/floor.png'
import { TextField } from '@mui/material';
import SpaceService from '../../../services/space.service';
import Space from '../../../models/spacemgmt/space';
import { AreaSelector, IArea } from '@bmunozg/react-image-area';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const Settings = ({ spaceDetails }: { spaceDetails: Space }) => {
    const [init, setInit] = React.useState<boolean>(true)
    const [settingsSaved, setSettings] = React.useState<Space>(spaceDetails)
    const [workWeekDays,setWorkWeekDays] = React.useState<String[]>([])
    const weekList = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

    React.useEffect(() => {
        if(!init){
            SpaceService.updateSpace(settingsSaved?.spaceId, settingsSaved);
        }
        else{
            const arrayWorkWeekDays =  settingsSaved?.workweekdays?.split(',') ?? [];
            setWorkWeekDays(arrayWorkWeekDays);
        }
        setInit(false);
    }, [settingsSaved])

    const [areas, setAreas] = React.useState<IArea[]>(() => {
        let coordinates = [];
        if (spaceDetails?.coordinates)
            coordinates = spaceDetails.coordinates.split(",").map((item: any) => {
                let cor = item.split("|");
                return { x: cor[0], y: cor[1], width: cor[2], height: cor[3], unit: "%" }
            });
        return coordinates;
    });

    const onChangeHandler = (area: IArea[]) => {
        //
    }

    return (
        <div className='py-4'>
            <div><p className="text-xs text-text-light mb-2.5">Edit Booking Options</p></div>
            <div className='flex'>
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel className='text-sm w-full block ml-0'
                            value="start"
                            control={<Switch color="primary" className='float-right'
                                checked={settingsSaved?.allowRepeat}
                                onChange={(e) => {
                                    setSettings({ ...settingsSaved, allowRepeat: e.target.checked })
                                }} />
                            }
                            label="Allow Repeat Meetings"
                            labelPlacement="start"
                        />
                        <FormControlLabel className='text-sm w-full block ml-0'
                            value="start"
                            control={<Switch color="primary" className='float-right'
                                checked={settingsSaved?.allowWorkHours}
                                onChange={(e) => {
                                    setSettings({ ...settingsSaved, allowWorkHours: e.target.checked })
                                }} />
                            }
                            label="Allow Scheduling only during work hours"
                            labelPlacement="start"
                        />
                    </FormGroup>
                </FormControl>
            </div>
            <div className='flex'>
                <div className='flex-1 w-64'>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Work Weeks & Hours</FormLabel>
                        <FormGroup aria-label="position" row>
                            {
                                weekList.map((x, i) => {
                                    return (
                                        <FormControlLabel
                                            key={i}
                                            value="bottom"
                                            control={
                                                <Checkbox value={x}
                                                    checked={workWeekDays?.includes(x)}
                                                    onChange={(e) => {
                                                        let workWeek = workWeekDays ?? [];
                                                        if (e.target.checked)
                                                            workWeek.push(e.target.value);
                                                        else
                                                            workWeek.splice(workWeek.indexOf(e.target.value), 1);
                                                        setSettings({ ...settingsSaved, workweekdays: workWeek?.toString()})
                                                    }} />
                                            }
                                            label={x[0]} className='m-0 text-xs w-7'
                                            labelPlacement="bottom"
                                        />
                                    )
                                })
                            }
                        </FormGroup>
                    </FormControl>
                </div>
                <div className='flex-1 w-64'>
                    <FormControl size="small" component="fieldset">
                        <FormLabel component="legend">Working hours</FormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FormGroup aria-label="position" row style={{ width: "500px" }}>
                            <FormControl sx={{maxWidth:"140px" }} size="small">
                                <TimePicker ampm={true}
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Start Time" 
                                    value={settingsSaved?.startTime}
                                    onChange={(newValue) => setSettings({ ...settingsSaved, startTime: newValue})}
                                    />
                                </FormControl>
                                <FormControl sx={{ margin:"0px 0px 0px 5px", maxWidth:"140px" }} size="small">    
                                <TimePicker ampm={true}
                                    renderInput={(props) => <TextField {...props} />}
                                    label="End Time" 
                                    value={settingsSaved?.endTime}
                                    onChange={(newValue) => setSettings({ ...settingsSaved, endTime: newValue})}
                                    />
                                </FormControl>    
                            </FormGroup>
                        </LocalizationProvider>
                    </FormControl>
                </div>
            </div>
            <div>
                <FormGroup aria-label="position" row>
                    <FormControlLabel className='text-sm w-full block ml-0 mt-2.5'
                        value="start"
                        control={<Switch color="primary" className='float-right'
                            checked={settingsSaved?.autoDecline}
                            onChange={(e) => {
                                setSettings({ ...settingsSaved, autoDecline: e.target.checked })
                            }} />}
                        label="Automatically decline meetings outside of limits below"
                        labelPlacement="start"
                    />
                </FormGroup>
            </div>
            <div className='w-64'>
                <TextField fullWidth label="Maximum duration hours" variant="outlined" className="pk-input" type="number"
                    value={settingsSaved?.maximumDuration ?? 1}
                    onChange={(e) => {
                        let inpuval = parseInt(e.target.value);
                        if (inpuval >= 1 && inpuval <= 24)
                            setSettings({ ...settingsSaved, maximumDuration: e.target.value })
                    }}
                />
            </div>
            <div>
                <FormGroup aria-label="position" row>
                    <FormControlLabel className='text-sm w-full block ml-0'
                        value="start"
                        checked={settingsSaved?.autoAccept}
                        control={<Switch color="primary" className='float-right' onChange={(e) => {
                            setSettings({ ...settingsSaved, autoAccept: e.target.checked })
                        }} />}
                        label="Auto accept meeting requests"
                        labelPlacement="start"
                    />
                    <span className='text-xs text-text-light' style={{ position: "relative", top: "-8px" }}>Set to &quot;off&quot; if you want to specify users who wants to accept meetings manually</span>
                </FormGroup>
            </div>
            <div className='row'>
                <p>Floor Plan</p>
                <span className='text-xs text-text-light'>Manage your space/Desks</span>
                {/* <img src={floor.src} className="" /> */}
                <AreaSelector
                        unit='percentage'
                        areas={areas}
                        onChange={onChangeHandler}
                        wrapperStyle={{
                            border: '2px solid black'
                        }}
                        globalAreaStyle={{
                            border: '3px dashed red',
                            backgroundColor: 'lightgreen',
                            opacity: '0.5'
                        }}
                    >
                        <img src={settingsSaved?.floorPlan} alt='my image' style={{ width: '100%' }} />
                    </AreaSelector>
            </div>

        </div>
    );

}
export default Settings;
import * as React from "react";
import Layout from "../../../../components/Layout";
//import Button from "../../../../components/common/Button";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Breadcrumbs from "../../../../components/common/Breadcrumbs";
import ThemeService from "../../../../services/theme.service";
import Theme from "../../../../models/theme/theme";
import Router, {useRouter} from 'next/router';
import {TextField, ButtonGroup, FormControl,InputLabel,MenuItem,Select,Switch, } from "@mui/material";
import ApiResponse from "../../../../models/ApiResponse";
import IncDecCounter from '../../../../components/incDecCounter';
import ModalService from "../../../../components/lib/modalPopup/services/ModalService";
import ColorPalette from "./ColorPalette";
import DialogModal from "../../../../components/common/dialogModal";
import { useState } from "react";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

let breadcrumbPaths = [
  { name: "Home", path: "/" },
  { name: "Content Management", path: "/playlist" },
  { name: "Theme Management", path: "/playlist/manage/theme" },
];
const names = [
    'Arabic',
    'English India',
    'English USA',
    'English UK',
    'French',
    'German',
    'Hindi',
    'Spanish',
  ];
const fontFamilyList = [
    'Arial',
    'Verdana',
    'Tahoma'
  ];

const fontSizeList = [
    '10px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
    '26px',
    '28px',
    '30px',
    '32px'
  ]; 
  const watermarkPlaylist = [
    'Queens Tech Meet up 6',
    'Queens Tech Meet up 7',
    'Queens Tech Meet up 8',
  ];
  const signagePlaylist = [
    'Playlist 1',
    'Playlist 2',
    'Playlist 3',
  ];

  let themeData = {
    "allowBooking": false,
    "confirmBooking": false,
    "qrcodeauth":false,
    "changeEndTime": false,
    "endBooking": false,
    "showOrganizer": false,
    "hideSubject": false,
    "showAppointmentsForDays":0,
    "findRoom": false,
    "enableFaultReporting": false,
    "accessSettings": false,
    "enableLEDStatus": false,
    "scrollSubject": false,
    "signageOnAvailability": false,
    "availableStatusColor": 'green',
    "occupiedStatusColor": 'red',
    "subjectFont": 'Arial',
    "subjectFontSize": '24px',
    "organizerFont": 'Arial',
    "organizerFontSize": '24px',
    "upcomingMeetingSubjectFont": 'Arial',
    "upcomingMeetingSubjectFontSize": '24px',
    "upcomingMeetingOrganizerFont": 'Arial',
    "upcomingMeetingOrganizerFontSize": '24px',
    "watermarkPlaylist": '',
    "signagePlaylist": '',
    "languages": [],
    "showAppointmentForDays": 0,
    "startSignageMinute" :0,
    "stopSignageMinute":0,
    "confirmbtnbefore":10,
    "confirmbtnafter":15
  }
  let initialTheme = {
    id: 0,
    themename: '',
    themethumbnail: 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80',
    themetype: 'Corporate Light',
    logo: '', 
    background: '',
    themeData: themeData,
    themedata: '' 
  }
  
export default function AddTheme() {
  const router = useRouter()
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isOccupiedOpen, setIsOccupiedOpen] = useState(false);

  const [availableColor, setAvailableColor] = useState<string>("#00FF00"); // Default to green
  const [occupiedColor, setOccupiedColor] = useState<string>("#FF0000"); // Defa

  //const [isServiceOpen, setIsServiceOpen] = useState(false);
  //const [isoccupiedOpen, setIsocuupiedOpen] = useState(false);
  const [isaddvisitorservice, setIsaddvisitorServiceOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("red");
  const {id} = router.query
  const  isAddTheme = id ? false : true ;
  const [checked, setChecked] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>(initialTheme);
  const [age, setAge] = React.useState("");
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);
  const handleChange = () => {};

  React.useEffect(() => {
    if(id){
      fetchMyApi(parseInt(id.toString()));
    }
  }, [])

  async function fetchMyApi(themeId:number) {
    setLoader(true);
    var response = await ThemeService.getThemeDetails(themeId);
    if (response.status == true) {
      let themeDetails:Theme = response.data;
      themeDetails.themeData = JSON.parse(response.data.themedata);
      setTheme(themeDetails);
      console.log(themeDetails);
    }
    setLoader(false);
  }

  const handleChangeMultiple = (SelectChangeEvent) => {
    const value: string[] = [];
    const {options,name} = SelectChangeEvent.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    if(theme){
      const newTheme = {...theme};
      newTheme.themeData[name] = value
      setTheme(newTheme);
    }
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(theme){
      const {name, checked} = event.target
      const newTheme = {...theme};
      newTheme.themeData[name] = checked
      setTheme(newTheme);
    }
  };

  const handleAvailableColorSelect = (color: string) => {
    setAvailableColor(color);
    const newTheme = {...theme};
    newTheme.themeData["availableStatusColor"] = color;
    setTheme(newTheme);
    setIsServiceOpen(false); // Close the modal
  };

  const handleOccupiedColorSelect = (color: string) => {
    setOccupiedColor(color);
    const newTheme = {...theme};
    newTheme.themeData["occupiedStatusColor"] = color;
    setTheme(newTheme);
    setIsOccupiedOpen(false); // Close the modal
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsServiceOpen(false); // Close the modal after selecting the color
    console.log("Selected Color from Palette:", color);
  };

  const handleTextFieldChange = (value,name) => {
    if(theme){
      const newTheme = {...theme};
      newTheme[name] = value
      setTheme(newTheme);
    }
  };

  const opencolorpaltee =() => {
    ModalService.open(ColorPalette,{});
  };


  const handleSelectChange = (value,name,isThemeData) => {
    if(theme){
      const newTheme = {...theme};
      if(isThemeData){
        newTheme.themeData[name] = value
      }
      else{
        newTheme[name] = value
      }
      setTheme(newTheme);
    }
  };

  const handleCounter = (action:string,name:string) => {
    if(theme){
      const newTheme = {...theme};
      newTheme.themeData[name] = action == 'INCREASE' ? newTheme.themeData[name] + 1 : newTheme.themeData[name] - 1
      setTheme(newTheme);
    }
  }

  async function onSubmit(){
    setLoader(true);
    var response: ApiResponse;
    var formData = new FormData();
    formData["theme"] = theme; 
    debugger;
    if(isAddTheme){
      response = await ThemeService.addTheme(theme);  
    }
    else{
      response = await ThemeService.updateTheme(theme);  
    }
    if (response.status == true) {
        Router.push({pathname:'/playlist/manage/theme'})
    }
    setLoader(false);
  };

  const [logoImgUrl, setLogoImgUrl] = React.useState('');
  const handleLogoUpload = async e => {
    const file = e.target.files[0];
    imageUpload('logo',file);
  };

  const [backgroundImgUrl, setBackgroundImgUrl] = React.useState('');
  const handleBackgroundUpload = async e => {
    const file = e.target.files[0];
    imageUpload('background',file);
  }  

  async function imageUpload(name:string,file:any)  {
    try {
      //// ToStore Image as Files in Server
      // const formData = new FormData();
      // formData.append('file', file);
      // var response = await ThemeService.upload(formData);
      // if (response.status == true) {
      //   if(theme){
      //     const newTheme = {...theme};
      //     newTheme[name] = response.data.url;
      //     setTheme(newTheme);
      //   }
      // }

      //// ToStore Image as Bytes
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
          if(theme){
            const newTheme = {...theme};
            newTheme[name] = reader.result;
            setTheme(newTheme);
          }
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
      };

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center m-6">
        <div>
          <h2 className="text-xl font-bold">Theme Management</h2>
          <Breadcrumbs currentPage={ isAddTheme ? "Add Theme" : "Edit Theme"} routes={breadcrumbPaths} />
        </div>
        <Button variant="contained" type="submit" onClick={() => onSubmit() } >{isAddTheme ? "Add Theme" : "Update Theme"}</Button>
      </div>
      {loader ? <div>Loading... </div> :
      <div className="flex gap-[3%] m-6">
        <div className="flex basis-1/3 flex-col">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-helper-label"> Base Theme </InputLabel>
            <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper"
              value={theme?.themetype}  name='themetype' label="Base Theme"
              onChange={(e) => {handleSelectChange(e.target.value,e.target.name,false)}} fullWidth>   
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={'Corporate Light'}>Corporate Light</MenuItem>
              <MenuItem value={'Corporate Dark'}>Corporate Dark</MenuItem>
            </Select>
          </FormControl>
          <div className="flex justify-between mt-4 text-slate-500">
            <span>Allow Booking</span>
            <Switch 
              checked={theme?.themeData.allowBooking}
              // checked={checked}
              // onChange={() => handleToggle('allowBooking')}
              onChange={(e) => {handleToggle(e)}}
              // onChange={switchHandler}
              name="allowBooking"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Confirm Booking</span>
            <Switch
              checked={theme?.themeData.confirmBooking}
              onChange={(e) => {handleToggle(e)}}
              name="confirmBooking"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>QR Code Authentication</span>
            <Switch
              checked={theme?.themeData.qrcodeauth}
              onChange={(e) => {handleToggle(e)}}
              name="qrcodeauth"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Change End Time</span>
            <Switch
              checked={theme?.themeData.changeEndTime}
              onChange={(e) => {handleToggle(e)}}
              name="changeEndTime"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>End booking</span>
            <Switch
              checked={theme?.themeData.endBooking}
              onChange={(e) => {handleToggle(e)}}
              name="endBooking"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Show Organizer</span>
            <Switch
              checked={theme?.themeData.showOrganizer}
              onChange={(e) => {handleToggle(e)}}
              name="showOrganizer"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Hide Subject</span>
            <Switch
              checked={theme?.themeData.hideSubject}
              onChange={(e) => {handleToggle(e)}}
              name="hideSubject"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span> Show Appointments for (Days)</span>
            <span >
              <IncDecCounter value={theme?.themeData.showAppointmentsForDays} onDecreaseClick={() => handleCounter('DECREASE','showAppointmentsForDays')} 
               onIncreaseClick={() => handleCounter('INCREASE','showAppointmentsForDays')}></IncDecCounter>
            </span>
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Find Room</span>
            <Switch
              checked={theme?.themeData.findRoom}
              onChange={(e) => {handleToggle(e)}}
              name="findRoom"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Enable Fault Reporting</span>
            <Switch
              checked={theme?.themeData.enableFaultReporting}
              onChange={(e) => {handleToggle(e)}}
              name="enableFaultReporting"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Access Settings</span>
            <Switch
              checked={theme?.themeData.accessSettings}
              onChange={(e) => {handleToggle(e)}}
              name="accessSettings"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Enable LED Status</span>
            <Switch
              checked={theme?.themeData.enableLEDStatus}
              onChange={(e) => {handleToggle(e)}}
              name="enableLEDStatus"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Scroll Subject</span>
            <Switch
              checked={theme?.themeData.scrollSubject}
              onChange={(e) => {handleToggle(e)}}
              name="scrollSubject"
              color="primary"
            />
          </div>
          <div className="flex justify-between mt-1 text-slate-500">
            <span>Signage on Availability</span>
            <Switch
              checked={theme?.themeData.signageOnAvailability}
              onChange={(e) => {handleToggle(e)}}
              name="signageOnAvailability"
              color="primary"
            />
          </div>
        </div>
        <div className="flex basis-1/3 flex-col">
          <div >
            <TextField fullWidth label="Theme Name" name='themename' variant="outlined" className="pk-input" value={theme?.themename} 
            onChange={(e) => {handleTextFieldChange(e.target.value,e.target.name)}}
            // disabled={isAddTheme ?  false : true} 
            />
          </div>
          <div className="flex gap-2 mt-4 text-slate-500 items-center w-[200px] justify-between">
            <span>Available Status Color</span>
            <span className="h-[24px] w-[24px] rounded-sm cursor-pointer" 
             style={{ backgroundColor: availableColor }}
             onClick={() => setIsServiceOpen(true)}>
            </span>
          </div>
          <div className="flex gap-2 mt-4 text-slate-500 items-center w-[200px] justify-between">
            <span>Occupied Status Color</span>
            <span className="h-[24px] w-[24px] rounded-sm cursor-pointer" 
                style={{ backgroundColor: occupiedColor }}
                onClick={() => setIsOccupiedOpen(true)}
            ></span>
            {/* <span className="h-[24px] w-[24px] bg-red-600 rounded-sm cursor-pointer" onClick={() =>  setIsServiceOpen(true)}></span> */}
          </div>
        
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span className="basis-3/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label"> Subject Font</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='subjectFont'
                  value={theme?.themeData?.subjectFont} label="Subject font" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontFamilyList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </span>
            <span className="basis-1/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='subjectFontSize'
                  value={theme?.themeData?.subjectFontSize} label="Size" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontSizeList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span className="basis-3/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Organizer Font</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='organizerFont'
                  value={theme?.themeData?.organizerFont} label="Organizer Font" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontFamilyList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </span>
            <span className="basis-1/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='organizerFontSize'
                  value={theme?.themeData?.organizerFontSize} label="Size" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontSizeList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>                
              </FormControl>
            </span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span className="basis-3/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Upcoming Meeting Subject</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='upcomingMeetingSubjectFont'
                  value={theme?.themeData?.upcomingMeetingSubjectFont} label="Upcoming Meeting Subject" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontFamilyList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>           
              </FormControl>
            </span>
            <span className="basis-1/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='upcomingMeetingSubjectFontSize'
                  value={theme?.themeData?.upcomingMeetingSubjectFontSize} label="Size" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontSizeList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>                 
              </FormControl>
            </span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span className="basis-3/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Upcoming Meeting Organizer</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='upcomingMeetingOrganizerFont'
                  value={theme?.themeData?.upcomingMeetingOrganizerFont} label="Upcoming Meeting Organizer" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontFamilyList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select> 
              </FormControl>
            </span>
            <span className="basis-1/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='upcomingMeetingOrganizerFontSize'
                  value={theme?.themeData?.upcomingMeetingOrganizerFontSize} label="Size" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {fontSizeList.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>              
              </FormControl>
            </span>
            
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span className="basis-3/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Watermark Playlist</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='watermarkPlaylist'
                  value={theme?.themeData?.watermarkPlaylist} label="Watermark Playlist" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {watermarkPlaylist.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </span>
            <span className="basis-2/5">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-helper-label">Signage Playlist</InputLabel>
                <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" name='signagePlaylist'
                  value={theme?.themeData?.signagePlaylist} label="Signage Playlist" onChange={(e) => {handleSelectChange(e.target.value,e.target.name,true)}}>
                  {signagePlaylist.map((name) => (
                    <MenuItem key={name} value={name} className='text-slate-600'>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span>Start signage</span>
            <span >
              <IncDecCounter value={theme?.themeData.startSignageMinute} onDecreaseClick={() => handleCounter('DECREASE','startSignageMinute')} 
               onIncreaseClick={() => handleCounter('INCREASE','startSignageMinute')}></IncDecCounter>
            </span>
            <span>minute(s) after the meeting</span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span>Stop signage</span>
            <span >
              <IncDecCounter value={theme?.themeData.stopSignageMinute} onDecreaseClick={() => handleCounter('DECREASE','stopSignageMinute')} 
              onIncreaseClick={() => handleCounter('INCREASE','stopSignageMinute')}></IncDecCounter>
            </span>
            <span > minute(s) before the meeting</span>
          </div>
          <div className="flex gap-2 mt-6 text-slate-500 items-center ">
            <span>Confirm Button</span>
            <span >
              <IncDecCounter value={theme?.themeData.confirmbtnbefore} onDecreaseClick={() => handleCounter('DECREASE','confirmbtnbefore')} 
              onIncreaseClick={() => handleCounter('INCREASE','confirmbtnbefore')}></IncDecCounter>
            </span>
            <span > minute(s) before and</span>
            <span >
              <IncDecCounter value={theme?.themeData.confirmbtnafter} onDecreaseClick={() => handleCounter('DECREASE','confirmbtnafter')} 
              onIncreaseClick={() => handleCounter('INCREASE','confirmbtnafter')}></IncDecCounter>
            </span>
            <span > minute(s) after meeting start</span>
          </div>
        </div>
        <div className="flex basis-1/3 flex-col gap-4">
          <div className="flex ml-2 gap-4 mb-4">
              <span className="flex flex-col gap-4">
                  <span className="inline-block h-[150px] w-[150px] bg-slate-400">
                    {theme?.logo && <img src={theme?.logo} />}
                  </span>
                  <Button component="label" variant="contained" onChange={handleLogoUpload}>
                    Logo
                    <VisuallyHiddenInput type="file" />
                  </Button>
              </span>
              <span className="flex flex-col gap-4">
                  <span className="inline-block h-[150px] w-[150px] bg-slate-400">
                    {theme?.background && <img src={theme?.background} />}
                  </span>
                  <Button component="label" variant="contained" onChange={handleBackgroundUpload}>
                    Background
                    <VisuallyHiddenInput type="file" />
                  </Button>
              </span>
          </div>
        <div className="flex w-full">
      <FormControl sx={{ m: 1, minWidth: 120 , width: 250}} >
        <InputLabel shrink htmlFor="select-multiple-native">Language</InputLabel>
        <Select multiple native value={theme?.themeData?.languages} fullWidth className="pt-2" name='languages'
         sx={{"& .MuiNativeSelect-select" : { paddingTop : '0px',height: "260px",paddingBottom : '0px'}}} 
          onChange={(e) => {handleChangeMultiple(e)}}
          onClick={(e) => console.log(e)}
          label="Language"
          inputProps={{id: 'select-multiple-native',}}>
          {names.map((name) => (
            <option key={name} value={name} className='text-slate-600'>
              {name}
            </option>
          ))}
        </Select>
        <DialogModal
          open={isServiceOpen}
          onClose={() => {
            setIsServiceOpen(false);
          }}
          modalTitle="Select Available Color"
        >
            <ColorPalette onColorSelect={handleAvailableColorSelect} />
        </DialogModal>
        <DialogModal
          open={isOccupiedOpen}
          onClose={() => {
            setIsOccupiedOpen(false);
          }}
          modalTitle="Select Occupied Color"
        >
            <ColorPalette onColorSelect={handleOccupiedColorSelect} />
        </DialogModal>
      </FormControl>
    </div>  
        </div>  
      </div>
      } 
    </Layout>
  );
}

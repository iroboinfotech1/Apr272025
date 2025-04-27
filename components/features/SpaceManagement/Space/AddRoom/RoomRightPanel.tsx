import CloseIcon from '@mui/icons-material/Close';
import styles from './AddRoom.module.css';

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useMemo, useState } from 'react';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DropdownProps } from '../../../../../services/constants';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { ListItem, Paper } from '@mui/material';
import React from 'react';
import { IArea } from '@bmunozg/react-image-area/dist/src';
import FacilityService from '../../../../../services/facility.service';
import { Facility } from '../../../../../models/spacemgmt/facility/FacilityModel';
import ConnectorManagementService from "../../../../../services/connectorManagement.service";
import ConnectionDetails from '../../../../../models/connector/connectionDetails';
import IncDecCounter from '../../../../incDecCounter';

const schema = yup.object().shape({
    spaceAliasName: yup.string(),
    group: yup.string(),
    calender: yup.string(),
    email: yup.string(),
    directionNotes: yup.string()
});



const RoomRightPanel = (props: any) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return props.spaceDetails;
        }, [props.spaceDetails])
    });

    const buttonText = (props.addSpace ? 'Add ' : 'Update ') + props.space

    const [facilities, setFacilities] = useState<Facility[]>([]);
    
    //const [connectorList, setConnectorList] = useState<any[]>([]);
    const [tmpconnectorList , setconnectornameList]= useState<any[]>([]);

    const [srccalendarList, setsrccalendarList] = useState<any[]>([]);
    const [calendarList, setcalendarList] = useState<any[]>([]);
    const [tmpcalendarList , setcalendarnameList]= useState<any[]>([]);
    const [spaceDetails , setSpaceDetails]= useState<any>();
    const [spaceImage , setSpaceImage]= useState<any>();
    const [selectedFacility, setSelectedFacility] = useState<number[]>(props?.spaceDetails?.servicingFacilities ?? []);
    
    const [connectorList, setConnectorList] = useState<any[]>(() => {
        return props.spaceDetails?.mappedConnectorIds ? props.spaceDetails?.mappedConnectorIds : [] ;
    });

    useEffect(() => {
        //debugger;
        fetchMyApi();
        if(props.addSpace && !props.spaceDetails && props.floorDetails && props.floorDetails.spaceDetails){
            setSpaceDetails(props.floorDetails.spaceDetails);
        }else if(!props.addSpace && props.spaceDetails){
            setSpaceDetails(props.spaceDetails);
        }
        if(props.spaceDetails.spaceImage){
            setSpaceImage(props.spaceDetails.spaceImage);
        }
        if(props.spaceDetails.email){
            setValue("email", props.spaceDetails.email?.replace(";","\n"));
        }
    }, []);
  
  async function getCalendarList(connectorname :any,calledOnLoad:boolean) 
  {
    if(connectorname!==undefined && connectorname.length>0)
    {
        //debugger;
        const calendarList = await ConnectorManagementService.getCalenders(connectorname[0]);
        setsrccalendarList(calendarList);
        const tmpcalendarList = calendarList.map((x) => { return {
                    name: x.title   
                };
            });
        setcalendarnameList(tmpcalendarList);
        //
        if(calledOnLoad && calendarList?.length > 0 && props.spaceDetails.mappedCalendarIds && props.spaceDetails.mappedCalendarIds.length >0)
        {
            let tempPrepopCalList : Array<any[]> = [];
            props.spaceDetails.mappedCalendarIds.forEach((cal : any[]) =>{
                var item = calendarList.find( c => c.sourceCalendarId == cal);
                if(item){
                    tempPrepopCalList.push(item.title);
                }
            });
            if(tempPrepopCalList){
                setcalendarList(tempPrepopCalList);
            }
        } 
    }
  }

 async function fetchMyApi() {
        var connectorListData = await ConnectorManagementService.getAllConnectors();
        const tmpconnectorList = connectorListData.map((x) => { return {
                    name: x.name
                };
            });
        setconnectornameList(tmpconnectorList);
        //var response = await FacilityService.getByOrgId(props?.floorDetails?.organization);
        var response = await FacilityService.getByOrgIdAndFacilityTypeId(props?.floorDetails?.organization,props?.floorDetails?.spaceId);
        if (response.status === true) {
            setFacilities(response.data);
        }
        if(connectorList && connectorList.length >0)
        {
            getCalendarList(connectorList,true);
        }
        if(props.spaceDetails?.email){
            setValue("email", props.spaceDetails.email?.replace(";","\n"));
        }
    }
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.target.files);
        if (e.target.files != null && e.target.files.length > 0) {
            getBase64(e.target.files[0]);
        }
    }

    const getBase64 = (file: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSpaceImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onSubmit = (data: any) => {
        //debugger;
        console.log('submitted data', data);
        data.floorDetails = props?.floorDetails;
        data.spaceImage = spaceImage;
        if(calendarList && calendarList.length>0)
        {
            const myArray: string[] = calendarList
            .map((element) => {
              const selectedCalendar = srccalendarList?.find((item) => item.title === String(element));
              return selectedCalendar?.sourceCalendarId;
            })
            .filter((selectedCalendarId) => selectedCalendarId !== undefined);
            data.mappedCalendarIds = myArray;
        }
        data.mappedConnectorIds = connectorList && connectorList.length > 0 ? [connectorList[0]] : [];

        data.servicingFacilities = selectedFacility;
        props.afterSubmit(data);
    }
   
    const onFacililitiesChange = (e: any,fieldType:string,resources: any) => {
        if(fieldType =='LIST'){
            selectedFacility.push(parseInt(e.target.value));
            setSelectedFacility([...selectedFacility]);

            var r = resources.find( r => selectedFacility.includes(r.resourceId) && r.resourceId != e.target.value)
            if(r){
                let index = selectedFacility.indexOf(parseInt(r.resourceId));
                if (index > -1) {
                    setSelectedFacility([...selectedFacility.splice(index, 1)]);     
                }
            }
        }else{
            let index = selectedFacility.indexOf(parseInt(e.target.value));
            if (index > -1 && !e.target.checked) {
                setSelectedFacility([...selectedFacility.splice(index, 1)]);     
            }
            else {
                selectedFacility.push(parseInt(e.target.value));
                setSelectedFacility([...selectedFacility]);
            }
        }
    }

    const handleDelete = (chipToDelete: IArea) => () => {
        props.onAreaDelete(chipToDelete);
    };
    
    const handleChange = (event: SelectChangeEvent<typeof connectorList>) => {
        const {  target: { value } } = event;
        setConnectorList( typeof value === 'string' ? value.split(',') : value );
        //setConnectorList(value);
        if(value && value.length >0)
        {
          getCalendarList(value,false);
        }
        else
        {
           setcalendarnameList([]);
        }
    };

    const handleCalendarChange = (event: SelectChangeEvent<typeof calendarList>) => {
        //debugger;
        const {  target: { value }  } = event;
        setcalendarList( typeof value === 'string' ? value.split(',') : value );
        if(value && value.length > 0 ){
            let newList = "";
            //let newValue : any;
            let newValue:any = value === 'string' ? value.split(',') : value;
            newValue.forEach(element => {
                var item = srccalendarList.find( item => item.title == element);
                if(item){
                    if(newList == ""){
                        newList = item.sourceCalendarId
                    }
                    else{
                        newList = newList + "\n" + item.sourceCalendarId
                    }  
                }
            });
            if(newList){
                setValue("email", newList);
            }
        }
        else{
            setValue("email", "");
        }
    };

    const getResourceId = (resources: any) => {
        for (var i=0; i < selectedFacility.length; i++) {
            if(resources.find( r => r.resourceId == selectedFacility[i]))
                return selectedFacility[i];
        }
        return 0;
    };

    const handleCounter = (action:string,facilityId: any, resourceId: any) => {
        let facility =  facilities.find( f => f.facilityId == facilityId);

        let newResources : any = [] 
        const newFacilities = facilities?.map(fac => {
            if(fac.facilityId == facilityId){
                newResources = fac?.resources?.map(resource => {
                    if (resource?.resourceId === resourceId) {
                        return {
                            ...resource,
                            count: (action == 'INCREASE') ? resource?.count + 1 : resource?.count - 1,
                        };
                    } else {
                        return resource;
                    }
                });
                fac.resources = newResources;
                return fac;
            }else{
                return fac;
            }

        })

        setFacilities(newFacilities);
        //Invoke API to Update Change
        var newResource = newResources!.find(r => r.resourceId == resourceId);
        if (newResource) {
            newResource.spaceId = props.spaceDetails?.spaceId;
            FacilityService.UpdateResourceStatus(newResource);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"col-12 col-md-4 pb-3 " + styles.right_panel} >
            <div className="row">
                <div className="col-12 p-3  ">
                    <div className="float-end mt-2 " onClick={props.close}>
                        <CloseIcon style={{ color: 'grey' }}></CloseIcon>
                    </div>
                </div>
                <div className={"col-12 " + styles.right_panel_content}>
                    <div className='fw-bold'>{spaceDetails?.organization?.orgName}</div>
                    <div className='small text-black-50'>{props.floorDetails?.floorData?.floorName + ", " + spaceDetails?.building?.buildingName} </div>
                </div>
                <div className="col-12 mt-3">
                    <TextField {...register('spaceAliasName')} fullWidth label={props.space + " Alias"} variant="outlined" className="pk-input"
                        error={!!errors.alias}
                        helperText={errors.alias?.message?.toString()}
                    />
                </div>
                <div className="col-12 mt-3">
                    <TextField {...register('groupname')} fullWidth label={props.space + " Group"} variant="outlined" className="pk-input"
                        error={!!errors.group}
                        helperText={errors.group?.message?.toString()}
                    />
                </div>
                <div className="col-12 mt-3">
                    <FormControl fullWidth className="pk-dropdown" >
                        <InputLabel id="demo-multiple-checkbox-label">Select Connector</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            className='pk-select'
                            multiple
                            value={connectorList}
                            onChange={handleChange}
                            input={<OutlinedInput label="Select Connector" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={DropdownProps}
                        >
                        {tmpconnectorList.map((connector) => (
                            <MenuItem key={connector.name} value={connector.name}>
                                <Checkbox checked={connectorList.indexOf(connector.name) > -1} />
                                <ListItemText primary={connector.name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="col-12 mt-3">
                    <FormControl fullWidth className="pk-dropdown" >
                        <InputLabel id="demo-multiple-checkbox-label">Select Calenders</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            className='pk-select'
                            multiple
                            value={calendarList}
                            onChange={handleCalendarChange}
                            input={<OutlinedInput label="Select Calenders" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={DropdownProps}
                        >
                            {tmpcalendarList.map((calendar) => (
                                <MenuItem key={calendar.name} value={calendar.name}>
                                    <Checkbox checked={calendarList.indexOf(calendar.name) > -1} />
                                    <ListItemText primary={calendar.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="col-12 mt-3">
                   <TextField {...register('email')} fullWidth label="Email" variant="outlined" className="pk-input"
                            error={!!errors.email}
                            multiline disabled={true}
                            helperText={errors.email?.message?.toString()}/>
                </div>
                <div className="col-12 mt-3">
                    <TextField
                        {...register('directionNotes')}
                        fullWidth
                        label= {props.space + " directional coordinates"}
                        multiline
                        rows={4}
                        variant="outlined" className="pk-input"
                        error={!!errors.directionNotes}
                        helperText={errors.directionNotes?.message?.toString()}
                    />
                </div>
                <div className="col-12 mt-3">
                    <div className="row">
                        <div className="col-4">
                            <img className="w-[100px] aspect-video rounded-md" src={spaceImage}></img>
                        </div>
                        <div className="col-8 justify-center mt-2">
                            <Button variant="contained" component="label">
                                Upload {props.space + " image"}
                                <input hidden accept="image/*" onChange={handleFileSelected} type="file" />
                            </Button>
                        </div> 
                    </div>
                </div>
                {facilities.map((x: any, i: number) => {
                    // if(x.facilityName === "Type" || x.facilityName === "Desk Type"){
                    if(x.type === "list"){    
                        return (
                            <div className="col-12 mt-4" key={i}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="fw-bold">
                                            {x.facilityName}
                                        </div>
                                    </div>
                                </div>
                                <div className="row p-2" key={i}>
                                    <div className="col-12 border-bottom">
                                        <FormControl fullWidth className="pk-dropdown" style={{marginBottom:"10px"}}>
                                            <InputLabel id="demo-simple-select-label">Select {x.facilityName}</InputLabel>
                                            <Select defaultValue={0} value={getResourceId(x.resources)} label={"Select " + x.facilityName}
                                                onChange={(e) => onFacililitiesChange(e,'LIST',x.resources)}>
                                                {x.resources.map(r => {
                                                    return <MenuItem key={r.resourceId} value={r.resourceId}>{r.name}</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
    
                        )
                    }
                    else{
                        return (
                            <div className="col-12 mt-4" key={i}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="fw-bold">
                                            {x.facilityName}
                                        </div>
                                    </div>
                                </div>
                                {x.resources.map((y: any, i: number) => {
                                    if(y.type === "count"){
                                        return (
                                            <div className="row p-2" key={i}>
                                                <div className="col-12 border-bottom">
                                                    <div className="float-start">
                                                        {y.name}
                                                    </div>
                                                    <div className="float-end">
                                                    <IncDecCounter value={y?.count} onDecreaseClick={() => handleCounter('DECREASE',x.facilityId, y?.resourceId)}
                                                        onIncreaseClick={() => handleCounter('INCREASE',x.facilityId, y?.resourceId)}></IncDecCounter>
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                    } else if(y.type === "toggle"){
                                        return (
                                            <div className="row p-2" key={i}>
                                                <div className="col-12 border-bottom">
                                                    <div className="float-start">
                                                        {y.name}
                                                    </div>
                                                    <div className="float-end">
                                                        <Switch value={y.resourceId} checked={y.isEnabled} onChange={(e) => onFacililitiesChange(e,'SWITCH',x.resources)} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
    
                        )
                    }
                    
                })}

                <div className="col-12 text-center mt-4">
                    <Button variant="contained" type="submit">{buttonText}</Button>
                </div>

            </div>

        </form>
    );
}
export default RoomRightPanel;



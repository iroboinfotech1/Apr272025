import React, { useContext } from 'react'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import MeetingDetails from "./MeetingDetails";
import { useEffect, useState } from "react";
import ConnectorManagementService from "../../../../services/connectorManagement.service";
import { ConnectorContext } from '../../../../pages/connector';
import Meeting from '../../../../models/connector/meeting';
import moment from 'moment';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Card } from '@mui/material';
import { debug } from 'console';

// const options = ['Squash and merge', 'Einstein Meeting Room Calender', 'Rebase and merge'];

function RoomsandCalendersTab({ spaceDetails }: any) {
  const contextData: any = useContext(ConnectorContext)
  const [calData, setCalData] = useState<Meeting[]>([]);
  const [dateString, setdateString] = useState("Today")
  const [startTime, setStartTime] = useState<moment.Moment>(moment(new Date()))
  const [ApistartTime, setApiStartTime] = useState<moment.Moment>(moment(new Date()))
  const [endTime, setEndTime] = useState(0)
  const [displayType, setDisplayType] = useState("Day")

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [calenderList, setCalanderList] = React.useState<any[]>([]);
  if(spaceDetails===null)
  {
    spaceDetails=contextData;
  }
  //const [selectedConnectorName, setSelectedConnectorName] = useState(spaceDetails?.mappedConnectorIds?.[0]);
  const [selectedConnectorName, setSelectedConnectorName] = useState(contextData?.connectorDetailId?.name);

  const handleClick = () => {
    // console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  async function fetchcalender() {
    var connectorname =contextData.connectorDetailId.name ?contextData.connectorDetailId.name : selectedConnectorName;
    console.log(connectorname);
    var response = await ConnectorManagementService.getSourceCalenders(connectorname);
    setCalanderList(response);
  }
  useEffect(() => {
    const fetchData = async () => {
      const connectorName = contextData.connectorDetailId.name || selectedConnectorName;
      const response = await ConnectorManagementService.getSourceCalenders(connectorName);
      setCalanderList(response);
      var filterCalenderList: any = []
      if(response && response.length > 0 && spaceDetails!==null && spaceDetails !== undefined){
        filterCalenderList = response.filter( id => spaceDetails?.mappedCalendarIds?.includes(id?.sourceCalendarId));
        setCalanderList(filterCalenderList);
      }
    };
    fetchData();
  }, [contextData.connectorDetailId.name]);

  useEffect(() => {
    fetchMyApi();
  }, [ApistartTime]);
  
  useEffect(() => {
    const fetchCalenderInstances = async () => {
      const selectedCalendarId = calenderList[0]?.calendarId;
      const conectionDetails = contextData.connectorDetailId;
      if (selectedCalendarId) {
        conectionDetails.calendarId = selectedCalendarId;
        conectionDetails.startTime = moment().format('L');
        conectionDetails.endTime = moment().add(1, 'days').format('L');
        if(conectionDetails!==null && conectionDetails.calendarId)
        {
          const response = await ConnectorManagementService.getCalenderInstances(conectionDetails.calendarId, conectionDetails.startTime, conectionDetails.endTime);
          setCalData(response);
        }
      }
    };
    fetchCalenderInstances();
  }, [calenderList]);

  async function fetchMyApi() {
    console.log(calenderList[0]?.calendarId);
    const conectionDetails = contextData.connectorDetailId;
    conectionDetails.calendarId = calenderList[selectedIndex]?.calendarId;
    conectionDetails.startTime = ApistartTime.format('L');
    conectionDetails.endTime = ApistartTime.add(endTime, 'days').format('L');
    if(conectionDetails!==null && conectionDetails.calendarId)
    {
       var response = await ConnectorManagementService.getCalenderInstances(conectionDetails.calendarId, conectionDetails.startTime, conectionDetails.endTime);
       setCalData(response);
       console.log("Fourth"+ calenderList);
    }
  }

  const updateDateString = (newdate: moment.Moment) => {
    setdateString(newdate.format('L') == moment().format('L') ? "Today" : newdate.format('L'));
  }

  const onDateIconClick = (daycount: number) => {
    const newdate = moment(startTime.add(daycount, 'days'))
    setStartTime(newdate);
    updateDateString(newdate);
    makeDateChange(newdate, displayType);
  }
  const onDateChange = (e: any) => {
    var newdate = moment(new Date(e.target.value))
    setStartTime(newdate);
    updateDateString(newdate);
    makeDateChange(newdate, displayType);
  }
  const onEndDateChange = (e: any) => {
    setDisplayType(e.target.value);
    makeDateChange(startTime, e.target.value);
  }
  const makeDateChange = (newdate: any, dt: any) => {
    switch (dt) {
      case "Day":
        setEndTime(0);
        setApiStartTime(moment(newdate));
        break;
      case "Work Week":
        var apidate = moment(startTime);
        setApiStartTime(apidate.startOf('week').add(1, 'days'));
        setEndTime(4);
        break;
      case "Week":
        var apidate = moment(startTime);
        setApiStartTime(apidate.startOf('week'));
        setEndTime(6);
        break;
      case "Month":
        var apidate = moment(startTime);
        setApiStartTime(apidate.startOf('month'));
        setEndTime(startTime.daysInMonth() - 1);
        break;
      default:
        break;
    }
    // fetchMyApi();
  }


  return (
    <div>
      <React.Fragment>
        <ButtonGroup variant="contained" className='w-full' ref={anchorRef} aria-label="split button">
          <Button onClick={handleClick} style={{ backgroundColor: "rgb(219 234 254)", width: "100%" }}>
            <div
              className="items-center p-0 rounded mb-2 w-full" >
              <div style={{ height: '15%' }} aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}>
                 {(calenderList.length > 0 && (
                  <>                
                <div className="font-bold capitalize text-left text-base" style={{ color: "#000" }}> {calenderList[selectedIndex]?.title}</div>
                <div className="text-xs text-text-light capitalize text-left">
                  {calenderList[selectedIndex]?.description}
                </div>
              </>
                )) || (
                  <div
                    className="font-bold capitalize text-left text-base"
                    style={{ color: "#000" }}
                  >
                    {" "}
                    No Calendar Available
                  </div>
                )}
              </div>

            </div>
            <KeyboardArrowDownIcon onClick={handleToggle} className='text-black' />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Card style={{ width: "100% !important" }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {calenderList.map((option, index) => (
                      <MenuItem
                        key={index}
                        // disabled={index === 2}
                        // selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option.title}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Card>
            </Grow>
          )}
        </Popper>
      </React.Fragment>

      <div className="flex justify-between my-2 py-4" style={{ height: '15%' }}>
        <div className="flex items-center">
          <WestIcon sx={{ opacity: "40%" }} fontSize='small' onClick={() => { onDateIconClick(-1) }} />
          <div className="px-4" style={{ color: 'rgb(148 163 184)' }}>{dateString}</div>
          <EastIcon sx={{ opacity: "40%" }} fontSize='small' onClick={() => { onDateIconClick(1) }} />

        </div>
        <div className="border rounded">
          <input
            type={"date"}
            style={{ color: "rgb(203 213 225)" }}
            value={startTime.format("YYYY-MM-DD")}
            onChange={(e) => { onDateChange(e) }}

          />
        </div>
        <div className="border rounded">
          <select style={{ color: "rgb(203 213 225)" }} onChange={onEndDateChange}>
            <option value="Day">Day</option>
            <option value="Work Week">Work Week</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </div>
      <div className="overflow-auto absolute " style={{ maxHeight: '50%', width: '90%' }}>
        {
          calData.map((x: Meeting, index: number) => {
            return (<MeetingDetails key={index}  {...x} />)
          })
        }
      </div>
    </div>
  );
}

export default RoomsandCalendersTab;

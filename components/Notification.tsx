// src/Notification.js
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import { CircularProgress, Paper } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/material/styles";
import { useSubscription } from "urql";
import Link from 'next/link';

const handleSubscription = (previous = [], newData:any):any => {
  if (!newData) return previous;
  console.log("new data", newData);
  return [...previous, newData.getDevicesLive.data];
};
const getDevicesLiveSubscription = `
  subscription {
    getDevicesLive {
      data {
        serialNumber
        deviceName
        ipAddress
        orientation
        resolution
      }
      status
      statusCode
      message
    }
  }
`;

const Notification = () => {
  const [{ data = [], error, fetching }] = useSubscription(
    { query: getDevicesLiveSubscription },
    handleSubscription
  );
  const [anchorEl, setAnchorEl] = useState(null);

  React.useEffect(() => {
    // Start the subscription on mount
    console.log("data", data);
    // Cleanup function to unsubscribe on unmount
    return () => {};
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={data.length} color="secondary">
          <NotificationsIcon
            color="primary"
            style={{ width: 30, height: 30 }}
          />
        </Badge>
      </IconButton>

      <Menu
        PaperProps={{
          sx: { padding: 2 },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {data.length === 0 ? (
          <Typography>No new notifications</Typography>
        ) : (
          <List>
            {data.map((notification: any, idx: any) => (
              <ListItem key={idx}>
                <Link  href={`/player?id=${notification.serialNumber}`}>
                  <ListItemText
                    primary={`Serial :${notification.serialNumber} - ${notification.ipAddress}`}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </div>
  );
};

export default Notification;

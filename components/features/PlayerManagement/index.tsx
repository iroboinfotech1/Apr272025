import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon from "@mui/icons-material/Folder";
import PlaceIcon from "@mui/icons-material/Place";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import PlayerData from "./grid-view";
import { PlayerDeviceInfo } from "./PlayerDeviceInfo";
import CustomizedInputBase from "./search-field";
import { FileSystem } from "./file-system";
import styles from "./playerManagement.module.css";
import { MapNavigation } from "./map-navigation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const PlayerManagement = (props) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <PlayerDeviceInfo></PlayerDeviceInfo>
      <div
        className="flex items-center justify-between border border-gray-300"
        style={{ backgroundColor: "#f2f4f5" }}
      >
        <header className="p-4">
          <CustomizedInputBase />
        </header>
        <section>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon tabs example"
          >
            <Tab icon={<CalendarMonthIcon />} aria-label="phone" />
            <Tab icon={<FolderIcon />} aria-label="favorite" />
            <Tab icon={<PlaceIcon />} aria-label="person" />
          </Tabs>
        </section>
      </div>
      <div className={styles.tabPanelContainer}>
        <TabPanel value={value} index={0}>
          <PlayerData {...props}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FileSystem></FileSystem>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <MapNavigation />
        </TabPanel>
      </div>
    </div>
  );
};

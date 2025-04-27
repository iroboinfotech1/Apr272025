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
import SettingPlayerTab from './SettingPlayerTab';
import GeneralPlayerTab from './GeneralPlayerTab';

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
                <Box sx={{ p: 6 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function PlayerDetails() {
    const [value, setValue] = useState(0);
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const { connectorDetailId, setOpenPlayerDetailTab}: any = useContext(PlayerContext)
    return (
        <Box className={styles.playerdetails}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <button style={{opacity:'30',position:'relative',left:'98%',paddingTop:'2px',color:'grey'}} onClick={() => setOpenPlayerDetailTab(false)}>✖</button>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Settings" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GeneralPlayerTab/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SettingPlayerTab/>
            </TabPanel>
        </Box>
    );
}


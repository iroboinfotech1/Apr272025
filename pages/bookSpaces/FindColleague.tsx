import { Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import FormGroup from '@mui/material/FormGroup';
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import Layout from "../../components/Layout";
import Router from "next/router";
import UsermanagementService from "../../services/usermanagement.service";
import { useEffect, useState } from "react";
import UserList from "../../models/usermgmt/UserList";
import moment from 'moment';

const FindColleague = () => {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [selectedName, setSelectedName] = useState<string | null>(null); 
    const findColleague = () => {
        findColleaguesubmit();
        Router.push("/bookSpaces/findcolleaue");
    };
    const [userlistdata, setuser] = useState<UserList[]>([]);
    const [usernamelist, setusernames] = useState<string[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    async function fetchMyApi() {
        setLoader(true);
        var response = await UsermanagementService.getuserlist();
        console.log("UsermanagementService addUser", response);
        if (response.status == true) {
            setuser(response.data);
        }
        setLoader(false);
        const userNames = response.data.map((user) => user.userName);
        setusernames(userNames);
        console.log("UsermanagementService-getuserlist", response);
    }
    
    useEffect(() => {
        fetchMyApi();
    }, []);
    

    const findColleaguesubmit = () => {
        if (selectedName && value) {
          const payload = {
            userName: selectedName,
            dateTime: value.format("YYYY-MM-DD HH:mm:ss")
          };
          console.log("Submitting payload:", payload);
        } else {
          console.error("Both name and date must be selected!");
        }
      };

    return (
        <Layout>
            <div>
                <h2 className="text-xl font-bold">Find Colleague</h2>
                <span style={{ fontSize: "12px", color: "#a5a0a0" }}> Let&apos;s find your colleauge </span>
            </div>
            <FormGroup>
                <div className="flex sm:flex-col justify-around text-sm mt-4 px-2 md:px-2 gap-4">
                                <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={usernamelist}
                        className="sm:w-full w-[300px]"
                        onChange={(event, newValue) => setSelectedName(newValue)} // Update selected name
                        renderInput={(params) => <TextField {...params} label="Find Colleague" />}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker className="text-sm" renderInput={(props) => <TextField {...props} />}
                            label="Date & Time" value={value} onChange={(newValue) => { setValue(newValue); }}
                        />
                    </LocalizationProvider>
                    <Button variant="contained" className="flex-1 w-64 h-14 sm:w-full w-[200px]" href="#outlined-buttons" onClick={() => findColleague()}>
                        Search
                    </Button>
                </div>
            </FormGroup>
        </Layout>
    )

}
export default FindColleague;
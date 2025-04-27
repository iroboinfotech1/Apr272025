import Layout from "../../../components/Layout";
import React from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import ContactInfoCard from "../compponents/ContactInfoCard";
import Router from "next/router";

const FindColleagueResult = () => {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const colleagueList = [{
        image: "/assets/images/userprofile.png",
        name: "John Allyster",
        email: "johnallyster@xmindz.com"
    },
    {
        image: "/assets/images/userprofile.png",
        name: "John Allyster Desilva",
        email: "johnallysterdsilva@xmindz.com"
    }];

    const colleagueSpace = (data: any) => {
        Router.push({ pathname: '/bookSpaces/findcolleaue/colleagueSpace', query: { name: data.name, email: data.email } })
    }
    return (
        <Layout>

            <div>
                <h2 className="text-xl font-bold">Find Colleague</h2>
                <span style={{ fontSize: "12px", color: "#a5a0a0" }}> Let&apos;s find your colleauge </span>
            </div>
            <div className="p-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker className="text-sm" renderInput={(props) => <TextField {...props} />}
                        label="Select Date" value={value} onChange={(newValue) => { setValue(newValue); }}
                    />
                </LocalizationProvider>
            </div>
            <div className="p-6 flex gap-4 flex-wrap min-w-[300px]">
                {colleagueList.map((data, i: number) => {
                    return (<button className="flex-grow" onClick={() => colleagueSpace(data)} key={i}>
                        <ContactInfoCard {...data} />
                    </button>
                    )
                }
                )}
            </div>
        </Layout>
    )
}

export default FindColleagueResult;
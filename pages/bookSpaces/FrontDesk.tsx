 import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import withAuth from '../../HOC/withAuth';
// import Modal from "../../lib/modalPopup/components/Modal";
// import ModalBody from "../../lib/modalPopup/components/ModalBody";
// import ModalHeader from "../../lib/modalPopup/components/ModalHeader";
import { DataGrid } from '@mui/x-data-grid';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import { VisitorPortal } from "../../models/Booking/Questionnaires";
import QuestionnairesService from "../../services/questionnaires.service";
import { Button } from "@mui/material";

interface Visitor {
    sno: number;
    dateOfVisit: Date;
    firstName: string;
    lastName: string;
    host: string;
    purpose: string;
    phoneNo: string;
    email: string;
}

const FrontDesk = (props: any) => {
    const [loader, setLoader] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [visitorRecords, setVisitorRecords] = useState<Visitor[]>([]);
    const [columnHeaders, setColumnHeaders] = useState<string[]>([]);

    const [visitors, setVisitors] = useState<Visitor[]>([
        {
            sno: 1,
            dateOfVisit: new Date('2024-12-13'),
            firstName: 'John',
            lastName: 'Doe',
            host: 'Jane Doe',
            purpose: 'Meeting',
            phoneNo: '1234567890',
            email: 'john.doe@example.com',
        },
        {
            sno: 2,
            dateOfVisit: new Date('2024-12-14'),
            firstName: 'Jane',
            lastName: 'Doe',
            host: 'John Doe',
            purpose: 'Lunch',
            phoneNo: '9876543210',
            email: 'jane.doe@example.com',
        },
    ]);

    const columns = [
        { key: 'sno', label: 'SNo' },
        { key: 'dateOfVisit', label: 'Date of Visit' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'host', label: 'Host' },
        { key: 'purpose', label: 'Purpose' },
        { key: 'phoneNo', label: 'Phone No' },
        { key: 'email', label: 'Email' },
    ];

    // const filteredVisitors = visitors.filter((visitor) => {
    //     return visitor.dateOfVisit >= startDate && visitor.dateOfVisit <= endDate;
    // });

    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        setLoader(true);
        var response = await QuestionnairesService.GetVisitorDetailsByDate(format(startDate, 'yyyy-MM-dd'),format(endDate, 'yyyy-MM-dd'));
        if (response.status === true && response.data && response.data.length > 0 ) 
        {    
            let recordListTemp: any[] = [];
            response.data.forEach(( item: any) => {
                var vpObj = JSON.parse(item.vpJson);
                var record ={
                    sno : item.vpId,
                    dateOfVisit: new Date(item.visitDate),
                    firstName: getValue(vpObj,'First Name'),
                    lastName: getValue(vpObj,'Last Name')
                }
                recordListTemp.push(record);
            })
            setVisitorRecords(recordListTemp);
            console.log(recordListTemp);
        }
        setLoader(false);
        console.log(visitors);
    }

    const getValue = (vpObj:any,key:any) => {
        for (var i=0; i < vpObj.length; i++) {
            if(vpObj[i].qText == key) 
            {
                return vpObj[i].qAnswer;
            }
        }
        return '';
    }

    return (
        <Layout>
            <h2 className="text-xl font-bold">Questionnaire</h2>
            <Breadcrumbs currentPage={"Questionnaire"} />
            <div>
                {
                    loader ? <div>Loading Data...</div>
                        :
                        <div>
                            <div className="flex w-full items-center mb-8">
                                <h2 className="heading4 font-bold">{`Visitor Details`}</h2>
                                <button className="opacity-30 ml-auto" onClick={props.close}>✖</button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between mb-4">
                                    <div className="flex items-center">
                                        <label className="mr-2">Start Date:</label>
                                        <input
                                            type="date"
                                            value={format(startDate, 'yyyy-MM-dd')}
                                            onChange={(e) => setStartDate(new Date(e.target.value))}
                                            className="border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="mr-2">End Date:</label>
                                        <input
                                            type="date"
                                            value={format(endDate, 'yyyy-MM-dd')}
                                            onChange={(e) => setEndDate(new Date(e.target.value))}
                                            className="border border-gray-300 rounded p-2"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <Button variant="contained" type="button" onClick={() => fetchMyApi()}>Get</Button>
                                    </div>
                                </div>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            {columns.map((column) => (
                                                <th
                                                    key={column.key}
                                                    className="border border-gray-300 p-2 text-left"
                                                >
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visitorRecords.map((visitor) => (
                                            <tr key={visitor.sno}>
                                                <td className="border border-gray-300 p-2">{visitor.sno}</td>
                                                <td className="border border-gray-300 p-2">
                                                    {format(visitor.dateOfVisit, 'yyyy-MM-dd')}
                                                </td>
                                                <td className="border border-gray-300 p-2">{visitor.firstName}</td>
                                                <td className="border border-gray-300 p-2">{visitor.lastName}</td>
                                                <td className="border border-gray-300 p-2">{visitor.host}</td>
                                                <td className="border border-gray-300 p-2">{visitor.purpose}</td>
                                                <td className="border border-gray-300 p-2">{visitor.phoneNo}</td>
                                                <td className="border border-gray-300 p-2">{visitor.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                }
            </div>
        </Layout>
    );
};

export default withAuth(FrontDesk);
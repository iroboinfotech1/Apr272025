import { useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import ModalRoot from "../../components/lib/modalPopup/components/ModalRoot";
import withAuth from '../../HOC/withAuth';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl } from '@mui/material';

const initialRows = [
    { id: 1, organization: 'Google', realm: 'Cloud' },
    { id: 2, organization: 'Microsoft', realm: 'Azure' },
    { id: 3, organization: 'Amazon', realm: 'AWS' },
    { id: 4, organization: 'IBM', realm: 'Watson' },
    { id: 5, organization: 'Salesforce', realm: 'CRM' },
    { id: 6, organization: 'Oracle', realm: 'Finance' },
    { id: 7, organization: 'SAP', realm: 'HR' },
];

const realmOptions = [
    'Cloud', 'Azure', 'AWS', 'Watson', 'CRM', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales'
];


const OrgRealmMapping = () => {

    const [loader, setLoader] = useState<boolean>(false);
    const [rows, setRows] = useState(initialRows);
    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }];

    const handleRealmChange = (event, id) => {
        // Map over the current rows to find and update the specific row's realm
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, realm: event.target.value } : row
        );
        // Update the state with the new rows array
        setRows(updatedRows);
    };

    return (
        <>
            <Layout>
                <h2 className="text-xl font-bold">Org Realm Mapping</h2>
                <Breadcrumbs currentPage={"Org Realm Mapping"} routes={breadcrumbPaths} />
                {
                    loader == true ?
                        <div className="text-center">Loading Data...</div>
                        :
                        <div>
                            {
                                //p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen bg-gray-100 font-inter
                                <div className="p-4">
                                    <TableContainer component={Paper} className="shadow-lg rounded-lg max-w-4xl w-full">
                                        <Table sx={{ minWidth: 400 }} aria-label="organization and realm table">
                                            <TableHead className="bg-blue-600">
                                                <TableRow>
                                                    {/* Table header for Organization */}
                                                    <TableCell className="text-white font-semibold text-lg px-4 py-3 rounded-tl-lg">Organization</TableCell>
                                                    {/* Table header for Realm */}
                                                    <TableCell align="right" className="text-white font-semibold text-lg px-4 py-3 rounded-tr-lg">Realm</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {/* Map over the rows state to render each table row */}
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        className="hover:bg-blue-50 transition-colors duration-200"
                                                    >
                                                        {/* Table cell for Organization data */}
                                                        <TableCell component="th" scope="row" className="px-4 py-3 text-gray-800">
                                                            {row.organization}
                                                        </TableCell>
                                                        {/* Table cell for Realm data - now with a dropdown */}
                                                        <TableCell align="right" className="px-4 py-3">
                                                            {/* FormControl is used to properly style the Select component */}
                                                            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                                                <Select
                                                                    value={row.realm} // The current selected value for this row's realm
                                                                    onChange={(event) => handleRealmChange(event, row.id)} // Event handler for changes
                                                                    displayEmpty // Allows displaying an empty value if none is selected (though we initialize)
                                                                    inputProps={{ 'aria-label': 'Select Realm' }} // Accessibility attribute
                                                                    className="rounded-md" // Tailwind class for rounded corners on the select input
                                                                >
                                                                    {/* Map over realmOptions to create MenuItem for each option */}
                                                                    {realmOptions.map((option) => (
                                                                        <MenuItem key={option} value={option}>
                                                                            {option}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            }
                        </div>
                }

            </Layout>

            <ModalRoot />
        </>
    );


}

export default withAuth(OrgRealmMapping);
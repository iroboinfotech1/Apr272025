import { useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import ModalRoot from "../../components/lib/modalPopup/components/ModalRoot";
import withAuth from '../../HOC/withAuth';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Box,
} from '@mui/material';

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


const RolesandAttributes = () => {

    const [loader, setLoader] = useState<boolean>(false);
    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }];
    const [rows, setRows] = useState([
        { id: 1, role: 'Admin', attribute: 'Facility-Building1', isEditing: false },
        { id: 2, role: 'Facility Manager', attribute: 'Facility-Building2', isEditing: false },
        { id: 3, role: 'Business User', attribute: 'Business-Building1', isEditing: false },
    ]);
    const [newRoleInput, setNewRoleInput] = useState('');
    const [newAttributeInput, setNewAttributeInput] = useState('');

    /**
     * Generates a unique ID for new table rows using the current timestamp.
     * @returns {number} A unique ID.
     */
    const generateUniqueId = () => {
        return Date.now();
    };

    /**
     * Handles adding a new row to the table.
     * A new row will contain the values from the 'New Role' and 'New Attribute' input fields.
     * Prevents adding empty rows.
     */
    const handleAddRow = () => {
        if (newRoleInput.trim() === '' && newAttributeInput.trim() === '') return; // Prevent adding completely empty rows

        const newRow = {
            id: generateUniqueId(),
            role: newRoleInput,
            attribute: newAttributeInput,
            isEditing: false,
        };

        setRows([...rows, newRow]); // Update rows state
        setNewRoleInput('');         // Clear the new role input field
        setNewAttributeInput('');    // Clear the new attribute input field
    };

    /**
     * Toggles the `isEditing` state for a specific row.
     * When `isEditing` is true, text fields appear for editing; otherwise, plain text is shown.
     * @param {number} id - The ID of the row to toggle editing for.
     */
    const toggleEditing = (id) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, isEditing: !row.isEditing } : row
            )
        );
    };

    /**
     * Handles changes to the content of a specific cell (role or attribute) within a row.
     * @param {number} id - The ID of the row containing the cell to update.
     * @param {string} fieldName - The name of the field to update ('role' or 'attribute').
     * @param {object} event - The change event object from the TextField.
     */
    const handleCellChange = (id, fieldName, event) => {
        const value = event.target.value;
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [fieldName]: value } : row
            )
        );
    };

    /**
     * Saves the edited content of a row and exits editing mode for that row.
     * @param {number} id - The ID of the row to save.
     */
    const handleSave = (id) => {
        toggleEditing(id); // Simply toggle editing off (saves current state)
    };

    /**
     * Deletes a specific row from the table.
     * @param {number} id - The ID of the row to delete.
     */
    const handleDelete = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    return (
        <>
            <Layout>
                <h2 className="text-xl font-bold">Roles and Attributes</h2>
                <Breadcrumbs currentPage={"Roles and Attributes"} routes={breadcrumbPaths} />
                {
                    loader == true ?
                        <div className="text-center">Loading Data...</div>
                        :
                        <div>
                            {
                                //p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen bg-gray-100 font-inter
                                <div className="p-4">
                                    <TableContainer component={Paper} className="shadow-lg rounded-lg max-w-4xl w-full border border-gray-300">
                                        <Table aria-label="roles and attributes table">
                                            <TableHead className="bg-gray-300">
                                                <TableRow>
                                                    {/* Header for Roles column */}
                                                    <TableCell className="text-gray-800 font-bold text-xl px-4 py-3 w-1/2 rounded-tl-lg">
                                                        <Box className="flex items-center justify-between">
                                                            Roles
                                                            {/* Input for new role */}
                                                             <Button
                                                                variant="contained"
                                                                onClick={handleAddRow}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md py-2 px-4 transition-colors duration-200"
                                                            >
                                                                ADD
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                    {/* Header for Attributes column with Add button for the row */}
                                                    <TableCell className="text-gray-800 font-bold text-xl px-4 py-3 w-1/2 rounded-tr-lg">
                                                        <Box className="flex items-center justify-between">
                                                            Attributes
                                                            {/* Input for new attribute */}
                                                            
                                                            {/* Add Row button */}
                                                            <Button
                                                                variant="contained"
                                                                onClick={handleAddRow}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md py-2 px-4 transition-colors duration-200"
                                                            >
                                                                ADD
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        className="hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        {/* Table Cell for Role */}
                                                        <TableCell component="th" scope="row" className="px-4 py-3 text-gray-800">
                                                            <Box className="flex items-center justify-between">
                                                                {row.isEditing ? (
                                                                    <TextField
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={row.role}
                                                                        onChange={(e) => handleCellChange(row.id, 'role', e)}
                                                                        className="w-2/3"
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': {
                                                                                '& fieldset': { borderColor: '#cbd5e1' },
                                                                                '&:hover fieldset': { borderColor: '#9ca3af' },
                                                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                                                            },
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span>{row.role}</span>
                                                                )}
                                                                {/* Action buttons for Role column */}
                                                                <div className="flex space-x-2">
                                                                    {row.isEditing ? (
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => handleSave(row.id)}
                                                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            SAVE
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => toggleEditing(row.id)}
                                                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            EDIT
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                            variant="contained"
                                                                            onClick={() => handleDelete(row.id)}
                                                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            DELETE
                                                                        </Button>
                                                                </div>
                                                            </Box>
                                                        </TableCell>

                                                        {/* Table Cell for Attribute */}
                                                        <TableCell className="px-4 py-3 text-gray-800">
                                                            <Box className="flex items-center justify-between">
                                                                {row.isEditing ? (
                                                                    <TextField
                                                                        variant="outlined"
                                                                        size="small"
                                                                        value={row.attribute}
                                                                        onChange={(e) => handleCellChange(row.id, 'attribute', e)}
                                                                        className="w-2/3"
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': {
                                                                                '& fieldset': { borderColor: '#cbd5e1' },
                                                                                '&:hover fieldset': { borderColor: '#9ca3af' },
                                                                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                                                            },
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span>{row.attribute}</span>
                                                                )}
                                                                {/* Action buttons for Attribute column */}
                                                                <div className="flex space-x-2">
                                                                    {row.isEditing ? (
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => handleSave(row.id)}
                                                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            SAVE
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => toggleEditing(row.id)}
                                                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            EDIT
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                            variant="contained"
                                                                            onClick={() => handleDelete(row.id)}
                                                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md py-1 px-3 text-sm transition-colors duration-200"
                                                                        >
                                                                            DELETE
                                                                        </Button>
                                                                </div>
                                                            </Box>
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

export default withAuth(RolesandAttributes);
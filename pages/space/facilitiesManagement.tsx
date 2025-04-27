import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import AddIcon from "@mui/icons-material/Add";
import { Modal, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useRef, useState } from "react";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
import { Menu } from 'primereact/menu';


import Button from "@mui/material/Button";
import { Facility, Resource } from "../../models/spacemgmt/facility/FacilityModel";
import FacilityService from "../../services/facility.service";
import CustomResource from "./CustomResource";
// import TextField from "@mui/material/TextField";
import Facilities from "../../components/features/SpaceManagement/Organization/Facilities";
import CreateOrganization from "../../components/features/SpaceManagement/Organization/CreateOrganization";
import PopupHeader from "../../components/common/PopupHeader";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

let renderCount = 0;
const FacilitiesManagement = () => {
    console.log("renderCount", renderCount++);

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [openAddFacilityModal, setOpenAddFacilityModal] = useState(false);

    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        var orgId = 8;
        var response = await FacilityService.getAll();
        if (response.status === true) {
            setFacilities(response.data);
        }
    }

    async function  onCloseAddFacilities() {
        fetchMyApi();
        setOpenAddFacilityModal(false);
    }

    const [editingRows, setEditingRows] = useState({});
    const [rowIndex, setRowIndex] = useState(0);
    useEffect(() => {

    }, [rowIndex]);


    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'Space Management', 'path': '/space' }];

    const setActiveRowIndex = (index: number) => {
        console.log("edit Index ", index);
        let _editingRows = { ...editingRows, ...{ [`${facilities[index].facilityId}`]: true } };
        console.log("_editingRows", _editingRows);
        setEditingRows(_editingRows);
    }

    const onRowEditChange = (e: any) => {
        setEditingRows(e.data);
    }

    const onRowEditComplete2 = (e: any) => {
        let _data = [...facilities];
        let { newData, index } = e;

        _data[index] = newData;

        setFacilities(_data);
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    //
    const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        console.log("button click ", index);
        setRowIndex(index);
        setAnchorEl(event.currentTarget);
    };

    const handleEdit = () => {
        console.log("edit row index", rowIndex);
        setActiveRowIndex(rowIndex);
        setAnchorEl(null);
    };

    const handleDelete = () => {
        setAnchorEl(null);
    };

    const handleClone = () => {
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const rowExpansionTemplate = (data: Facility) => {

        return (
            <CustomResource facilityId={data.facilityId} ></CustomResource>
        )


    }
    const allowExpansion = (rowData: any) => {
        return true;
    };

    let items = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: (d: any) => {
                console.log("d in ", d.item);
            }
        },
        { label: 'Clone', icon: 'pi pi-clone' },
        { label: 'Delete', icon: 'pi pi-trash' }
    ];

    const [expandedRows, setExpandedRows] = useState<any>(null);
    const menu = useRef<Menu>(null);
    return (
        <Layout>
            <h2 className="text-xl font-bold">Facilities Management</h2>
            <Breadcrumbs currentPage={"Facilities Management"} routes={breadcrumbPaths} />

            <div className="flex w-full mt-3 mb-5">
                <div className='flex justify-between w-2/5 border rounded mr-8 items-center'>
                    <input className='w-full mx-2 focus:outline-none' placeholder="Search" />
                    <Button>
                        <SearchIcon />
                    </Button>
                </div>
                {/* <button className={"flex items-center justify-center btn text-primary border border-primary"}>
                    <div className="bg-primary text-white rounded-full p-2 h-5 w-5 mr-3 flex justify-center items-center ">
                        <AddIcon fontSize="small" />
                    </div>
                </button> */}
                <Button variant="contained" type="submit" onClick={() => setOpenAddFacilityModal(true)}>
                    Add Facility
                </Button>
            </div>
            <Menu model={items} popup ref={menu} />
            {/* <Button variant="contained" type="button" size="small" onClick={(event) => { console.log(event); menu.current?.toggle(event); }} >
                button
            </Button> */}

            {/* <Button onClick={() => setActiveRowIndex(0)} className="p-button-text" label="Activate 1st" >inovke </Button> */}


            <div className='col-12'>
                <DataTable value={facilities} editMode="row" dataKey="facilityId" responsiveLayout="scroll" size="small" editingRows={editingRows}
                    onRowEditChange={onRowEditChange} onRowEditComplete={onRowEditComplete2}
                    rowExpansionTemplate={rowExpansionTemplate}
                    expandedRows={expandedRows} onRowToggle={(e) => {
                        setExpandedRows(e.data)
                    }}
                >

                    <Column field="facilityName" header="Facilities Group" editor={(options) => textEditor(options)} ></Column>
                    <Column field="email" header="Email" editor={(options) => textEditor(options)} ></Column>
                    <Column field="escalationPeriod" header="Escalation Period" editor={(options) => textEditor(options)} ></Column>
                    <Column field="escalationEmail" header="Escalation Email" editor={(options) => textEditor(options)}></Column>
                    <Column field="notifyFacility" header="Notify Facilities" body={(data) => switchBox(data.notifyFacility)} editor={(options) => switchEditor(options)} ></Column>
                    <Column field="notifyOrganizer" header="Notify Organizer" body={(data) => switchBox(data.notifyOrganizer)} editor={(options) => switchEditor(options)} ></Column>
                    <Column bodyStyle={{ textAlign: 'center' }} body={action}></Column>
                    <Column expander={allowExpansion} style={{ width: '3em' }} />
                    {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                </DataTable>
            </div>
            {/* <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem onClick={handleClone}>Clone</MenuItem>
            </Menu> */}
            <div>
                <Modal open={openAddFacilityModal} onClose={ () => setOpenAddFacilityModal(false)} aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
                    {/* <PopupHeader title="Add Facilities" subHeading="Please select the Organization to add facilities" align="center" close={handleAddFacilityModelClose} ></PopupHeader> */}
                    <Box sx={{ ...style }}>
                        <Facilities key={2} orgId={1} onClose={false} changeStep={1} facilitiesMgmt={true} closeCallback={onCloseAddFacilities}></Facilities>
                    </Box>
                </Modal>
            </div>
        </Layout>
    );



    function action(data: any, props: any) {
        //console.log("properties of action ", data);

        return (
            // <button onClick={() => setActiveRowIndex(props.rowIndex)} >
            <button
                // onClick={(e) => handleClick(e, props.rowIndex)}
                onClick={(event) => menu.current?.toggle(event)}
            >
                <MoreVertIcon></MoreVertIcon>
            </button>
        );
    }

    function viewMoreButton(data: any, props: any) {
        //console.log("properties of action ", data);

        return (
            // <button onClick={() => setActiveRowIndex(props.rowIndex)} >
            <button onClick={(e) => handleClick(e, props.rowIndex)} >
                <MoreVertIcon></MoreVertIcon>
            </button>
        );
    }



}



const footer = (
    <button className='btn text-primary small p-0 border-0 ' style={{ 'fontSize': '15px' }} ><i className='pi pi-plus-circle' style={{ 'fontSize': '14px' }}></i> Add More</button>
);
function textEditor(options: ColumnEditorOptions) {
    //console.log("option", options);
    return (
        <span className="p-float-label">
            <InputText type="text" className="p-inputtext-sm block" value={options.value} onChange={(e) => options.editorCallback!(e.target.value)} />
            <label>{options.column.props.header?.toString()}</label>
        </span>);
}

function switchBox(value: boolean) {
    return (
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" disabled checked={value} />
        </div>
    );
}

function switchEditor(options: ColumnEditorOptions) {
    return (
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" checked={options.value} onChange={(e) => options.editorCallback!(e.target.value)} />
        </div>
    );
    // return <InputSwitch checked={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
}

export default FacilitiesManagement;
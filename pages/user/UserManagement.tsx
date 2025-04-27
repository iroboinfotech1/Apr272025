import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import UsermanagementService from "../../services/usermanagement.service";
import UserList from "../../models/usermgmt/UserList";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "@mui/material/Button";
import ModalService from "../../components/lib/modalPopup/services/ModalService";
import CreateOrganization from "../../components/features/SpaceManagement/Organization/CreateOrganization";
import ModalRoot from "../../components/lib/modalPopup/components/ModalRoot";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import DeleteAlert from "../../components/common/deleteAlert";
import Router from 'next/router';
import withAuth from '../../HOC/withAuth';


const UserManagement = () => {
   
    const [userlistdata, setuser] = useState<UserList[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        setLoader(true);
        var response = await UsermanagementService.getuserlist();
        console.log("UsermanagementService addUser", response);
        if (response.status == true) {
            setuser(response.data);
        }
        setLoader(false);
        console.log("UsermanagementService-getuserlist", response);
    }

    const openModel = (component: any, props?: any) => {
        console.log("open clicked");
        ModalService.open(component, props);
    };
    function updateUser(userId:any){
        if(userId){
            //setEditUserData(editUser);
            Router.push({pathname:'/user/User', query: { id: userId }})
        }
    };

    function deleteUser(id: number) {
        openModel(DeleteAlert, {
            "onDelete": async () => {
                setLoader(true);
                var result = await UsermanagementService.deleteUser(id);
                console.log("delete result" + result);
                if (result.status == true) {
                    await fetchMyApi();
                }
                setLoader(false);
            }
        });
    }

    // const openModel = (component: any, props?: any) => {
    //     console.log("open clicked");
    //     ModalService.open(component, props);
    // };

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }];

    // async function editOrganization(org: Organization) {
    //     openModel(CreateOrganization, { "organization": org, "submittedCallback": fetchMyApi });
    // }

    const actionBodyTemplate = (rowData: UserList) => {
        return (
            <div className="flex">
                <Button  onClick={() => updateUser(rowData.userId) }>
                    <EditIcon></EditIcon>
                </Button>
                <Button onClick={() => deleteUser(rowData.userId)} color="error" >
                    <DeleteIcon></DeleteIcon>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Layout>
                <h2 className="text-xl font-bold">User Management</h2>
                <Breadcrumbs currentPage={"User Management"} routes={breadcrumbPaths} />
                {
                    loader == true ?
                        <div className="text-center">Loading Data...</div>
                        :
                        <div>
                            {
                               <div className='col-12'>
                                        <div className="row mb-3">
                                            <div className="col-12 text-right">
                                                <div className="mt-5">
                                                    <Button variant="contained" type="submit" onClick={() => Router.push('/user/User')}>Add User</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <DataTable value={userlistdata} dataKey="id" responsiveLayout="scroll" scrollable={true} paginator rows={5} className="pk-master-table">
                                                    <Column field="userName" header="Name" sortable={true} ></Column>
                                                    <Column field="email" header="Email" sortable={true} ></Column>
                                                    <Column field="roleId" header="Roles" sortable={true} hidden></Column>
                                                    <Column field="joined" header="Joined" sortable={true} ></Column>
                                                    <Column header="Actions" body={actionBodyTemplate} exportable={false} align="center" ></Column>
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                }

            </Layout>

            <ModalRoot />
        </>
    );


}

export default withAuth(UserManagement);
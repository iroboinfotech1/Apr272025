import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import UsermanagementService from "../../services/usermanagement.service";
import RoleList from "../../models/usermgmt/RoleList";
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
const RolesandPermission = () => {

    const [Roleslistdata, setRoles] = useState<RoleList[]>([]);
    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        setLoader(true);
        var response = await UsermanagementService.getroleslist();
        if (response.status == true) {
            setRoles(response.data);
        }
        setLoader(false);
        console.log("organizations", Roleslistdata);
    }

    const openModel = (component: any, props?: any) => {
        console.log("open clicked");
        ModalService.open(component, props);
    };

    function updateRole(roleId:any){
        if(roleId){
            //setEditUserData(editUser);
            Router.push({pathname:'/user/AddRole', query: { id: roleId }})
        }
    };

    function deleteRole(id: number) {
        openModel(DeleteAlert, {
            "onDelete": async () => {
                setLoader(true);
                var result = await UsermanagementService.deleteRole(id);
                console.log("delete result" + result);
                if (result.status == true) {
                    await fetchMyApi();
                }
                setLoader(false);
            }
        });
    }

    const [loader, setLoader] = useState<boolean>(false);
    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }];
    const actionBodyTemplate = (rowData: RoleList) => {
        return (
            <div className="flex">
                <Button onClick={() => updateRole(rowData.roleId) }>
                    <EditIcon></EditIcon>
                </Button>
                <Button  onClick={() => deleteRole(rowData.roleId)} color="error" >
                    <DeleteIcon></DeleteIcon>
                </Button>
            </div>
        );
    }
    return (
        <>
            <Layout>
                <h2 className="text-xl font-bold">Roles & Permissions</h2>
                <Breadcrumbs currentPage={"Roles & Permissions"} routes={breadcrumbPaths} />
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
                                                    <Button variant="contained"  type="submit" onClick={() => Router.push('/user/AddRole')} >Add Role</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                               <DataTable />
                                                <DataTable value={Roleslistdata} dataKey="id" responsiveLayout="scroll" scrollable={true} paginator rows={5} className="pk-master-table">
                                                    <Column field="roleName" header="Role" sortable={true} ></Column>
                                                    <Column field="roleBase" header="Role Base" sortable={true} ></Column>
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

export default withAuth(RolesandPermission);
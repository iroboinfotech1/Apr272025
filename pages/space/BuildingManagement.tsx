import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import ModalService from "../../components/lib/modalPopup/services/ModalService";
import Organization from "../../models/spacemgmt/organization";
import OrganizationService from "../../services/organization.service";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ModalRoot from "../../components/lib/modalPopup/components/ModalRoot";
import Building from "../../models/spacemgmt/building";
import BuildingService from "../../services/building.service";
import CreateBuilding from "../../components/features/SpaceManagement/Building/CreateBuilding";
import DeleteAlert from "../../components/common/deleteAlert";
import { useSearchParams } from "react-router-dom";

const BuildingManagement = (props: any) => {

    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loader, setLoader] = useState<boolean>(true);
    useEffect(() => {
        //debugger;
        fetchMyApi();
        const urlParams = new URLSearchParams(window.location.search).get('openModal');;
        if (urlParams == "true")
            openModel(CreateBuilding, { "submittedCallback": fetchMyApi })

    }, []);

    async function fetchMyApi() {

        setLoader(true);
        var response = await BuildingService.getAll();
        //debugger;
        if (response.status == true) {
            setBuildings(response.data);
        }
        setLoader(false);
        console.log("buildings", buildings);
    }



    const openModel = (component: any, props?: any) => {
        console.log("open clicked");
        ModalService.open(component, props);
    };

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'Space Management', 'path': '/space' }];

    async function invokeDelete(id: number) {
        try {
            setLoader(true);
            var result = await BuildingService.deleteBuilding(id);
            console.log("delete result" + result);
            if (result.status == true) {
                await fetchMyApi();
            }

        } catch (error) {
            console.log(error);
        }
        setLoader(false);
    }

    async function deleteBuilding(id: number) {
        openModel(DeleteAlert, { "onDelete": () => invokeDelete(id) });
    }

    async function editBuilding(org: Building) {
        openModel(CreateBuilding, { "building": org, "submittedCallback": fetchMyApi });
    }

    const actionBodyTemplate = (rowData: Building) => {
        return (
            <div>
                <Button onClick={() => editBuilding(rowData)} >
                    <EditIcon></EditIcon>
                </Button>
                <Button onClick={() => deleteBuilding(rowData.buildingId)} color="error" >
                    <DeleteIcon></DeleteIcon>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Layout>
                <h2 className="text-xl font-bold">Building Management</h2>
                <Breadcrumbs currentPage={"Building Management"} routes={breadcrumbPaths} />
                {
                    loader == true ?
                        <div className="text-center">Loading Data...</div>
                        :
                        <div>
                            {
                                buildings.length == 0 ?
                                    <div className="text-center">
                                        <div className="mb-4 mt-4">
                                            <img src={"../assets/images/not_found.png"} alt="not found" className="m-auto" />
                                        </div>
                                        <div className="h4 fw-bold">No Record Found</div>
                                        <div className="">Looks like you haven&apos;t setup any Buildings yet</div>

                                        <div className="mt-5">
                                            <Button variant="contained" type="submit" onClick={() => openModel(CreateBuilding, { "submittedCallback": fetchMyApi })}>Add Building</Button>
                                        </div>
                                    </div>
                                    :
                                    <div className='col-12'>
                                        <div className="row mb-3">
                                            <div className="col-12 text-right">
                                                <div className="mt-5">
                                                    <Button variant="contained" type="submit" onClick={() => openModel(CreateBuilding, { "submittedCallback": fetchMyApi })}>Add Building</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <DataTable value={buildings} dataKey="buildingId" responsiveLayout="scroll" scrollable={true} paginator rows={5} className="pk-master-table">
                                                    <Column field="buildingName" header="Building Name" sortable={true} ></Column>
                                                    <Column field="organization.orgName" header="Organization Name" sortable={true} ></Column>
                                                    <Column field="groupName" header="Group" sortable={true} ></Column>
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

export default BuildingManagement;
import React from 'react';
import BlockMenu from '../components/BlockMenu';
import TestModal from '../components/features/SpaceManagement/addSpace';
import CreateSpace from '../components/features/SpaceManagement/Space/CreateSpace';
import Layout from '../components/Layout';
import ModalRoot from '../components/lib/modalPopup/components/ModalRoot';
import ModalService from '../components/lib/modalPopup/services/ModalService';
import Breadcrumbs from "../components/common/Breadcrumbs";
import Router from 'next/router'


import SpacesIcon from "../assets/icons/Spaces.svg";
import FacilitiesIcon from "../assets/icons/Facilities.svg";
import BuildingsIcon from "../assets/icons/Buildings.svg";
import OrganizationIcon from "../assets/icons/Organization.svg";
import withAuth from '../HOC/withAuth';
//import Buildings from "../assets/icons/Buildings.svg";


const Space = () => {


    // const openModel = (component: any) => {
    //     ModalService.open(component);
    // };

    return (
        <Layout>
            <h2 className="text-xl font-bold">Space Management</h2>
            <Breadcrumbs currentPage={"Space Management"} />

            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Organization" subHeading="Manage Organization(s)" icon={OrganizationIcon} onClick={() => Router.push('/space/OrganizationManagement')} />
                </div>
                <div className="col-12 col-md-3">

                    <BlockMenu heading="Buildings" subHeading="Manage Building(s)" icon={BuildingsIcon} onClick={() => Router.push('/space/BuildingManagement')} />

                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Spaces" subHeading="Manage Space(s)" icon={SpacesIcon} onClick={() => Router.push('/space/RoomManagement')} />

                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Facilities" subHeading="Manage Facilities" icon={FacilitiesIcon} onClick={() => Router.push('/space/facilitiesManagement')} />
                </div>
            </div>

            {/* <ModalRoot /> */}
        </Layout>
    )
}

export default withAuth(Space);
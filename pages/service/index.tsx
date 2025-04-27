import BasicBreadcrumbs from '../../components/common/Breadcrumbs'
import BlockMenu from '../../components/BlockMenu'
import BuildingsIcon from "../../assets/icons/Buildings.svg";
import FacilitiesIcon from "../../assets/icons/Facilities.svg";
import Layout from '../../components/Layout'
import OrganizationIcon from "../../assets/icons/Organization.svg";
import React from 'react'
import Router from 'next/router';
import SpacesIcon from "../../assets/icons/Spaces.svg";

function index() {
  return (
    <Layout>

<h2 className="text-xl font-bold">Service Management</h2>
            <BasicBreadcrumbs currentPage={"Service Management"} />

            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Category" subHeading="Manage Category" icon={OrganizationIcon} onClick={() => Router.push('/service/category')} />
                </div>
                <div className="col-12 col-md-3">

                    <BlockMenu heading="Schedules" subHeading="Manage Schedule" icon={BuildingsIcon} onClick={() => Router.push('/service/schedule')} />

                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Services" subHeading="Manage Services" icon={SpacesIcon} onClick={() => Router.push('/service/services')} />

                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Queue Display System" subHeading="Manage Queue Display System" icon={FacilitiesIcon} onClick={() => Router.push('/service/queue-display-system')} />
                </div>
            </div>
    </Layout>
  )
}

export default index
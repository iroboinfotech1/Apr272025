import React from 'react';
import BlockMenu from '../components/BlockMenu';
import Layout from '../components/Layout';
import Breadcrumbs from "../components/common/Breadcrumbs";
import Router from 'next/router'
import BuildingsIcon from "../assets/icons/Buildings.svg";
import OrganizationIcon from "../assets/icons/Organization.svg";


const UserManagement = () => {

    return (
        <Layout>
            <h2 className="text-xl font-bold">User Management</h2>
            <Breadcrumbs currentPage={"User Management"} />

            <div className="row justify-content-left mt-5">
                <div className="col-12 col-md-3">
                    <BlockMenu heading="User Management" subHeading="User Management" icon={OrganizationIcon} onClick={() => Router.push('/user/UserManagement')} />
                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Roles & Permissions" subHeading="Roles & Permissions" icon={BuildingsIcon} onClick={() => Router.push('/user/RolesandPermission')} />
                </div>
		<div className="col-12 col-md-3">
                    <BlockMenu heading="Org-Realm Mapping" subHeading="Org-Realm Mapping" icon={BuildingsIcon} onClick={() => Router.push('/user/OrgRealmMapping')} />
                </div>
                <div className="col-12 col-md-3">
                    <BlockMenu heading="Roles & Attributes" subHeading="Roles & Attributes" icon={BuildingsIcon} onClick={() => Router.push('/user/RolesandAttributes')} />
                </div>
                <div className="col-12 col-md-3 p-4">
                    <BlockMenu heading="User Groups" subHeading="User Group Mapping" icon={BuildingsIcon} onClick={() => Router.push('/user/UserGroupMapping')} />
                </div>
            </div>
        </Layout>
    )
}

export default UserManagement;
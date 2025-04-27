import { useForm } from "react-hook-form";
import React, { useMemo,useEffect,useState } from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import Router,{useRouter} from 'next/router';
import Layout from '../../components/Layout';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ApiResponse from "../../models/ApiResponse";
import RoleList from "../../models/usermgmt/RoleList";
import UsermanagementService from "../../services/usermanagement.service";
import withAuth from '../../HOC/withAuth';

const schema = yup.object().shape({
    roleName: yup.string().required('Role Name is required'),
    roleBase: yup.string().required('Role Base is required'),
});

type props = { roleList? : RoleList};
const AddRole = ({roleList}:props) => {
    const router = useRouter()
    const {id} = router.query
    const  isAddRole = id ? false : true ;
    const [loader, setLoader] = useState<boolean>(false);
    const {register,handleSubmit,setValue,formState: {errors, defaultValues}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return roleList;
          }, [roleList])
    });

    useEffect(()=> {
        console.log("isAddRole :" + isAddRole)
        if(id){
            const roleId = parseInt(id.toString(),10); 
            fetchRoleData(roleId);
        }
    },[]);
    
    async function fetchRoleData(roleId: number){
        setLoader(true);
        var response = await UsermanagementService.getRoleDetails(roleId);
        console.log("UsermanagementService getRoleDetails", response);
        if (response.status == true) {
            setValue("roleId", response.data.roleId);
            setValue("roleName", response.data.roleName);
            setValue("roleBase", response.data.roleBase);
        }
        setLoader(false);
        console.log("UsermanagementService-getUser", response);
    }

    const onSubmit = async (data: any) => {
        data.userId = 4;
        console.log("form data", data);
        var formData: any = {};
        for (var key in data) {
            formData[key] = data[key];
        }

        let response: ApiResponse;
        if(isAddRole){
            response = await UsermanagementService.addRole(formData);
        }else{
            response = await UsermanagementService.updateRole(formData);
        }
        

        if(response.status == true){
            Router.push('/user/RolesandPermission');
        }

        console.log("UsermanagementService addRole", response);
    }  

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }, { 'name': 'Roles & Permissions', 'path': '/user/RolesandPermission' }];  
    return(
        <Layout>
            <h2 className="text-xl font-bold">{isAddRole ?  'Add Role' : 'Edit Role'}</h2>
            <Breadcrumbs currentPage={isAddRole ?  'Add Role' : 'Edit Role'} routes={breadcrumbPaths}/>
            {
                <div  className="container">
                    {loader ? <div>Loading... </div> :
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('roleName')} fullWidth label="Role Name" variant="outlined" className="pk-input"
                                    error={!!errors.roleName}
                                    helperText={errors.roleName?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('roleBase')} fullWidth label="Role Base" variant="outlined" className="pk-input"
                                    error={!!errors.roleBase}
                                    helperText={errors.roleBase?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-4">
                                    <Button variant="contained" type="submit">{isAddRole ?  'Add Role' : 'Update Role'}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    } 
                </div>
            }
        </Layout>
    )
}

export default withAuth(AddRole);
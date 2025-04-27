import { useForm } from "react-hook-form";
import React, { useMemo, useEffect,useState } from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from "@mui/material";
import Router, {useRouter} from 'next/router';

import Layout from '../../components/Layout';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ApiResponse from "../../models/ApiResponse";
import UserList from "../../models/usermgmt/UserList";
import UsermanagementService from "../../services/usermanagement.service";
import RolesandPermissionList from "../../models/usermgmt/RoleList";
import withAuth from '../../HOC/withAuth';
const schema = yup.object().shape({
    userName: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    secretWord: yup.string().required('password is required'),
    repeatSecretWord: yup.string().required('Repeat Password is required'),
    roleId: yup.string().required('Role is required')
  });

type props = {userList?: UserList};
const User = ({userList}:props) => {
    const router = useRouter()
    const {id} = router.query
    const  isAddUser = id ? false : true ;
    const [loader, setLoader] = useState<boolean>(false);
    const [roleList, setRoleList] = useState<RolesandPermissionList[]>([]);
    const [roleId, setRoleId] = useState<number>();

    const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
          return userList;
        }, [userList])
      });

    useEffect(()=> {
        console.log("isAddUser :" + isAddUser)
        if(id){
            const userId = parseInt(id.toString(),10); 
            fetchUserData(userId);
        } else {
            fetchRoleList(0);
        }
    },[]);  

    async function fetchUserData(userId: number){
        setLoader(true);
        var response = await UsermanagementService.getUser(userId);
        console.log("UsermanagementService getUser", response);
        if (response.status == true) {
            setValue("userId", response.data.userId);
            setValue("userName", response.data.userName);
            setValue("email", response.data.email);
            //setValue("roleName", response.data.roleName);
            setValue("roleId", response.data.roleId);
            setValue("joined", response.data.joined);
            setValue("secretWord", response.data.secretWord);
            setValue("repeatSecretWord", response.data.repeatSecretWord);
            fetchRoleList(response.data.roleId);
        }
        setLoader(false);
        console.log("UsermanagementService-getUser", response);
    }
    
    async function fetchRoleList(roleId:number) {
        setLoader(true);
        var response = await UsermanagementService.getroleslist();
        if (response.status == true) {
            setRoleList(response.data);
            console.log("roleList", roleList );
            if(response.data && !isAddUser){
                // var id = response.data.find( x => x.roleName == roleName )?.roleId;
                // id = id ? parseInt(id) : 0;
                if(roleId != 0){
                    setRoleId(roleId);
                }
            }
        }
        setLoader(false);
        console.log("fetchRoleList", response);
    }

    const handleChange = (event: SelectChangeEvent) => {
        let roleId = event.target.value ? parseInt(event.target.value) : 0;
        setRoleId(roleId);
      };

    const onSubmit = async (data: any) => {
        console.log("form data", data);
        var formData: any = {};
        for (var key in data) {
            formData[key] = data[key];
        }

        let response: ApiResponse;
        if(isAddUser){
            response = await UsermanagementService.addUser(formData);
        }else{
            response = await UsermanagementService.updateUser(formData);
        }

        if(response.status == true){
            Router.push('/user/UserManagement');
        }

        console.log("UsermanagementService addUser", response);
    }  

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User Management', 'path': '/user' }, { 'name': 'User Management', 'path': '/user/UserManagement' }];  
    return (
        <Layout>
            <h2 className="text-xl font-bold"> {isAddUser ?  'Add User' : 'Edit User'}</h2>
            <Breadcrumbs currentPage={isAddUser ?  'Add User' : 'Edit User'} routes={breadcrumbPaths}/>
            {
                <div  className="container">
                    {loader ? <div>Loading... </div> :
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('userName')} fullWidth label="Name" variant="outlined" className="pk-input"
                                    error={!!errors.userName}
                                    helperText={errors.userName?.message?.toString()}
                                    />
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('email')} fullWidth label="Email" variant="outlined" className="pk-input"
                                    error={!!errors.email}
                                    helperText={errors.email?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('secretWord')} fullWidth label="Password" type="password" variant="outlined" className="pk-input"
                                    error={!!errors.secretWord}
                                    helperText={errors.secretWord?.message?.toString()}
                                    />
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('repeatSecretWord')} fullWidth label="Repeat Password" type="password" variant="outlined" className="pk-input"
                                    error={!!errors.repeatSecretWord}
                                    helperText={errors.repeatSecretWord?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-8 mt-3">
                                <FormControl fullWidth className="pk-dropdown" error={!!errors.roleId} >
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select {...register('roleId')}  labelId="demo-simple-select-label"  onChange={handleChange}
                                    id="demo-simple-select" label='Role' value={roleId ? roleId.toString() : ''}>
                                        {roleList && roleList.length > 0 && roleList?.map((x: any) => (<MenuItem key={x.roleId} value={x.roleId}>{x.roleName}</MenuItem>))}
                                    </Select>
                                    {errors.roleId && <FormHelperText>{errors.roleId.message?.toString()}</FormHelperText>}
                                </FormControl>  
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-4">
                                    <Button variant="contained" type="submit">{isAddUser ?  'Add User' : 'Update User'}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                } 
                </div>
            }
        </Layout>
    );
}

export default withAuth(User);
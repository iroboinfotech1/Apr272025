import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { Button, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import UserProfileInfo from "../../models/usermgmt/UserProfile";
import withAuth from '../../HOC/withAuth';
import Building from "../../models/spacemgmt/building";
import SpaceService from "../../services/space.service";
import Image from 'next/image';
import UsermanagementService from "../../services/usermanagement.service";
import ApiResponse from "../../models/ApiResponse";
import SaveAlert from "../../components/common/saveAlert";
import ModalService from "../../components/lib/modalPopup/services/ModalService";

type props = { userProfileInfo?: UserProfileInfo };
const UserProfile = ({ userProfileInfo }: props) => {

    const [formData, setFormData] = useState({
        userId: "UID-6",
        defaultTimezone: "",
        timeZoneInterest: "",
        buildingId:0,
        userImage: null,
        preferredWeekEnd: ""
    });

    const router = useRouter()
    const { id } = router.query
    const isAddUserPreferences = true;//id ? false : true;
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [timeZoneInterest, setTimeZoneInterest] = useState<any>([]);
    const [preferredWeekEnd, setPreferredWeekEnd] = useState<any>([]);
    const timezones = ['UTC', 'EST', 'PST', 'CST', 'IST'];
    const [userImage, setUserImage] = useState<any>();
    const [userId,setUserId]=useState<string>('UID-6');


    const handlePreferredWeekEndChange = (event: any) => {
        setPreferredWeekEnd(event.target.value);
        setFormData((prevData) => ({
            ...prevData,
            preferredWeekEnd: event.target.value
        }));
    };

    const handleDefaultBuildingChange = (event: any) => {
        setSelectedBuilding(event.target.value);
        console.log('mari log', event);
        setFormData((prevData) => ({
            ...prevData,
            buildingId: event.target.value
        }));
    };

    const handleDefaultTimezoneChange = (event: any) => {
        setSelectedTimezone(event.target.value);
        console.log('mari e', event);
        setFormData((prevData) => ({
            ...prevData,
            defaultTimezone: event.target.value,
        }));
    };

    const handleUserImageChange = (event: any) => {
        setFormData((prevData) => ({
            ...prevData,
            userImage: event.target.value,
        }));
    };

    const handleInterestedTimezoneChange = (event: any) => {
        setTimeZoneInterest(event.target.value);
        setFormData((prevData) => ({
            ...prevData,
            timeZoneInterest: event.target.value,
        }));
    };

     async function fetchUserPreferences() {
            var response = await UsermanagementService.getUserPreferences("UID-6");
            console.log("UsermanagementService getUserPreferences", response);
            if (response.status == true && response.data!=null) {
                setUserId(response.data.userId);
                setTimeZoneInterest(response.data.timeZoneInterest);
                setSelectedTimezone(response.data.defaultTimeZone);
                setSelectedBuilding(response.data.buildingId);
            }
        }
        
        useEffect(() => {
            fetchUserPreferences();
        }, []);

    useEffect(() => {
        SpaceService.getBuildingList().then((response) => {
            if (response.status === true) {
                setBuildings(response.data);
                setSelectedBuilding(response.data[0].buildingId)
            }
        });
    }, []);

    const handleSubmit = async () => {
        setFormData((prevData) => ({
            ...prevData,
            userId: "UID-6"
        }));
        console.log("User Profile Create User Preference Request:", formData);
        let response=await UsermanagementService.createUserPreferences(formData);
        if (response.status == 200) {
            openModel(SaveAlert, { message: "Successfully Saved!" });
              console.log("Successfully Saved!");
        }
        else openModel(SaveAlert, { message: "Save Failed" });

        console.log("User Profile Create User Preference Response:", response);
    };

     const openModel = (component, props) => {
        ModalService.open(component, props);
      };

   
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.files);
    if (e.target.files != null && e.target.files.length > 0) {
      getBase64(e.target.files[0]);
    }
  };

  const getBase64 = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setUserImage(reader.result);
      setFormData((prevData) => ({
        ...prevData,
        userImage: userImage,
    }));
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'User ', 'path': '/user' }, { 'name': 'User Profile', 'path': '/user/UserProfile' }];
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <Layout>
                <h2 className="text-xl font-bold"> {isAddUserPreferences ? 'Add User Profile' : 'Edit User Profile'}</h2>
                <Breadcrumbs currentPage={isAddUserPreferences ? 'Add User Profile' : 'Edit User Profile'} routes={breadcrumbPaths} />
                {
                    <div className="container">
                        <div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                          <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <Image
                                              src={userImage}
                                              alt="Editable Image"
                                              width={150}
                                              height={50}
                                              quality={75}
                                            />
                                          </div>
                                    
                                          <div style={{ marginTop: '20px' }}>
                                            <Button variant="contained" component="label">
                                              Update Profile Photo
                                              <input hidden accept="image/*" onChange={handleImageChange} type="file" />
                                            </Button>
                                          </div>
                                        </div>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <InputLabel id="demo-simple-select-label">Default Building</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="demo-simple-select-label"
                                        value={selectedBuilding}
                                        id="demo-simple-select"
                                        label="Select Timezone"
                                        onChange={(e) => handleDefaultBuildingChange(e)}
                                    >
                                        {buildings.map((option, index) => (
                                            <MenuItem key={option.buildingId} value={option.buildingId}>{option.buildingName}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <InputLabel id="demo-simple-select-label">Default Timezone</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="demo-simple-select-label"
                                        value={selectedTimezone}
                                        id="demo-simple-select"
                                        label="Select Timezone"
                                        onChange={(e) => handleDefaultTimezoneChange(e)}
                                    >
                                        {timezones.map((option, index) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <InputLabel id="demo-simple-select-label">Interested Timezones</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="multiple-select-label"
                                        id="multiple-select"
                                        multiple
                                        value={timeZoneInterest}
                                        label="Interested Timezone"
                                        onChange={(e) => handleInterestedTimezoneChange(e)}
                                        renderValue={(selected) => selected.join(', ')} // Customize how the selected values are displayed
                                    >

                                        {timezones.map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                                <Checkbox checked={timeZoneInterest.indexOf(option) > -1} />
                                                <ListItemText primary={option} />
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <InputLabel id="demo-simple-select-label">Preferred Week End</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="multiple-select-label"
                                        id="multiple-select"
                                        multiple
                                        value={preferredWeekEnd}
                                        onChange={(e) => handlePreferredWeekEndChange(e)}
                                        renderValue={(selected) => selected.join(', ')} // Customize how the selected values are displayed
                                    >
                                        <MenuItem value="Sunday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Sunday') > -1} />
                                            <ListItemText primary="Sunday" />
                                        </MenuItem>
                                        <MenuItem value="Monday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Monday') > -1} />
                                            <ListItemText primary="Monday" />
                                        </MenuItem>
                                        <MenuItem value="Tuesday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Tuesday') > -1} />
                                            <ListItemText primary="Tuesday" />
                                        </MenuItem>
                                        <MenuItem value="Wednesday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Wednesday') > -1} />
                                            <ListItemText primary="Wednesday" />
                                        </MenuItem>
                                        <MenuItem value="Thursday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Thursday') > -1} />
                                            <ListItemText primary="Thursday" />
                                        </MenuItem>
                                        <MenuItem value="Friday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Friday') > -1} />
                                            <ListItemText primary="Friday" />
                                        </MenuItem>
                                        <MenuItem value="Saturday">
                                            <Checkbox checked={preferredWeekEnd.indexOf('Saturday') > -1} />
                                            <ListItemText primary="Saturday" />
                                        </MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-4">

                                    <Button variant="contained" type="submit">{isAddUserPreferences ? 'Add User Profile' : 'Update User Profile'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Layout>
        </form>
    );
}

export default withAuth(UserProfile);

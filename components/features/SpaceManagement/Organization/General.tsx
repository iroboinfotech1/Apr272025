import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import React, { useEffect, useMemo, useRef, useState } from "react";
import ApiResponse from "../../../../models/ApiResponse";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Industry from '../../../../models/masters/Industry';
import State from '../../../../models/masters/State';

import City from '../../../../models/masters/City';
import Country from '../../../../models/masters/Country';
import OrganizationService from '../../../../services/organization.service';
import MasterService from '../../../../services/master.service';
import Organization from '../../../../models/spacemgmt/organization';



const schema = yup.object().shape({
  orgName: yup.string().required('Organization Name is required')
  // ,industry: yup.string().required('Industry is required'),
  // buildingName: yup.string().required('Building Name is required'),
  // mailingAddress: yup.string().required('Mailing Address is required'),
  // country: yup.string().required('Country is required'),
  // state: yup.string().required('State is required'),
  // city: yup.string(),
  // zipcode: yup.string().required('zipcode is required').max(10, 'Zip code should not be greater than 10 characters'),
  // phoneNumber: yup.string().required('Phone Number is required').min(6, 'Phone number should not be less than 6 digits').max(15, 'Phone number should not be greater than 15 digits'),
  // email: yup.string().required('Email is required'),
  // website: yup.string(),
  // logo: yup.mixed().required('Logo is required')
});


type props = { changeStep: (step: number) => void, submittedCallback: (org: any) => void, organization?: Organization };

let renderCount = 0;
const AddOrgGeneral = ({ changeStep, submittedCallback, organization }: props) => {
  //debugger;

  console.log("renderCount", ++renderCount);

  type initializeDataType = { industries: Industry[], countries: Country[] };

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [imglogo, setLogo] = useState<any>({ iconName: organization?.logo, iconImage: organization?.image });
  const [initializeData, setInitializeData] = useState<initializeDataType>({ industries: [], countries: [] });
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const fileInput = useRef<any>(null);

  useEffect(() => {
    async function fetchMyApi() {
      let industryResponse = await MasterService.getIndustries();
      let countryResponse = await MasterService.getCountries();

      let initializationData: initializeDataType = {} as initializeDataType;

      if (industryResponse.status === true) {
        initializationData.industries = industryResponse.data;
        console.log("industryLoad");
      }
      if (countryResponse.status === true) {
        initializationData.countries = countryResponse.data;
        console.log("countryLoad");
      }
      setInitializeData(initializationData);

      if (organization != null) {
        console.log(organization);
        if (organization.countryId != null)
          await renderStateForSelectedCountry((organization.countryId!));
        if (organization.stateId != null)
          await renderCitiesForSelectedState((organization.stateId!));
        console.log("industry is set", organization.industry.toString());
        setValue('industry', organization.industry);
      }
      setLoader(false);
    }
    fetchMyApi();

  }, [])


  const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => {
      return organization;
    }, [organization])
  });


  let selectedCountry: number;
  let selectedState: number;

  const industries = initializeData!.industries;
  const countries = initializeData!.countries;

  const onCountryChange = (e: SelectChangeEvent<string>) => {
    console.log("country Change event", e.target.value);
    selectedCountry = parseInt(e.target.value);
    renderStateForSelectedCountry(selectedCountry);
  };

  async function renderStateForSelectedCountry(countryId: number) {
    //setValue('country', countryId.toString());
    setValue('country', countryId);
    var response = await MasterService.getStates(countryId);
    console.log("getStates response");
    if (response.status === true) {
      setStates(response.data)
    }
  }

  const onStateChange = (e: SelectChangeEvent<string>) => {
    console.log("state Change event", e.target.value);
    selectedState = parseInt(e.target.value);
    renderCitiesForSelectedState(selectedState);
  };

  async function renderCitiesForSelectedState(stateId: number) {
    //setValue('state', stateId.toString());
    setValue('state', stateId);
    var response = await MasterService.getCities(stateId);
    console.log("getCities response");
    if (response.status === true) {
      setCities(response.data)
    }
  }




  const handleFileChange = (e: any) => {

    getBase64(fileInput.current?.files[0]);

  }
  const getBase64 = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setLogo({ iconName: file.name, iconImage: reader.result });
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  const { ref, ...logo } = register("logo", { onChange: handleFileChange });

  const handleClick = () => {
    fileInput.current!.click();
  };

  const removeFile = () => {
    setValue('logo', '')
    setLogo({});
  }


  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };


  const onSubmit = async (data: any) => {
    console.log("form data", data);
    var formData: any = {};
    for (var key in data) {
      formData[key] = data[key];
    }
    formData.logo = imglogo.iconName;
    formData.image = imglogo.iconImage;
    let response: ApiResponse;
    if (organization?.orgId == null) {
      response = await OrganizationService.createOrgGeneralDetails(formData);
    } else {
      response = await OrganizationService.updateOrgGeneralDetails(formData);

    }
    console.log(response);
    if (response.status) {
      submittedCallback(response.data);
      setOpen(true);
      changeStep(2);
    }
  }


  return (
    loader == true ? <div>Loading Data...</div> :
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('orgName')} fullWidth label="Organization Name" variant="outlined" className="pk-input"
              error={!!errors.orgName}
              helperText={errors.orgName?.message?.toString()}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <FormControl fullWidth className="pk-dropdown" error={!!errors.industry} >
              <InputLabel id="demo-simple-select-label">Industry</InputLabel>
              <Select {...register('industry',)} defaultValue={organization?.industry ?? 0} labelId="demo-simple-select-label" id="demo-simple-select" label="Industry"  >
                {industries.map(x => (<MenuItem key={"ind-" + x.industry_id} value={x.industry_id}>{x.industry_name}</MenuItem>))}
              </Select>
              {errors.industry && <FormHelperText>{errors.industry.message?.toString()}</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('buildingName')} fullWidth label="Building Name" variant="outlined" className="pk-input"
              error={!!errors.buildingName}
              helperText={errors.buildingName?.message?.toString()}
            />
          </div>
          <div className="col-10 col-md-5 mt-3">
            <TextField {...register('mailingAddress')} fullWidth label="Mailing Address" variant="outlined" className="pk-input"
              error={!!errors.mailingAddress}
              helperText={errors.mailingAddress?.message?.toString()}
            />
          </div>
          <div className="col-2 col-md-1">
            <div className="mt-3">
              <i
                className="pi pi-map-marker"
                style={{
                  fontSize: "1.7em",
                  color: "green",
                  marginTop: "5px",
                }}
              ></i>
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <FormControl fullWidth className="pk-dropdown" error={!!errors.country} >
              <InputLabel id="demo-simple-select-label">Country</InputLabel>
              <Select {...register('country', { onChange: onCountryChange })} defaultValue={organization?.country ?? 0} labelId="demo-simple-select-label" id="demo-simple-select" label="Country" >
                {countries.map(x => (<MenuItem key={"cont-" + x.id} value={x.id}>{x.name}</MenuItem>))}
              </Select>
              {errors.country && <FormHelperText>{errors.country.message?.toString()}</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <FormControl fullWidth className="pk-dropdown" error={!!errors.state} >
              <InputLabel id="demo-simple-select-label">State/Province</InputLabel>
              <Select {...register('state', { onChange: onStateChange })} labelId="demo-simple-select-label" id="demo-simple-select" label="State/Province" defaultValue={organization?.state ?? 0} >
                {states.map(x => (<MenuItem key={"state-" + x.id} value={x.id}>{x.name}</MenuItem>))}
              </Select>
              {errors.state && <FormHelperText>{errors.state.message?.toString()}</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <FormControl fullWidth className="pk-dropdown" error={!!errors.city} >
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select {...register('city')} labelId="demo-simple-select-label" id="demo-simple-select" label="City" defaultValue={organization?.city ?? 0} >
                {cities.map(x => (<MenuItem key={"city-" + x.id} value={x.id}>{x.name}</MenuItem>))}
              </Select>
              {errors.city && <FormHelperText>{errors.city.message?.toString()}</FormHelperText>}
            </FormControl>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('zipcode')} fullWidth label="Zip Code" variant="outlined" className="pk-input"
              error={!!errors.zipcode}
              helperText={errors.zipcode?.message?.toString()}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('phoneNumber')} fullWidth label="Phone Number" variant="outlined" className="pk-input"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message?.toString()}
            />

          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('email')} fullWidth label="Email" variant="outlined" className="pk-input"
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <TextField {...register('website')} fullWidth label="Website" variant="outlined" className="pk-input"
              error={!!errors.website}
              helperText={errors.website?.message?.toString()}
            />
          </div>
          <div className="col-12 mt-3 text-center">
            <input type="file" className="d-none" ref={(e) => { ref(e); fileInput.current = e; }} {...logo} />
            {
              imglogo.iconName ?
                <div className="pk-uploadFile">
                  {imglogo.iconName}
                  <span className="ms-3 pk_pointer" onClick={removeFile}>
                    <CloseIcon fontSize="small" color="primary" />
                  </span>
                </div>
                :
                <div className="pk_file_upload_block" onClick={() => handleClick()}>
                  <span><i className="pi pi-upload" style={{ color: "blue" }}></i></span>
                  <span className="ms-3 text-black-50">Upload Logo</span>
                </div>
            }


            <div>{errors.logo && errors.logo?.message?.toString()}</div>
          </div>
          <div className="col-12 text-center mt-4">
            <Button variant="contained" type="submit">Submit</Button>
          </div>
        </div>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right', }} open={open} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert variant="filled" severity="success" onClose={handleCloseAlert}>
            Organization details saved successfully..!
          </Alert>
        </Snackbar>
      </form >

  );
}

export default AddOrgGeneral;

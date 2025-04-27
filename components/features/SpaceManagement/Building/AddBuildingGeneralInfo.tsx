
import React, { useEffect, useMemo, useRef, useState } from "react";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { KVP } from "../../../../models/masters/Industry";
import Button from "@mui/material/Button";
import OrganizationService from "../../../../services/organization.service";
import Building from "../../../../models/spacemgmt/building";

const schema = yup.object().shape({
    // orgId: yup.string().required('Organization Name is required'),
    // address: yup.string().required('Location is required'),
    // buildingName: yup.string().required('Building is required'),
    // groupName: yup.string().required('Group is required'),
});

type props = { buildingData: Building, changeStep: (step: number, buildingData: Building) => void };

const AddBuildingGeneralInfo = ({ changeStep, buildingData }: props) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return buildingData;
          }, [buildingData])

    });

    const [orgList, setOrgList] = useState<any>();


    useEffect(() => {

        (async () => {

            var orglist = await OrganizationService.getList();
            if (orglist?.data)
                setOrgList(orglist.data);
        })();

    }, [])

    const onSubmit = async (data: any) => {
        console.log("form data", data);
        changeStep(2, { ...buildingData, ...data });
    }

    return (
        <div className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-12 mt-3">
                        <FormControl fullWidth className="pk-dropdown" error={!!errors.orgId} >
                            <InputLabel id="demo-simple-select-label">Organization Name</InputLabel>
                            <Select {...register('orgId')} defaultValue={buildingData?.orgId ?? ""} labelId="demo-simple-select-label" id="demo-simple-select" label="Organization Name">
                                {orgList && orgList.length > 0 && orgList?.map((x: any) => (<MenuItem key={x.orgId} value={x.orgId}>{x.orgName}</MenuItem>))}
                            </Select>
                            {errors.orgId && <FormHelperText>{errors.orgId.message?.toString()}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className="col-12  mt-3">
                        <TextField {...register('address')} fullWidth label="Location" variant="outlined" className="pk-input"
                            error={!!errors.address}
                            // value={buildingData?.address}
                            helperText={errors?.address?.message?.toString()}
                        />
                    </div>
                    <div className="col-12 mt-3">
                        <TextField {...register('buildingName')} fullWidth label="Building" variant="outlined" className="pk-input"
                            error={!!errors.buildingName}
                            // value={buildingData?.buildingName}
                            helperText={errors?.buildingName?.message?.toString()}
                        />
                    </div>
                    <div className="col-12 mt-3">
                        <TextField {...register('groupName')} fullWidth label="Group" variant="outlined" className="pk-input"
                            error={!!errors.groupName}
                            // value={buildingData?.groupName}
                            helperText={errors?.groupName?.message?.toString()}
                        />
                    </div>
                    <div className="col-12 text-center mt-5">
                        <Button variant="contained" type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddBuildingGeneralInfo;
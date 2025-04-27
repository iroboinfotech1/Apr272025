
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { KVP } from "../../../../models/masters/Industry";
import SpaceService from "../../../../services/space.service";
import FacilityService from "../../../../services/facility.service";


const schema = yup.object().shape({
    space: yup.string().required('Please select any space')
});

type props = { addSpace: boolean;  afterSubmit: any, spaceDetails: any };
const SelectSpace = (props: props) => {

    type initializeDataType = { spaces: string[] };

    type FacilityTypesDataType = { facilityTypeId,facilityTypeName };


    const [initializeData, setInitializeData] = useState<initializeDataType>({ spaces: ['Room', 'Hot Desk', 'Parking'] });
    const [facilityTypes, setFacilityTypes] = useState<FacilityTypesDataType[]>();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        var response = await FacilityService.GetAllFacilityTypes();
            if (response.status === true) {
                setFacilityTypes(response.data);
            }
    }


    const onSubmit = (data: any) => {
        //var s = facilityTypes;
        console.log('submitted data', data);
        if(facilityTypes){
            var facility =  facilityTypes.find( x=> x.facilityTypeId == data.space);
            if(facility){
                data.space = facility.facilityTypeName;
                data.spaceId = facility.facilityTypeId;
            }
        }
        props.afterSubmit(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mt-3">
                <div className="col-12">
                    <FormControl fullWidth className="pk-dropdown" error={!!errors.space}>
                        <InputLabel id="demo-simple-select-label">Select Space</InputLabel>
                        <Select {...register('space')} defaultValue="" value={props?.spaceDetails?.spaceTypeId} labelId="ddlSelectSpace" id="ddlSelectSpace" label="Select Space">
                            {facilityTypes?.map(x => {
                                return <MenuItem key={x.facilityTypeId} value={x.facilityTypeId}>{x.facilityTypeName}</MenuItem>
                            })}
                        </Select>
                        {errors.space && <FormHelperText>{errors.space.message?.toString()}</FormHelperText>}
                    </FormControl>
                </div>
                <div className="col-12 mt-4">
                    <Button variant="contained" type="submit" fullWidth={true}>Submit</Button>
                </div>
            </div >
        </form>);
}

export default SelectSpace;
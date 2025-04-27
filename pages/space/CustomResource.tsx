import { useState, useEffect } from "react"
import { Resource } from "../../models/spacemgmt/facility/FacilityModel"
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import Button from "@mui/material/Button";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FacilityService from "../../services/facility.service";
import Switch from '@mui/material/Switch';
import IncDecCounter from '../../components/incDecCounter';

const CustomResource = ({ facilityId }: any) => {

    //const [facilityId, setFacilityId] = useState<any>(facilityId)
    const [facility, setFacility] = useState<any>(null)
    const citySelectItems = [
        { label: 'Toggle', value: 'toggle' },
        { label: 'Count', value: 'count' },
        { label: 'Bookable', value: 'bookable' },

    ];

    const [customResource, setCustomResource] = useState<Resource>({
        name: "", type: "", isEnabled: true, facilityId: facilityId,count:0
    })

    useEffect(() => {
        fetchMyApi(facilityId);
    }, []);

    const CreateCustomResource = (newValue: any) => {
        // //debugger;
        // var newResource = Object.assign(customResource, newValue)
        setCustomResource({ ...customResource, ...newValue })
    }
    async function onCustomAdd() {
        var response = await FacilityService.CreateResource(customResource);
        if (response.status === true) {
            fetchMyApi(customResource.facilityId);
        }
    }

    async function fetchMyApi(facilityId: number) {
        var response = await FacilityService.getFacilitiesById(facilityId);
        if (response.status === true) {
            setFacility(response.data);
        }
    }

    const handleToggle = (isEnabled: boolean, resourceId: any) => {
        const newResources = facility.resources.map(resource => {
            if (resource?.resourceId === resourceId) {
                return {
                    ...resource,
                    isEnabled: isEnabled,
                };
            } else {
                return resource;
            }
        });
        setFacility({...facility,resources:newResources});
        //Invoke API to Update Change
        var newResource = newResources!.find(r => r.resourceId == resourceId);
        if (newResource) {
            FacilityService.UpdateResourceStatus(newResource);
        }
    };

    const handleCounter = (action:string, resourceId: any) => {
        const newResources = facility.resources.map(resource => {
            if (resource?.resourceId === resourceId) {
                return {
                    ...resource,
                    count: (action == 'INCREASE') ? resource?.count + 1 : resource?.count - 1,
                };
            } else {
                return resource;
            }
        });
        setFacility({...facility,resources:newResources});
        //Invoke API to Update Change
        var newResource = newResources!.find(r => r.resourceId == resourceId);
        if (newResource) {
            FacilityService.UpdateResourceStatus(newResource);
        }
    }

    return (
        <div className="row p-5">
            <div className="col-12 ">
                <div className="table-responsive ">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Resources</th>
                                <th>Resources Type</th>
                                <th>Enable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facility?.resources?.map((x: any) => {
                                if (x?.type == 'toggle') {
                                    return (
                                        <tr key={x?.resourceId}>
                                            <td>{x?.name}</td>
                                            <td>{x?.type}</td>
                                            <td>
                                                <div>
                                                    <Switch color="primary" key={x?.resourceId} checked={x?.isEnabled}
                                                        onChange={(e) => { handleToggle(e.target.checked, x?.resourceId) }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                else {
                                    return (
                                        <tr key={x?.resourceId}>
                                            <td>{x?.name}</td>
                                            <td>{x?.type}</td>
                                            <td>
                                                <div>
                                                    <IncDecCounter value={x?.count} onDecreaseClick={() => handleCounter('DECREASE', x?.resourceId)}
                                                        onIncreaseClick={() => handleCounter('INCREASE', x?.resourceId)}></IncDecCounter>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                };
                            })}
                            <tr></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-12 mt-3">
                <form >
                    <div className="row align-items-center ">
                        <div className="col-12 col-md-3">
                            {/* <TextField label="Add Custom" fullWidth variant="outlined" size="small" style={{ padding: "1.2rem 0.8rem" }} /> */}
                            <span className="p-float-label">
                                <InputText type="text" className="p-inputtext-sm block" value={customResource.name} onChange={(e) => { CreateCustomResource({ name: e.target.value }) }} />
                                <label>Add Custom</label>
                            </span>
                        </div>
                        <div className="col-12 col-md-3">
                            <span className="p-float-label">
                                {/* <InputText type="text" className="p-inputtext-sm block" /> */}
                                <Dropdown options={citySelectItems} placeholder="Select Type" value={customResource.type} onChange={(e) => { CreateCustomResource({ type: e.target.value }) }} />
                                <label>Type</label>
                            </span>
                            {/* <TextField label="Type" variant="outlined" className="pk-input" /> */}
                        </div>
                        <div className="col-12 col-md-3">
                            <Button variant="contained" type="button" size="small" >Choose icon</Button>
                        </div>
                        <div className="col-12 col-md-3" >
                            <Button variant="contained" type="button" size="small">
                                <ControlPointIcon></ControlPointIcon>
                                <span className="ms-2" onClick={onCustomAdd} >Add Custom </span> </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    );

}
export default CustomResource;
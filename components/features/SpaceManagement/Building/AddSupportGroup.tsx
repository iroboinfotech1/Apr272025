import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import Building from "../../../../models/spacemgmt/building";
import { Facility } from "../../../../models/spacemgmt/facility/FacilityModel";
import FacilityService from "../../../../services/facility.service";

type props = { buildingData: Building, changeStep: (step: number, buildingData: Building) => void };

const AddSupportGroup = ({ changeStep, buildingData }: props) => {

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [building, setBuildingData] = useState(buildingData);

    useEffect(() => {

        fetchMyApi();

    }, [building]);


    async function fetchMyApi() {
        if (building?.orgId) {
            var response = await FacilityService.getByOrgId(building.orgId);
            if (response.status === true) {
                setFacilities(response.data);
            }
        }
    }



    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4 div-md-6 margin-auto">
                {
                    facilities.map((x, i) => {
                        return (
                            <div className="row border-bottom align-items-center" key={i}>
                                <div className="col-10">
                                    {x.facilityName}
                                </div>
                                <div className="col-2">
                                    <Switch checked={true} />
                                </div>
                            </div>
                        )
                    })
                }

            </div>
            <div className="col-12 text-center mt-5">
                <Button variant="contained" type="submit" onClick={() => changeStep(3, buildingData)}>Add Support Group</Button>
            </div>

        </div>
    );
}

export default AddSupportGroup;
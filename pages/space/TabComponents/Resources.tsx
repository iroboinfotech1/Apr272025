
import Devices from "/assets/icons/devices.svg"
import Lunch from "/assets/icons/lunch.svg"
import Coffee from "/assets/icons/coffee.svg"
import Plan from "/assets/icons/plan.svg"
import { useEffect, useState } from "react"
import FacilityService from "../../../services/facility.service"
import {  Resource } from "../../../models/spacemgmt/facility/FacilityModel"

const Resources = ({ spaceDetails }: any) => {

  //debugger;
  const [resources, setResources] = useState<Resource[]>([]);
  useEffect(() => {
    fetchMyApi();
  }, []);

  async function fetchMyApi() {

    var response = await FacilityService.GetResourceList(spaceDetails.floorId);

    if (response.status === true) {
      setResources(response.data);
    }

  }


  return (
    <div>
      <table className='table-auto w-full'>
        <tbody>
          {
            resources.map((item, index) => {
              return (
                <tr style={{ borderBottom: "1px solid #f7f3f3", height: "50px" }} key={index}>
                  <td className='w-9'><Devices></Devices></td>
                  <td className='text-sm'>{item.name}</td>
                  <td className='text-xs text-success'>Active</td>
                  <td></td>
                </tr>
              )
            })
          }

        </tbody>
      </table>
    </div>
  );

}
export default Resources;
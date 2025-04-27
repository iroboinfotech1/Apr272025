import { IArea } from '@bmunozg/react-image-area';
import { useEffect, useState } from 'react';
import ApiResponse from '../../../../../models/ApiResponse';
import SpaceService from '../../../../../services/space.service';
import RoomLeftPanel from './RoomLeftPanel';
import RoomRightPanel from './RoomRightPanel';

type props = { close: any, floorDetails: any, spaceDetails: any, afterSubmit: any, space: string, addSpace:boolean  };
const AddRoom = (props: props) => {

    const [space, setSpace] = useState<string>(() => {
        return props.space;
    });

    const [areas, setAreas] = useState<IArea[]>(() => {
        let coordinates = [];
        if (props?.spaceDetails?.coordinates)
            coordinates = props.spaceDetails.coordinates.split(",").map((item: any) => {
                let cor = item.split("|");
                return { x: cor[0], y: cor[1], width: cor[2], height: cor[3], unit: "%" }
            });
        return coordinates;
    });

    const setAreaData = (data: IArea[]) => {
        setAreas(data);
    }
    const onDeleteArea = (deleteItem: IArea) => {
        setAreas(areas.filter(x => x != deleteItem));
    }


    const onSubmitData = async (data: any) => {
        //debugger;
        // var request = {
        //     // "SpaceId": "",
        //     "FloorId": data.floorDetails.floor,
        //     "OrgId": data.floorDetails.organization,
        //     "BuildingId": data.floorDetails.building,
        //     "SpaceType": data.floorDetails.space,
        //     "SpaceAliasName": data.spaceAliasName,
        //     "MappedCalendarIds": [1, 2, 3],
        //     "email": data.email,
        //     "directionNotes": data.directionNotes,
        //     // "servicingFacilities": data.servicingFacilities,
        //     "coordinates": areas.map((x => { return x.x + "|" + x.y + "|" + x.width + "|" + x.height })).join(","),
        //     // "workweekdays": "workweekdays",
        //     // "startTime": "startTime",
        //     // "endTime": "endTime",
        //     // "resources": "resources",
        //     // "role": null
        // }

        var request: any = {
            // "SpaceId":null,
            "floorId": data.floorDetails.floor,
            "OrgId": data.floorDetails.organization,
            "BuildingId": data.floorDetails.building,
            "spaceTypeId": data.floorDetails.spaceId,
            "spaceAliasName": data.spaceAliasName,
            "mappedCalendarIds": data.mappedCalendarIds,
            "mappedConnectorIds": data.mappedConnectorIds,
            "email": data.email?.replace("\n",";"),
            "directionNotes": data.directionNotes,
            "servicingFacilities": data.servicingFacilities,
            "coordinates": areas?.map((x => { return x.x + "|" + x.y + "|" + x.width + "|" + x.height })).join(","),
            "groupname":data.groupname,
            "spaceImage": data.spaceImage,
            // "workweekdays": "workweekdays",
            // "startTime": "startTime",
            // "endTime": "endTime",
            // "resources": "resources",
            // "role": null
        }
        let response: ApiResponse;
        if (props?.spaceDetails?.spaceId) {
            request.SpaceId = props?.spaceDetails?.spaceId;
            response = await SpaceService.updateSpace(props?.spaceDetails?.spaceId, request)
        }
        else{
            request.autoAccept = true;
            response = await SpaceService.createSpace(request)
        }
        if (response.statusCode == 200)
            props.afterSubmit();

    }

    return (
        <div className="col-10 col-md-12 col-lg-10 col-xl-8">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-10 card">
                    <div className="card-body p-0" >
                        <div className="row" style={{ height: "80vh" }}>
                            <RoomLeftPanel addSpace={props.addSpace} space={space} floorDetails={props.floorDetails} areas={areas} onAreaChange={setAreaData} ></RoomLeftPanel>
                            <RoomRightPanel   {...props} areas={areas} onAreaDelete={onDeleteArea} afterSubmit={onSubmitData} ></RoomRightPanel>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AddRoom;
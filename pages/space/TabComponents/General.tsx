import { useEffect } from 'react';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import SystemManagement from "/assets/icons/systemmanagement.svg";
import Space from "../../../models/spacemgmt/space";
import ParkingIcon from "/assets/icons/parkingcar.svg";
import RoomIcon from "/assets/icons/bookRoom.svg";
import DeskIcon from "/assets/icons/bookDesk.svg";

type GeneralProps = { spaceDetails: Space }

const General = ({ spaceDetails }: GeneralProps) => {

    useEffect(() => {
        //debugger;
        var sd = spaceDetails;
    }, []);


    return (
        <div className="main-class-general">
            <div className="py-6 px-9" style={{ backgroundColor: "rgb(224, 255, 255)", height: "100px" }}>
                <div className="col-4 h-12 w-12 rounded-full relative float-left" style={{ backgroundColor: "#1565c0" }}>
                    <span className="relative top-3 left-3 font-bold text-white">MR</span>
                    <div className="h-3.5 w-3.5 rounded-full relative bottom-6 left-9" style={{ backgroundColor: "green" }}></div>
                </div>
                <div className="col-6 grid float-left pl-4">
                    <span className="font-bold text-md">{spaceDetails?.spaceAliasName}</span>
                    <span className="text-xs">{spaceDetails?.organization?.orgName}, {spaceDetails?.organization?.buildingName}</span>
                </div>
                <div className="col-2 float-right">
                    <Button>
                        <EditIcon></EditIcon>
                    </Button>
                </div>
            </div>

            <div className="py-2 px-12" style={{ borderBottom: "1px solid #ccc" }}>
                <div className="mt-3 flex">
                    <i
                        className="pi pi-map-marker"
                        style={{
                            fontSize: "1.7em",
                            color: "#1565c0",
                            marginTop: "5px",
                        }}
                    ></i>
                    <span className="py-1.5 px-2.5">{spaceDetails?.building?.groupName}</span>
                </div>

            </div>

            <div className="py-2 px-12" style={{ borderBottom: "1px solid #ccc" }}>
                <div className="mt-3">
                    <Grid container spacing={3}>
                        <Grid xs={1}>
                            <SystemManagement />
                        </Grid>
                        <Grid xs={3}>
                            <Typography variant="body2">{spaceDetails?.floorName}</Typography>
                        </Grid>

                        <Grid xs={1}>
                            <SystemManagement />
                        </Grid>
                        <Grid xs={3}>
                            <Typography variant="body2">6</Typography>
                        </Grid>

                        <Grid xs={1}>
                            {(() => {
                                if (spaceDetails?.spaceType == 'Room') {
                                    return <RoomIcon/>;
                                }else if (spaceDetails?.spaceType == 'Parking') {
                                    return <ParkingIcon/>;
                                } else {
                                    return <DeskIcon/>;
                                }
                            })()}
                        </Grid>
                        <Grid xs={3}>
                            <Typography variant="body2">{spaceDetails?.spaceType}</Typography>
                        </Grid>

                    </Grid>
                </div>
            </div>
            <div className="block" style={{ backgroundColor: "#ccc", width: "100%" }}>
                <div>
                    <div className="flex flex-row" style={{ backgroundColor: "#fff", padding: "20px" }} >
                        <div className="basis-3/4">
                            <h1>TESLA</h1>

                            <div>
                                <h3>Marketing Meeting</h3>
                                <div className="flex">
                                    <img src={"/assets/images/userprofile.png"} alt="" className="rounded-md" width="30" height="30" />
                                    <span>Stephen Gerrard</span>
                                </div>
                            </div>
                        </div>

                        <div className="basis-1/2">
                            <h2>Upcoming Events</h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

}
export default General;
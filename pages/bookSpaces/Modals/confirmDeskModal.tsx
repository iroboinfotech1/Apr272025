import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import { Button ,Stack} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Router from "next/router";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";

const ConfirmDeskModal = (props: any) => {

    const [AddParticipantDisplay, setAddParticipantDisplay] = useState(false);
    const [AddParticipant,setAddParticipant]=useState("");
    const onBookDeskClick = () => {
        (!AddParticipantDisplay || AddParticipant.length==0) ?setAddParticipantDisplay(true):Router.push("/bookSpaces/bookDesk/bookDeskForm");
    }

    return (
        <div>
            <div className="text-sm mt-4 px-2 md:px-2">
                <Card className='rounded-md' sx={{ width: 500 }}>
                    <div className="float-left p-3.5">
                        <img src={"/assets/images/userprofile.png"} alt="" className="rounded-md outline outline-1 ring-blue-500" width="100" height="60" />
                    </div>
                    <CardContent className="">
                        <div>
                            <Typography className='mb-0' gutterBottom variant="h6" component="div">Desk 02
                            </Typography>
                        </div>
                        <div>
                            <Grid container spacing={1}>
                                <Grid xs={7}>
                                    <Typography variant="body2" className="pl-0">6th Floor,smart City, UK</Typography>
                                </Grid>
                                <Grid xs={1}>
                                    <SystemManagement />
                                </Grid>
                                <Grid xs={1}>
                                    <span>2</span>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="pt-5">
                            <Grid container spacing={2}>
                                <Grid xs={1}>
                                    <SystemManagement />
                                </Grid>
                                {/* <Grid xs={4}>
                                <Typography variant="body2">Jan 20,2022</Typography>
                            </Grid> */}
                                <Grid xs={1}>
                                    <SystemManagement />
                                </Grid>
                                {/* <Grid xs={6}>
                                <Typography variant="body2">10.00 AM - 11.00 AM</Typography>
                            </Grid> */}
                            </Grid>
                        </div>
                    </CardContent>
                </Card>
                <div>
                    <div style={!AddParticipantDisplay?{display:'block'}:{display:'none'}}>
                    January 1,2024 - wednesday<br></br>
                    <span style={{fontSize: "14px", color:"green"}}>Available Full Day</span>
                    <br></br>
                    <br></br>
                    <br></br>
                    </div>
                    <TextField
                id="addPartipant"
                label="Add Participant"
                variant="outlined"
                style={AddParticipantDisplay?{display:'block'}:{display:'none'}}
                onChange={(e) => setAddParticipant(e.target.value)}
              />
                </div>
                
                
            </div>
            <br></br>
            <div className="text-sm">
              <Stack direction="row" spacing={5}>
                <Button variant="outlined" className="flex-1 w-64" onClick={() => onBookDeskClick()}>{AddParticipant?"Add":"Continue"}</Button>
                <Button variant="outlined" className="flex-1 w-64">Cancel</Button>
              </Stack>
            </div>
        </div>
    );
};
export default ConfirmDeskModal;
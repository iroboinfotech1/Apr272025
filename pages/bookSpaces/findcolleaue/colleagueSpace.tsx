import Layout from "../../../components/Layout";
import Card from "@mui/material/Card";
import Image from "next/image";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CalendarIcon from "/assets/icons/calendarIcon.svg";
import { useRouter } from "next/router";
import DialogModal from "../../../components/common/dialogModal";
import { useState } from "react";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import AdminApps from "/assets/icons/admin.svg";
import SpaceManagement from "/assets/icons/spacemanagement.svg";


const ColleagueSpace = () => {
    const [isSlotOpen, setIsSlotOpen] = useState(false);
    const router = useRouter();
    const { query } = router;
    const roomimage = '/assets/images/room.png';
    return (
        <Layout>
            <div className="flex justify-between sm:block sm:px-16 mt-4 px-16 md:px-2 justify-evenly">
                <Card sx={{ maxWidth: 500 }} className="shadow-none bg-transparent flex items-center flex-grow">
                    <Image
                        src="/assets/images/userprofile.png"
                        alt=""
                        className="float-left md:float-none sm:float-none lg:float-none"
                        width="60"
                        height="60"
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            className="text-base"
                        >
                            {query.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="text-xs"
                        >
                            {query.email}
                        </Typography>
                    </CardContent>
                </Card>
                <div className="flex flex-grow">
                    <Card sx={{ maxWidth: 345 }} className="shadow-none bg-transparent flex items-center">
                        <CalendarIcon />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" className="text-xs text-text-light">Date</Typography>
                            <Typography gutterBottom variant="h3" className="text-xs text-text-bold">August 10</Typography>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <br></br>
            <hr></hr>
            <div style={{backgroundImage: `url(${roomimage})`}} className={`basis-9/12 bg-contain bg-no-repeat border my-3 aspect-[16/10] rounded-md relative`}>
                <button className="desk-red-dot" onClick={() => {
                    setIsSlotOpen(true);
                }}></button>
            </div>
            <DialogModal
                open={isSlotOpen}
                onClose={() => {
                    setIsSlotOpen(false);
                }}
                modalTitle="">
                <div className="min-w-[300px]">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/assets/images/userprofile.png"
                            alt=""
                            className="rounded-md outline outline-1 ring-blue-500"
                            width="60"
                            height="60"
                        />
                        <div>
                            <Typography
                                className="mb-0"
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                Desk 02
                            </Typography>
                            <Typography
                                className="mb-0"
                                gutterBottom
                                variant="caption"
                                component="div"
                            >
                                6th Floor, Smartcity, UK
                            </Typography>
                            <div className="flex gap-3 w-full pb-4">
                                <SystemManagement />
                                <AdminApps />
                                <SpaceManagement />
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="flex justify-between pt-4 flex-col">
                        <Typography variant="caption" className="pl-0">
                            September 10, 2022 - Monday
                        </Typography>
                        <Typography variant="caption" className="pl-0" color="#dc2020">
                            John Allyster - Occupied till 6 PM
                        </Typography>
                    </div>

                </div >
            </DialogModal>
        </Layout>

    )
}

export default ColleagueSpace;
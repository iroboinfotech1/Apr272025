import Layout from "../../../components/Layout";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Router from "next/router";

import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";

import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import roomData from "../data/bookRoomData.json";

import SystemManagement from "/assets/icons/systemmanagement.svg";
import AdminApps from "/assets/icons/admin.svg";
import SpaceManagement from "/assets/icons/spacemanagement.svg";
import CalendarIcon from "/assets/icons/dashboard card icons/calendaricon.svg";

import SelectParkingSlotModal from "../Modals/selectParkingSlotModal";
import DialogModal from "../../../components/common/dialogModal";
import { useEffect, useState } from "react";
import ParkingService from "../../../services/parking.service";
import Image from "next/image";
import BookParking from "../../../assets/icons/parkingcar.svg";
import {
  flowFlagState,
  searchBookRoomState,
  selectedCardDetailState,
  selectedDeskState,
  selectedParkingSlotState,
  selectedRoomState,
  bookMeetingFormState,
} from "../../_app";
import { useRecoilState } from "recoil";
import {
  IBookParking,
  IParkingDetail,
  IParkingSlot,
  ISpaceResource,
} from "../types/bookSpace";
import {
  getBookedParkingsByMeetingId,
  updateParking,
} from "../../../services/bookSpace.service";
import BookSpaceFloorViewer from "../compponents/BookSpaceFloorViewer";
import dayjs from "dayjs";
import { spaceResourceConfig } from "../../../src/constants/spaceManagement/config";
import UsermanagementService from "../../../services/usermanagement.service";

const ParkingView = () => {
  const [isSlotOpen, setIsSlotOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<string>();
  const [parkingDetail, setParkingDetail] = useState<IParkingDetail>(
    {} as IParkingDetail
  );
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedParkingSlot, setSelectedParkingSlot] = useRecoilState(
    selectedParkingSlotState
  );
  const [flowFlag, setFlowFlag] = useRecoilState(flowFlagState);
  const [selectedRoomDetails, setSelectedRoomDetails] =
    useRecoilState(selectedRoomState);
  const [searchBookingState, setSearchBookingState] =
    useRecoilState(searchBookRoomState);
  const [selectedDesk, setSelectedDesk] = useRecoilState(selectedDeskState);
  const [selectedCardDetail, setSelectedCardDetail] = useRecoilState(
    selectedCardDetailState
  );
  const [meetingFormDetails, setMeetingFormDetails] =
      useRecoilState(bookMeetingFormState);
  const [loader, setLoader] = useState<boolean>(false);
  const [userList,setUserList]=useState<any[]>([]);

  const onBookParkingClick = () => {
    if (flowFlag.isFlowFromBookSpace) {
      Router.push("/bookSpaces/bookroom/bookMeetingForm");
    } else if (flowFlag.isFlowFromBookDesk) {
      Router.push("/bookSpaces/bookDesk/bookDeskForm");
    } else if (flowFlag.isFlowFromManageVisitor) {
      Router.push("/bookSpaces/ManageVisitor");
    } else {
      updateParkingSlots();
    }
  };

  const updateParkingSlots = () => {
    selectedParkingSlot
      .filter(
        (parkingSlot: IBookParking) =>
          parkingSlot.parkingId === undefined || parkingSlot.parkingId === null
      )
      .forEach(async (parkingSlot: IBookParking) => {
        await updateParking({
          ...parkingSlot,
          meetingId: selectedCardDetail.meetingId,
        });
      });
    setSelectedParkingSlot([]);
    Router.push("/bookSpaces/bookParking/confirmParking");
  };

  useEffect(() => {
    ParkingService.getParkingSlots().then((res) => {
      setParkingDetail(res);
    });
    if (selectedCardDetail.meetingId) {
      fetchBookedParkings(selectedCardDetail.meetingId);
    }
  }, [selectedCardDetail]);

  const fetchBookedParkings = async (meetingId) => {
    const bookedParkings = await getBookedParkingsByMeetingId(meetingId);
    setSelectedParkingSlot(bookedParkings);
  };

 
  async function fetchMyApi() {
    setLoader(true);
    var response = await UsermanagementService.getuserlist();
    console.log("UsermanagementService addUser", response);
    if (response?.data != null) {
      let userListTemp: any[] = [];
      response.data.forEach((userItem: any) => {
        var user: any = { 'userId': userItem.userId, 'userNameEmailId': userItem.userName}
        userListTemp.push(user);
      });
      setUserList(userListTemp);
    }
    setLoader(false);
    console.log("UsermanagementService-getuserlist", response);
  }

  useEffect(() => {
    fetchMyApi();
  }, []);

  const getAvailableParticipants = () =>{
    const parkingAllotedParticipantName = selectedParkingSlot?.map(x => x?.participantName);
    return meetingFormDetails?.participants?.filter(p => parkingAllotedParticipantName?.indexOf(p) == -1 );
  }

  const handleAddParkingClick = (
    slot,
    selectedParticipantId,
    selectedParticipantName,
    vechicleNumber
  ) => { 
    let _savedSlot: IBookParking = {
      slotName: slot,
      slotId: slot.split("-")[1],
      participantId: selectedParticipantId,
      participantName: selectedParticipantName,
      vechicleNumber: vechicleNumber,
    };
    const updatedSavedSlots = [...selectedParkingSlot, _savedSlot];
    setSelectedParkingSlot(updatedSavedSlots);
    // if (!flowFlag.isFlowFromBookSpace) {
    //   ParkingService.saveSlot(slot);
    // }
 let updatedParkingDetails: IParkingDetail = {
      ...parkingDetail,
    };
    if (
      updatedParkingDetails &&
      updatedParkingDetails?.floorDetails &&
      updatedParkingDetails?.floorDetails.length > 0 &&
      updatedParkingDetails?.floorDetails[selectedFloor] &&
      updatedParkingDetails?.floorDetails[selectedFloor].parkingSlots &&
      updatedParkingDetails?.floorDetails[selectedFloor].parkingSlots.length > 0
    ) {
      const updatedParkingSlots = updatedParkingDetails?.floorDetails[
        selectedFloor
      ].parkingSlots.map((slot: IParkingSlot) => {
        const updatedSlot = { ...slot };
        if (slot.id === selectedID) {
          updatedSlot.isAvailable = false;
        }
        return updatedSlot;
      });
      updatedParkingDetails.floorDetails[selectedFloor].parkingSlots =
        updatedParkingSlots;
      setParkingDetail(updatedParkingDetails);
    }    setIsSlotOpen(false);
  };
  return (
    <Layout>
      <div className="flex justify-between sm:block sm:px-16 mt-4 px-16 md:px-2">
        <div className="col-md-6 flex md-flex-wrap justify-between">
          <Card sx={{ maxWidth: 500 }} className="shadow-none bg-transparent">
            <Image
              src={
                (selectedCardDetail && selectedCardDetail.buildingName
                  ? selectedCardDetail.image
                  : selectedRoomDetails && selectedRoomDetails.length > 0
                  ? selectedRoomDetails[0].organisationImage
                  : selectedDesk && selectedDesk.organisationImage) ||
                "/assets/images/userprofile.png"
              }
              alt=""
              className="float-left md:float-none sm:float-none lg:float-none"
              width="100"
              height="60"
            />
            <CardContent className="float-right">
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="text-base"
              >
                {selectedCardDetail && selectedCardDetail.buildingName
                  ? selectedCardDetail.buildingName
                  : selectedRoomDetails && selectedRoomDetails.length > 0
                  ? selectedRoomDetails[0].buildingName
                  : selectedDesk && selectedDesk.buildingName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-xs"
              >
                {selectedCardDetail && selectedCardDetail.buildingName
                  ? selectedCardDetail.buildingName
                  : selectedRoomDetails && selectedRoomDetails.length > 0
                  ? selectedRoomDetails[0].address
                  : selectedDesk && selectedDesk.address}
              </Typography>
              {selectedRoomDetails && selectedRoomDetails.length > 0 && (
                <div
                  className="pt-3"
                  style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
                >
                  {spaceResourceConfig
                    .filter((spaceResource) => {
                      return selectedRoomDetails[0].spaceResources?.some(
                        (meetingSpaceResource: ISpaceResource) =>
                          meetingSpaceResource.resourceId ===
                          spaceResource.resourceId
                      );
                    })
                    .map((spaceResource, index: number) => (
                      <div key={index}>{spaceResource.resourceIcon}</div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-md-6 lg:flex md:flex flex justify-end items-end sm:block">
          <div className="flex justify-between items-end md-flex-wrap md:block sm:block lg:block">
            <div className="px-4">
              <Card
                sx={{ maxWidth: 345 }}
                className="shadow-none bg-transparent h-20"
              >
                <div className="float-left pt-5 pl-1.5">
                  <CalendarIcon />
                </div>
                <CardContent className="float-right sm:float-none sm:pl-12 p-3">
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="text-xs text-text-light"
                  >
                    Start Date & Start Time
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="text-xs font-bold"
                  >
                    {selectedCardDetail.startDate
                      ? selectedCardDetail.startDate
                      : selectedRoomDetails &&
                        selectedRoomDetails.length > 0 &&
                        selectedRoomDetails[0]?.startDate
                      ? dayjs(selectedRoomDetails[0]?.startDate).format(
                          "MMMM DD hh:mm A"
                        )
                      : dayjs(searchBookingState.startDate).format(
                          "MMMM DD hh:mm A"
                        )}
                    {/* <span className="px-1">5.30 PM</span> */}
                  </Typography>
                </CardContent>
              </Card>
            </div>

            <div className="flex md-flex-wrap md:block sm:block justify-between items-end">
              <div className="px-4">
                <Card
                  sx={{ maxWidth: 345 }}
                  className="shadow-none bg-transparent h-20"
                >
                  <div className="float-left pt-5 pl-1.5">
                    <CalendarIcon />
                  </div>
                  <CardContent className="float-right sm:float-none sm:pl-12 p-3">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="text-xs text-text-light"
                    >
                      End Date & End Time
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="text-xs font-bold"
                    >
                      {selectedCardDetail.endDate
                        ? selectedCardDetail.endDate
                        : selectedRoomDetails &&
                          selectedRoomDetails.length > 0 &&
                          selectedRoomDetails[0].endDate
                        ? dayjs(selectedRoomDetails[0].endDate).format(
                            "MMMM DD hh:mm A"
                          )
                        : dayjs(searchBookingState.endDate).format(
                            "MMMM DD hh:mm A"
                          )}
                      {/* <span className="px-1">5.30 PM</span> */}
                    </Typography>
                    <div className="pt-2"></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <hr></hr>

      <div>
        <FormGroup>
          <FormControl
            sx={{ margin: "20px 20px 0px 0px", width: "200px" }}
            size="small"
          >
            <InputLabel id="locationLabel">select Map</InputLabel>
            <Select
              onChange={(e) => {
                setSelectedFloor(parseInt(e.target.value.toString()));
              }}
              defaultValue={0}
              labelId="locationLabel"
              label="Select Map"
              className="text-sm"
            >
              {parkingDetail?.floorDetails?.map((x, y) => {
                return (
                  <MenuItem key={y} value={y}>
                    {x.floorName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </FormGroup>
        <br></br>
        <div className="row">
         {parkingDetail &&
            parkingDetail?.floorDetails &&
            parkingDetail?.floorDetails[selectedFloor] && (
              <div className="col-7 text-center w-full overflow-x-auto">
                <BookSpaceFloorViewer
                  floorSlots={
                    parkingDetail?.floorDetails[selectedFloor]?.parkingSlots!
                  }
                  selectedSlots={selectedParkingSlot}
                  onSlotClick={(id) => {
                    setIsSlotOpen(true);
                    setSelectedID(id);
                  }}
                  imageSrc={
                    parkingDetail?.floorDetails[selectedFloor]?.imageData!
                  }
                  onImageClick={() => {
                    console.log("Image clicked");
                  }}
                ></BookSpaceFloorViewer>
              </div>
            )}          
            <div className="my-4 gap-4">
            <>
              {selectedParkingSlot.map((x, i) => (
                <Card
                  key={i}
                  className="flex p-4 gap-4 rounded-md w-[50%] md:w-full"
                  onClick={() => {
                    setIsSlotOpen(true);
                    setSelectedID(x.slotName);
                  }}
                >
                <BookParking />
                  <div className="flex flex-column flex-grow">
                  <Typography className="mt-2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {x.slotId}
                    </Typography>
                    <div className="w-full flex justify-between gap-5">       
                      <Typography
                      >
                        {x.participantName}
                      </Typography>
                      <Typography
                      >
                        {x.vechicleNumber}
                      </Typography>
                    </div>
                  </div>
                </Card>
              ))}
             </>
            {selectedParkingSlot.length > 0 ? (
              <div className="w-full flex justify-center mt-4 pb-14">
                <Button
                  variant="contained"
                  onClick={() => onBookParkingClick()}
                >
                  Request
                </Button>
                </div>
            ) : null}
          </div>
        </div>
      </div>

      <DialogModal
        open={isSlotOpen}
        onClose={() => {
          setIsSlotOpen(false);
        }}
        modalTitle=""
      >
        <SelectParkingSlotModal
          selectedSlot={selectedID}
          onClose={() => {
            setIsSlotOpen(false);
          }}
          addClick={handleAddParkingClick}
          isManageVisitorFlow={flowFlag.isFlowFromManageVisitor}
          participants = {getAvailableParticipants()}
        ></SelectParkingSlotModal>
      </DialogModal>
    </Layout>
  );
};

export default ParkingView;

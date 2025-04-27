import { Card, CardContent, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Layout from "../../../components/Layout";
import {
  bookMeetingFormState,
  searchBookRoomState,
  selectedBookingDetails,
  selectedMeetingServiceState,
  selectedParkingSlotState,
  selectedRoomState,
} from "../../_app";
import {
  IAvailableSpaceDetail,
  IBookMeetingForm,
  IBookParking,
  IBookedSpaceResource,
  IMeetingService,
  IParkingDetail,
  ISearchBookingRoom, 
  ISpace,
  ISpaceResource,
} from "../types/bookSpace";
import Calendaricon from "/assets/icons/dashboard card icons/calendaricon.svg";
import SystemManagement from "/assets/icons/systemmanagement.svg";
import DefaultSpaceImage from "../../../assets/images/DefaultSpaceImage.png";
import {
  getBookedParkingsByMeetingId,
  getBookedServicesByMeetingId,
  getSpaceBySpaceId,
} from "../../../services/bookSpace.service";
import BookParking from "../../../assets/icons/parkingcar.svg";
import { services,  spaceResourceConfig} from "../../../src/constants/spaceManagement/config";
import TagIcon from "@mui/icons-material/Tag";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Groups2Icon from "@mui/icons-material/Groups2";
import cardImage from '../../../assets/images/cardImage.jpeg';
import moment from "moment";
import Router from "next/router";

const BookingDetails = () => {
  const bookingMeetingDetail = useRecoilValue(selectedBookingDetails);
const [searchBookRoom, setSearchBookingState] =
    useRecoilState(searchBookRoomState);
  const [selectedRoomDetails, setSelectedRoomDetails] =
    useRecoilState(selectedRoomState);
  const [selectedMeetingServices, setSelectedMeetingServices] = useRecoilState(
    selectedMeetingServiceState
  );
  const [selectedParkingSlot, setSelectedParkingSlot] = useRecoilState(
    selectedParkingSlotState
  );
  const [meetingFormDetails, setMeetingFormDetails] =
    useRecoilState(bookMeetingFormState);  
  const [parkingDetails, setParkingDetails] = useState<IBookParking[]>([]);
  
  const [meetingServices, setMeetingServices] = useState<{
    [serviceId: number]: IMeetingService;
  }>({} as { [key: string]: IMeetingService });

  useEffect(() => {
    const getParkingDetails = async () => {
      const parkingDetails = await getBookedParkingsByMeetingId(
        bookingMeetingDetail.meetingId
      );
      setSelectedParkingSlot(parkingDetails);
      setParkingDetails(parkingDetails);
    };
    const getServicesDetails = async () => {
      const serviceDetails = await getBookedServicesByMeetingId(
        bookingMeetingDetail.meetingId
      );
      setSelectedMeetingServices(serviceDetails);
      let _servicesMap: { [key: string]: IMeetingService } = {} as {
        [key: string]: IMeetingService;
      };
      serviceDetails.forEach(
        (serviceDetail: IMeetingService, index: number) => {
          _servicesMap[serviceDetail.serviceId] = serviceDetail;
        }
      );
      setMeetingServices(_servicesMap);
    };
    getParkingDetails();
    getServicesDetails();
  }, [
    bookingMeetingDetail,
    setSelectedMeetingServices,
    setSelectedParkingSlot,
  ]);
const onEditClick = async () => {
    const spaceDetails: ISpace = await getSpaceBySpaceId(
      bookingMeetingDetail.spaceId
    );
    const selectedRoom = {
      allDays:
        dayjs(bookingMeetingDetail.endDate).diff(
          dayjs(bookingMeetingDetail.startDate),
          "minutes"
        ) === 540
          ? true
          : false,
      attendies: bookingMeetingDetail.noOfAttendees,
      startDate: bookingMeetingDetail.startDate,
      endDate: bookingMeetingDetail.endDate,
      buildingId: spaceDetails.floorId.toString(),
      floorId: spaceDetails.floorId.toString(),
      orgId: spaceDetails.orgId.toString(),
      reminder: 1,
      space_type_id: 0,
    } as ISearchBookingRoom;
    const selectedRoomDetails = {
      buildingId: spaceDetails.buildingId,
      coordinates: spaceDetails.coordinates,
      endDate: bookingMeetingDetail.endDate,
      floorId: spaceDetails.floorId,
      floorName: bookingMeetingDetail.floorName,
      orgId: spaceDetails.orgId,
      spaceId: bookingMeetingDetail.spaceId,
      spaceName: bookingMeetingDetail.spaceName,
      startDate: bookingMeetingDetail.startDate,
      spaceType: "Room",
      buildingName: bookingMeetingDetail.buildingName,
      address: bookingMeetingDetail.address,
      isAvailable: true,
      resourceId: 0,
      resourceIcon: "",
      facilityId: 0,
      facilityName: "",
      spaceResources: [],
      floorImage: "",
      resourceCount: 0,
      isEditMode: true,
    } as IAvailableSpaceDetail;
    setSearchBookingState(selectedRoom);
    setSelectedRoomDetails([selectedRoomDetails]);
    Router.push("/bookSpaces/bookroom/bookMeetingForm");
  };

  return (
    <Layout>
      <div className="flex pb-4 flex-wrap gap-3">
        <div className=" sm:w-full w-2/4">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight="bold"
          >
              {bookingMeetingDetail &&
            bookingMeetingDetail.meetingName &&
            bookingMeetingDetail.meetingName !== ""
              ? bookingMeetingDetail.meetingName
              : "Desk"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="text-xs"
          >
            {bookingMeetingDetail &&
              `${bookingMeetingDetail.floorName} ${bookingMeetingDetail.buildingName}`}
          </Typography>
        </div>
        <div className="flex gap-8 sm:w-full md:w-2/4">
          <div className="flex gap-3">
            <Calendaricon />
            <div>
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
                {bookingMeetingDetail &&
                  bookingMeetingDetail.startDate &&
                  dayjs(bookingMeetingDetail.startDate).format(
                    "MMMM DD hh:mm A"
                  )}
              </Typography>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendaricon />
            <div>
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
                {bookingMeetingDetail &&
                  bookingMeetingDetail.endDate &&
                  dayjs(bookingMeetingDetail.endDate).format("MMMM DD hh:mm A")}
              </Typography>
            </div>
          </div>
           <div>
            <Button variant="contained" color="primary" onClick={onEditClick}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div className="p-6">
        <div className="flex gap-3">
          <Image
            src={bookingMeetingDetail!=null && bookingMeetingDetail.spaceImage !=null ? bookingMeetingDetail.spaceImage :cardImage}
            alt=""
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
              {bookingMeetingDetail.spaceName}
            </Typography>
            <div>
              {bookingMeetingDetail && (
                <div
                  className="pt-3"
                  style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                 {spaceResourceConfig
                  .filter((spaceResource) =>
                    bookingMeetingDetail.spaceResources?.some(
                      (meetingSpaceResource: IBookedSpaceResource) =>
                        meetingSpaceResource.resourceId === spaceResource.resourceId
                    )
                  )
                  .map((spaceResource, index: number) => (
                    <div key={index}>{spaceResource.resourceIcon}</div>
                  ))}
                </div>
              )}            
              </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column mt-8 ms-4">
        <div className="sm:flex-col flex mb-6">
          <div className="sm:w-full w-2/4">
            <div className="flex gap-6 py-4">
              <div>
                <TagIcon style={{ color: "#7fd3f4" }} />
              </div>

              <Typography
                gutterBottom
                variant="h3"
                className="text-xs text-text-bold"
              >{`BRID${(100000 + bookingMeetingDetail.meetingId)
                .toString()
                .substring(1, 6)}`}</Typography>
            </div>

            <div className="flex gap-6 py-4">
              <div>
                <LocationOnIcon style={{ color: "#7fd3f4" }} />
              </div>

              <Typography
                gutterBottom
                variant="h3"
                className="text-xs text-text-bold"
              >{`${bookingMeetingDetail.floorName}, ${bookingMeetingDetail.address}`}</Typography>
            </div>

            <div className="flex gap-6 py-4">
              <div>
                <Groups2Icon style={{ color: "#7fd3f4" }} />
              </div>
              <Typography
                gutterBottom
                variant="h3"
                className="text-xs text-text-bold"
              >
                <List>
                  {bookingMeetingDetail.participants?.map((participants: any, idx: any) => (
                    <ListItem key={idx}>
                        <ListItemText primary={participants}/>
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </div>

            <div className="flex gap-6 py-4">
              <div>
                <Image
                  src={"/assets/images/Present_Icon.png"}
                  alt=""
                  width="18"
                  height="10"
                />
              </div>
              <Typography
                gutterBottom
                variant="h3"
                className="text-xs text-text-bold"
              >
                {bookingMeetingDetail.notes}
              </Typography>
            </div>
          </div>
          <div className="sm:w-full w-2/4">
            <Typography gutterBottom component="div" className="fs-5">
              Parking
            </Typography>
            {parkingDetails.map((x, i) => (
              <Card
                key={i}
                className="rounded-md"
                sx={{
                  width: "500px",
                  display: "flex",
                  padding: "12px",
                  gap: "1rem",
                }}
              >
                <div>
                  <BookParking />
                </div>
                <div className="d-flex flex-column flex-wrap align-content-start w-1000">
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    marginTop={"10px"}
                    align="left"
                  >
                    {`Slot - ${x.slotId}`}
                  </Typography>
                  <div className="d-flex justify-content-between">
                    <Typography
                      sx={{ alignContent: "left" }}
                      marginTop={"5px"}
                      align="center"
                      className="me-5"
                    >
                      {x.participantName}
                    </Typography>
                    <Typography
                      sx={{ fontWeight: "normal", alignContent: "left" }}
                      marginTop={"5px"}
                      align="center"
                    >
                      {x.vechicleNumber}
                    </Typography>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="mb-16">
          <Typography gutterBottom component="div" className="fs-5">
            Services
          </Typography>
          <div className="d-flex flex-row mt-3">
            {services
              .filter((service) =>
                Object.keys(meetingServices ?? {}).includes(service.serviceId.toString())
              )
              .map((service, index: number) => {
                return (
                  <div className="d-flex flex-row me-5" key={index}>
                    <div className="me-3">
                      <Image
                        src={service.serviceIcon}
                        alt={""}
                        className="float-left md:float-none sm:float-none lg:float-none"
                        width="30"
                        height="30"
                      />
                    </div>
                    <Typography
                      gutterBottom
                      component="div"
                      className="fs-6 mt-1"
                    >
                      {`${
                        meetingServices[service.serviceId].serviceCount
                      }     ${service.serviceName}`}
                    </Typography>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetails;

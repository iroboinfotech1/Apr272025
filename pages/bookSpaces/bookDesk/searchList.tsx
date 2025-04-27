import Layout from "../../../components/Layout";
import CardComponent from "../compponents/CardComponent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { Button, Stack } from "@mui/material";
import FloorViewer from "../compponents/FloorViewer";
import SpaceService from "../../../services/space.service";
import SearchResult, {
  Result,
} from "../../../models/spacemgmt/Desk/SearchResult";
import SpaceContext, {
  initializeDataType,
} from "../../../context/BookDeskContext";
import ConfirmDeskModal from "../Modals/confirmDeskModal";
import DialogModal from "../../../components/common/dialogModal";
import {
  bookMeetingFormState,
  bookRoomState,
  searchBookRoomState,
  selectedDeskState,
  selectedMeetingServiceState,
  selectedParkingSlotState,
  selectedRoomState,
} from "../../_app";
import { useRecoilState } from "recoil";
import {
  IAvailableFloorDetail,
  IAvailableSpaceDetail,
  IBookParking,
  IDesk,
  IMeetingService,
  ISpaceResource,
} from "../types/bookSpace";
import {
  getAvailableDesk,
  getSpaceBySearchCriteria,
} from "../../../services/bookSpace.service";
import Router from "next/router";
import BookSpaceFloorViewer from "../compponents/BookSpaceFloorViewer";
import { spaceResourcesDictionary } from "../../../src/constants/spaceManagement/config";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const BookDesk = () => {
  const [valueTab, setValueTab] = React.useState(0);
  const [searchResult, setSearchResult] = useState<{
    [key: string]: IAvailableFloorDetail;
  } | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [selectedSelectedSpacecoordinates, setselectedSelectedSpacecoordinates] = useState<string>("");
  const spaceContextValue = React.useContext(SpaceContext);
  const [selectedDeskDetails, setSelectedDeskDetails] =
    useRecoilState(selectedDeskState);
  const [value, setValue] = React.useState<Dayjs | null>(
    spaceContextValue.bookDeskInfo.startDate
  );
  const [isServiceOpen, setIsServiceOpen] = React.useState(false);
  const [meetingFormState, setMeetingFormState] =
    useRecoilState(bookMeetingFormState);
  const [selectedParking, setSelectedParking] = useRecoilState(
    selectedParkingSlotState
  );
  const [selectedServices, setSelectedServices] = useRecoilState(
    selectedMeetingServiceState
  );
  const [searchBookingState, setSearchBookingState] =
    useRecoilState(searchBookRoomState);

  const fetchAvailableDeskDetails = useCallback(async () => {
      const deskDetails: IAvailableSpaceDetail[] = await getAvailableDesk(searchBookingState);
      let normalizedSpaceDetails: { [key: string]: IAvailableFloorDetail } = {};
      deskDetails.forEach((spaceDetail: IAvailableSpaceDetail) => {
        if (
          normalizedSpaceDetails[spaceDetail.floorId] === undefined ||
          normalizedSpaceDetails[spaceDetail.floorId] === null
        ) {
          normalizedSpaceDetails[spaceDetail.floorId] = {} as any;
          normalizedSpaceDetails[spaceDetail.floorId].floorId =
            spaceDetail.floorId;
          normalizedSpaceDetails[spaceDetail.floorId].floorName =
            spaceDetail.floorName;
          normalizedSpaceDetails[spaceDetail.floorId].floorImage =
            spaceDetail.floorImage;
            normalizedSpaceDetails[spaceDetail.floorId].availableSpaceDetails =
            {} as { [key: string]: IAvailableSpaceDetail };
          checkAndAddSpaceToFloor(
            normalizedSpaceDetails[spaceDetail.floorId],
            spaceDetail
          );
          return;
        }
        checkAndAddSpaceToFloor(
          normalizedSpaceDetails[spaceDetail.floorId],
          spaceDetail
        );
      });
      setSearchResult(normalizedSpaceDetails);
      if (Object.keys(normalizedSpaceDetails).length > 0) {
        setSelectedFloorId(Object.keys(normalizedSpaceDetails)[0]);
      }
      setselectedSelectedSpacecoordinates("");
    }, [searchBookingState]);

  useEffect(() => {
    fetchAvailableDeskDetails();
  }, [fetchAvailableDeskDetails]);

  const checkAndAddSpaceToFloor = (
      normalizedFloorSpaceDetail: IAvailableFloorDetail,
      spaceDetail: IAvailableSpaceDetail
    ) => {
      if (
        normalizedFloorSpaceDetail.availableSpaceDetails[
          spaceDetail.spaceName
        ] === undefined ||
        normalizedFloorSpaceDetail.availableSpaceDetails[
          spaceDetail.spaceName
        ] === null
      ) {
        normalizedFloorSpaceDetail.availableSpaceDetails[spaceDetail.spaceName] =
          {} as IAvailableSpaceDetail;
        normalizedFloorSpaceDetail.availableSpaceDetails[spaceDetail.spaceName] =
          {
            ...spaceDetail,
            spaceResources: [
              {
                facilityId: 515,
                facilityName: "Chair",
                resourceIcon: spaceDetail.resourceIcon,
                resourceId: 520,
                resourceCount: 1,
              } as ISpaceResource,
            ],
          };
        return;
      }
      normalizedFloorSpaceDetail.availableSpaceDetails[
        spaceDetail.spaceName
      ].spaceResources?.push({
        facilityId: spaceDetail.facilityId,
        facilityName: spaceDetail.facilityName,
        resourceIcon: spaceDetail.resourceIcon,
        resourceId: spaceDetail.resourceId,
        resourceCount: spaceDetail.resourceCount,
      } as ISpaceResource);
    };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
    if(newValue==0){
      setselectedSelectedSpacecoordinates("");
    }
  };

  const OnSearch = () => {
    fetchAvailableDeskDetails();
  };

  const onBookMeetClick = () => {
    Router.push("/bookSpaces/bookDesk/bookDeskForm");
  };

  const handleRoomSelection = (roomDetails: IAvailableSpaceDetail) => {
    setSelectedDeskDetails(roomDetails);
    setMeetingFormState({
      allDays: false,
      meetingName: "",
      meetingType: 0,
      notes: "",
      participants: [],
      referenceNumber: "",
      reminder: 0,
    });
    setSelectedParking([] as IBookParking[]);
    setSelectedServices([] as IMeetingService[]);
    setselectedSelectedSpacecoordinates(roomDetails.coordinates);
  };

  return (
    <Layout>
      <div>
        <h2 className="text-xl font-bold">Book Desk</h2>
        <span style={{ fontSize: "12px", color: "#a5a0a0" }}>
          {" "}
          Check availabilty{" "}
        </span>
      </div>
      <FormGroup>
        <div className="text-sm py-8 mt-4 px-4 md:px-2">
          <div className="flex flex-row gap-4 md:flex-col items-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl sx={{ m: 1, minWidth: 140 }} size="small" className="md:w-full">
                <DateTimePicker
                  className="text-sm"
                  renderInput={(props) => <TextField {...props} />}
                  label="Start Date & Start Time"
                  value={searchBookingState.startDate}
                  onChange={(newValue) => {
                    setSearchBookingState({
                      ...searchBookingState,
                      startDate: newValue,
                    });
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 140 }} size="small" className="md:w-full">
                <DateTimePicker
                  className="text-sm"
                  renderInput={(props) => <TextField {...props} />}
                  label="End Date & End Time"
                  value={searchBookingState.endDate}
                  onChange={(newValue) => {
                    setSearchBookingState({
                      ...searchBookingState,
                      endDate: newValue,
                    });
                  }}
                />
              </FormControl>
            </LocalizationProvider>
            <Stack direction="row" className="h-14 md:w-full">
              <Button
                variant="contained"
                className="md:w-full"
                onClick={OnSearch}
              >
                Search
              </Button>
            </Stack>
          </div>
        </div>
      </FormGroup>
      <div className="listMapView">
        <div>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueTab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="List View" {...a11yProps(0)} />
                <Tab label="Map View" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <div className="py-2.5">
              <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
                <InputLabel id="selectMapLabel">Select Map</InputLabel>
                <Select
                  labelId="reminderLabel"
                  label="Select Map"
                  onChange={(e: SelectChangeEvent<string>) => {
                    setSelectedFloorId(e.target.value);
                  }}
                  value={selectedFloorId}
                >
                  {searchResult &&
                    Object.keys(searchResult).map(
                      (floor: string, index: number) => {
                        return (
                          <MenuItem
                            key={searchResult[floor].floorId}
                            value={searchResult[floor].floorId}
                            selected={index === 0}
                          >
                            {searchResult[floor].floorName}
                          </MenuItem>
                        );
                      }
                    )}                
                    </Select>
              </FormControl>
              <div className="float-right">
                <span className="text-md font-medium text-text-light">
                About{" "}
                  {(searchResult &&
                    searchResult[selectedFloorId] &&
                    searchResult[selectedFloorId].availableSpaceDetails &&
                    Object.keys(
                      searchResult[selectedFloorId].availableSpaceDetails
                    ).length) ||
                    0}{" "}
                  result(s)
                </span>
              </div>
            </div>
            <div>
              <TabPanel value={valueTab} index={0}>
                <div className="flex flex-wrap">
                  {searchResult &&
                    searchResult[selectedFloorId] &&
                    searchResult[selectedFloorId].availableSpaceDetails &&
                    Object.keys(
                      searchResult[selectedFloorId].availableSpaceDetails
                    ).map((x: string) => {
                      if (
                        searchResult[selectedFloorId].availableSpaceDetails[x]
                          .isAvailable &&
                        searchResult[selectedFloorId].availableSpaceDetails[
                          x
                        ].spaceResources?.some(
                          (resource: ISpaceResource) =>
                            resource.resourceId ===
                              spaceResourcesDictionary.Chair &&
                            resource.resourceCount >=
                              searchBookingState.attendies
                        )
                      ) {
                        return (
                          <CardComponent
                            key={
                              searchResult[selectedFloorId]
                                .availableSpaceDetails[x].spaceId
                            }
                            roomDetails={
                              searchResult[selectedFloorId]
                                .availableSpaceDetails[x]
                            }
                            isCheckBox={true}
                            handleChecked={handleRoomSelection}
                          />
                        );
                      }
                    })}
                </div>

                <div className="flex justify-end md:justify-center w-full mt-6 pb-8">
                  <Button
                    className="mb-10"
                    variant="contained"
                    onClick={() => {
                      onBookMeetClick();
                    }}
                  >
                    Book Desk
                  </Button>
                </div>
              </TabPanel>
              <TabPanel value={valueTab} index={1}>
                <BookSpaceFloorViewer
                  imageSrc={
                    searchResult &&
                    searchResult[selectedFloorId] &&searchResult[selectedFloorId]?.floorImage
                      ? searchResult[selectedFloorId].floorImage
                      : ""
                  }
                  coordinates = {selectedSelectedSpacecoordinates}
                  floorSlots={[]}
                  onSlotClick={function (slotId: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  selectedSlots={[]}
                  onImageClick = {() => onBookMeetClick()}
                ></BookSpaceFloorViewer>
              </TabPanel>
            </div>
          </Box>
        </div>
      </div>
      <DialogModal
        open={isServiceOpen}
        onClose={() => {
          setIsServiceOpen(false);
        }}
        modalTitle=""
      >
        <ConfirmDeskModal
          onClose={() => {
            setIsServiceOpen(false);
          }}
        ></ConfirmDeskModal>
      </DialogModal>
    </Layout>
  );
};
export default BookDesk;

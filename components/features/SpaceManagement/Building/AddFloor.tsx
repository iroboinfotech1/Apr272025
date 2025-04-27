import { Box, IconButton, Modal } from '@mui/material';
import { Edit, ViewArray, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddFloorItem from "./AddFloorItem";
import BuildingService from "../../../../services/building.service";
import Link from '@mui/material/Link';
import Button from "@mui/material/Button";

import DeleteAlert from "../../../../components/common/deleteAlert";
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const AddFloor = ({ onSubmitData , buildingData}: any) => {

    const [loader, setLoader] = useState<boolean>(true);
    const [floorItems, setFloorItems] = useState<any>([]);
    const [existingFloors, setExistingFloors] = useState<any>([]);
    const [building, setBuildingData] = useState(buildingData);
    const [open, setOpen] = useState(false);
    const [isChildModalOpen, setChildModalOpen] = useState(false);
    const [selectedFloorItem, setSelectedFloorItem] = useState<any>(null);
    const [deleteFloorId, setDeleteFloorId] = useState<any>(null);

    const handleOpen = (item) => {
        setSelectedFloorItem(item);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setSelectedFloorItem(null);
      };
    
    useEffect(() => {

        fetchMyApi();

    }, [building]);


    async function fetchMyApi() {
        if (building?.buildingId) {
            const response = await BuildingService.GetFloorByBuilding(building?.buildingId);
            if (response.status === true) {
                setExistingFloors(response.data);
            }
        }
    }

    const onAddFile = (data: any) => {
        floorItems.push(data);
        setFloorItems(floorItems);
    }

    const getBase64 = (file: any, floor : any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            updateFloorPlan({ ...floor, floorPlan: reader.result });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const [floors, setFloors] = useState<any[]>([<AddFloorItem onAddFile={onAddFile} key={new Date().getTime()}></AddFloorItem>]);

    const onAddBtnClick = () => {
        setFloors(floors.concat(<AddFloorItem onAddFile={onAddFile} key={new Date().getTime()}></AddFloorItem>));
    };

    const handleImageChange = (event, floor) => {
        const file = event.target.files[0];
        if (file) {
            getBase64(file, floor);
        }
    };

    async function openDeleteFloorPlanDialog(id: any) {
        setChildModalOpen(true);
        setDeleteFloorId(id);
    }

    async function deleteFloorPlan(id: any) {
        try {
            setLoader(true);
            var result = await BuildingService.deleteFloorByFloorId(id);
            console.log("delete result" + result);
            if (result.status == true) {
                await fetchMyApi();
            }

        } catch (error) {
            console.log(error);
            setLoader(false);
        }
        setLoader(false);
    }

    async function updateFloorPlan(floor: any) {
        try {
            setLoader(true);
            var result = await BuildingService.updateFloorPlan(floor);
            console.log("update result" + result);
            if (result.status == true) {
                await fetchMyApi();
            }

        } catch (error) {
            console.log(error);
            setLoader(false);
        }
        setLoader(false);
    }

    return (
        <div className="p-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 margin-auto">
                    {
                        existingFloors.map((floorItem) => {
                            return (
                              <div className="row border-bottom align-items-center" key={floorItem.floorId}>
                                <div className="col-6">{floorItem.floorName}</div>
                                <div className="col-2">
                                  <IconButton
                                    key={floorItem.floorId}
                                    onClick={() => handleOpen(floorItem)}
                                    sx={{ p: 0, m: 0 }}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </div>
                                <div className="col-2">
                                  <input
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id={`icon-button-file-${floorItem.floorId}`}
                                    type="file"
                                    onChange={(event) => handleImageChange(event, floorItem)}
                                  />
                                  <label htmlFor={`icon-button-file-${floorItem.floorId}`}>
                                    <IconButton color="secondary" sx={{ p: 0, m: 0 }} aria-label="upload picture" component="span">
                                      <Edit></Edit>
                                    </IconButton>
                                  </label>
                                </div>
                                <div className="col-2">
                                  <IconButton
                                    onClick={() => openDeleteFloorPlanDialog(floorItem.floorId)}
                                    color="error"
                                    sx={{ p: 0, m: 0 }}
                                  >
                                    <DeleteIcon></DeleteIcon>
                                  </IconButton>
                                </div>
                              </div>
                            );
                        })
                    }
                    <Modal open={open} onClose={handleClose}
                        aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box sx={style}>
                            <h2 id="modal-title">{selectedFloorItem?.floorName + " Floor Plan"}</h2>
                            <img src={selectedFloorItem?.floorPlan} alt='my image' style={{ width: '100%' }} />
                        </Box>
                    </Modal>
                    <Modal open={isChildModalOpen} 
                        aria-labelledby="child-modal-title" aria-describedby="child-modal-description">
                        <Box sx={{ ...style }}>
                            <DeleteAlert close={() => setChildModalOpen(false)} onDelete={() => deleteFloorPlan(deleteFloorId)}></DeleteAlert>
                        </Box>
                    </Modal>
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-12 col-md-10">
                    {
                        [...floors]
                    }
                </div>
                <div className="col-12 mt-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col">
                            <hr className="m-0" style={{ position: "relative", top: "50%" }} />
                        </div>
                        <div className="col">
                            <Button size="small" onClick={onAddBtnClick}>
                                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                                <span className="ms-2">Add More</span>
                            </Button>
                        </div>
                        <div className="col">
                            <hr className="m-0" style={{ position: "relative", top: "50%" }} />
                        </div>
                    </div>

                </div>
                <div className="col-12 text-center mt-5">
                    <Button variant="contained" onClick={(e) => {
                        onSubmitData(floorItems)
                    }} >Submit</Button>
                </div>
            </div>
        </div>
    );
}

export default AddFloor;
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import { useContext } from 'react';
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import DeleteAlert from "../../../../components/common/deleteAlert";
import ModalService from "../../../lib/modalPopup/services/ModalService";
import { PlayerContext } from '../../../../pages/player';
//import { playerListColumn } from './gridMockData';
import PlayerManagementService from "../../../../services/player.service";
import PlayerList from "../../../../models/player/PlayerList";
import Router from 'next/router';
import AddUpdatePlayer from '../grid-view/AddUpdatePlayer';
import CreateBuilding from "../../SpaceManagement/Building/CreateBuilding";
import {RecoilRoot, atom, useRecoilValue, useRecoilState } from "recoil";
import {playerSearchTextAtom} from "../search-field/index";
import { PlayerCardInfoAtom } from '../PlayerDeviceInfo';

export const playerDataAtom = atom<PlayerList[]>({
  key: "playerData",
  default: [],
});

export const EditPlayerAtom = atom({
  key: "EditPlayerId",
  default: '',
});

const PlayerData = (props: any) => {

  const playerListColumn = [
    { field: 'status', headerName: '', width: 130 , hide: true },
    { field: 'serialNumber', headerName: 'Serial No.', width: 130 },
    { field: 'deviceName', headerName: 'Device Name', width: 130 },
    { field: 'ipAddress', headerName: 'IP Address', width: 90 },
    { field: 'department', headerName: 'Department', width: 160 },
    { field: 'locationName', headerName: 'Location', width: 160 },
    { field: 'contactPerson', headerName: 'Contact Person', width: 160 },
    {
      field: "deleteButton",
      headerName: "Actions",
      description: "Actions column.",
      sortable: false,
      width: 160,
      renderCell: (params: any) => {
        return (
          <div className="flex">
            <Button>
              <EditIcon  onClick={(e) => editPlayer(e, params.row)} ></EditIcon>
            </Button>
            <Button onClick={(e) => deletePlayer(e, params.row)} color="error" >
              <DeleteIcon></DeleteIcon>
            </Button>
          </div>
        );
      }
    }
  ];

  const [selectedSerialNumber,setSelectedSerialNumber]=useState<String>("");

  const [playerListData, setPlayer] = useState<PlayerList[]>([]);
  const [playerData, setPlayerData] = useRecoilState(playerDataAtom);
  const [editPlayerId, setEditPlayerId] = useRecoilState(EditPlayerAtom);
  const [playerCardInfo, setPlayerCardInfo] = useRecoilState(PlayerCardInfoAtom);
  const [loader, setLoader] = useState<boolean>(false);
  const searchTxt = useRecoilValue(playerSearchTextAtom).toLowerCase();
  const playerDataFilter = (playerData || [])
        .filter(row => searchTxt ? (row.deviceName.toLowerCase().includes(searchTxt) || row.serialNumber.toLowerCase().includes(searchTxt)  || row.locationName.toLowerCase().includes(searchTxt)) : row);
  useEffect(() => {
      fetchMyApi();
      const urlParams = new URLSearchParams(window.location.search).get('openModal');;
      if (urlParams == "true")
          openModel(AddUpdatePlayer, { "submittedCallback": fetchMyApi })
  }, []);

  async function fetchMyApi() {
      setLoader(true);
      var response = await PlayerManagementService.getPlayerList();
      var playerSensitiveResponse = await PlayerManagementService.getPlayerSensitiveInformation("10001");
      console.log(playerSensitiveResponse);
      console.log("PlayerManagementService getPlayerList", response);
      console.log(contextData);
      if (response.status == true) {
        //setPlayer(response.data);
        setPlayerData(response.data);
        if(response.data){
          const cardInfo = {
            total : response.data.length,
            active : response.data.length,
            critical : response.data.length,
            incidents : response.data.length,
          }
          setPlayerCardInfo(cardInfo);
        }
      }
      setLoader(false);
  }

  const contextData: any = useContext(PlayerContext);
  const doSometing = (row) => {
    //console.log(row.id);
    contextData.setSelectedSerialNumber(row.id);
    contextData.setOpenPlayerDetailTab(true);
    console.log('man');
    console.log(playerData);
    
  }

  const openAddPlayerModel = () => {
    contextData.setOpenAddPlayerTab(true);
    //openModel(AddUpdatePlayer, { "submittedCallback": fetchMyApi })
  }

  const openModel = (component: any, props?: any) => {
    console.log("open clicked");
    ModalService.open(component, props);
  };

  function editPlayer (e :any, row: PlayerList) {
    e.stopPropagation();
    //debugger;
    setEditPlayerId(row.serialNumber);
    contextData.setOpenAddPlayerTab(true);
  }

  async function deletePlayer (e :any, row: PlayerList) {
    e.stopPropagation();
    //debugger;
    // openModel(DeleteAlert, {
    //     "onDelete": async () => {
    //         setLoader(true);
    //         var result = await PlayerManagementService.deletePlayer(row.serialNumber);
    //         console.log("delete result" + result);
    //         if (result.status == true) { 
    //             await fetchMyApi();
    //         }
    //         setLoader(false);
    //     }
    // });
    setLoader(true);
    var result = await PlayerManagementService.deletePlayer(row.serialNumber);
    console.log("delete result" + result);
    if (result.status == true) {
        await fetchMyApi();
    }
    setLoader(false);
  }

  const isRowSelectable = (params):boolean => {
    if(props.playerId){
      return params.row.serialNumber === props.playerId;
    }
    return false
   
  };

  return (
    <>
    {
      loader == true ?
      <div className="text-center">Loading Data...</div> :
      <div>
        {
            <div className='col-12'>
                    <div className="row mb-3">
                        <div className="col-12 text-right">
                            <div className="mt-5">
                                <Button variant="contained" type="submit" onClick={() => openAddPlayerModel() }>Add a Device</Button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12" style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={playerDataFilter}
                            columns={playerListColumn}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection={true}
                            isRowSelectable={isRowSelectable}
                            onRowClick={(row)=>doSometing(row)}
                            getRowId={(row) => row.serialNumber}
                          />
                        </div>
                    </div>
                </div>
        }
      </div>
    }
    </>
  );
}


export default PlayerData;
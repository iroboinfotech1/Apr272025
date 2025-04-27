import * as React from "react";
import {DataGrid, GridCellParams, GridColDef, GridValueGetterParams, gridClasses } from "@mui/x-data-grid";
import Layout from "../../../components/Layout";
import Button from "../../../components/common/Button";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import PlayListService from "../../../services/playlist.service";
import PlayList from "../../../models/PlayList/PlayList";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Stack, TextField } from "@mui/material";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
let breadcrumbPaths = [{ name: "Home", path: "/" },{ name: "Playlist Management", path: "/playlist" }];
import Router, {useRouter} from 'next/router';
import DeleteAlert from "../../../components/common/deleteAlert";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalService from "../../../components/lib/modalPopup/services/ModalService";
import axios from "axios";
import * as Constants from '../../../common/constants';
import * as InputValidationUtils from '../../../common/inputValidationUtils';

export default function DataTable() {

  const router = useRouter()
  const {name} = router.query
  const [loader, setLoader] = React.useState<boolean>(false);
  const [playlist, setPlaylist] = React.useState<PlayList[]>([]);
  const [playlistId, setPlaylistId] = React.useState<string>();
  const [dragging, setDragging] = React.useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files: FileList) => {
    if(files!.length > 0){
      var index= playlist.length + 1;
      for (var i=0;i<files.length;i++) {
        var file = files[i];
        var imageType = /image.*/;
        var videoType = /video.*/;
        if (file.type.match(imageType) || file.type.match(videoType)){
          loadedFiles(file,i + index);
        }
      } 
    }    
  };

  const loadedFiles = (file: File, i : any) => {
    let fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      var imageType = /image.*/;
      var videoType = /video.*/;
      if (file.type.match(imageType)){
        uploadMedia(fileReader.result,file.name, i,'image');
      }else if (file.type.match(videoType)){
        uploadMedia(fileReader.result,file.name, i,'video');
      }
    } 
  };

  const uploadMedia = (result : any,fileName: string, i : any, mediaType: string ) => {

    var media:PlayList = {
      index : 0,
      id : i.toString(),
      playListName : playlistId!.toString(),
      mediaName : fileName,
      mediaType : mediaType,
      thumbnail : result,
      durationType : Constants.PLAYLIST_DEFAULT_PLAY_DURATION_TYPE,
      playDuration : Constants.PLAYLIST_DEFAULT_PLAY_DURATION ,
      volume : Constants.PLAYLIST_DEFAULT_PLAY_VOLUME,
      duration : {  full: null, part: Constants.PLAYLIST_DEFAULT_PLAY_DURATION},
      actionInd: 'A'
    }
    setPlaylist(current => [...current, media]);
  }

  const handleDurationTypeChange = (event,index) => {
    var durationType =  (event.target as HTMLInputElement).value;
    const newPlayList = [...playlist];
    newPlayList[index].durationType = durationType;
    newPlayList[index].playDuration = '00:10';
    newPlayList[index].actionInd = 'M';
    setPlaylist(newPlayList);
  };

  const handlePlayDurationChange = (event,index) => {
    var durationValue =  (event.target as HTMLInputElement).value;
    if(InputValidationUtils.isValidPlayDuration(durationValue)){
      const newPlayList = [...playlist];
      newPlayList[index].playDuration = durationValue;
      newPlayList[index].duration.part = durationValue;
      newPlayList[index].actionInd = 'M';
      setPlaylist(newPlayList);
    }
};

const handleVolumeChange = (event,index) => {
  var volume =  (event.target as HTMLInputElement).value;
    const newPlayList = [...playlist];
    newPlayList[index].volume = volume;
    newPlayList[index].actionInd = 'M';
    setPlaylist(newPlayList);
};

  React.useEffect(() => {
    let nameQuery = '';
    if(name){
      nameQuery = name.toString();
      setPlaylistId(nameQuery);
    }
    fetchMyApi(nameQuery);
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Thumbnail",
      width: 140,
      headerClassName: "hideRightSeparator",
      renderCell: (params: GridCellParams) => {
        return params.row.type === "video" ? (
			  <video className="w-[100px] aspect-video rounded-md" src={params.row.image} controls />
        ) : (
			  <img className="w-[100px] aspect-video rounded-md" src={params.row.image} ></img>
        );
      },
    },
  
    { field: "mediaName", headerName: "Media Name", minWidth: 150, flex: 1,     headerClassName: "hideRightSeparator",
  },
    {
      field: "lastName",
      headerName: "Duration",
      minWidth: 250,
      flex: 1,
      sortable: false,
      headerClassName: "hideRightSeparator",
      renderCell: (params: GridCellParams,) => {
        return params.row.type === "image" ? (
          <> <label>{params.row.duration.part}</label> </>
        ) : (
          <>
            <div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group" onChange={(event) => handleDurationTypeChange(event,params.row.index) }
                defaultValue={params.row.durationType === 'part' ? "part" : "full"}
              >
                <FormControlLabel value="full" control={<Radio />} 
                  label={`Play to End`} 
                  // label={`Play to End (${ params.row.durationType === 'full' ? params.row.duration.full  : ""})`} 
                  />
                <FormControlLabel value="part" control={<Radio />}  
                  label="Play Duration"/>
              </RadioGroup>
            </FormControl>
            </div>
            <div style={{ marginTop: '40px'}}>{
                params.row.durationType === 'part' ? (
                <TextField fullWidth variant="outlined" className="pk-input"  
                value={params.row.duration.part}
                defaultValue={'00:60'}
                inputProps={{ style: {height: "10px",width: "40px"},}}
                onChange={(event) => handlePlayDurationChange(event,params.row.index)}
                /> ) : <></>
              }
            </div>    
          </>    
        );
      },
    },
    {
      field: "volume",
      headerName: "Volume",
      minWidth: 300,
      flex: 1,
      headerClassName: "hideRightSeparator",
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params: GridCellParams) =>
        params.row.type !== "image" ? (
          <Box sx={{ width: 200 }}>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <VolumeDown />
                <Slider aria-label="Volume" value={ params.row.volume} onChange={(event) => handleVolumeChange(event,params.row.index)}/>
              <VolumeUp />
            </Stack>
          </Box>
        ) : (
          <></>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 50,
      flex: 1,
      headerClassName: "hideRightSeparator",
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params: GridCellParams) => (
          <div className="flex">
            <Button onClick={(e) => deleteMedia(e, params.row)} color="error" >
              <DeleteIcon></DeleteIcon>
            </Button>
          </div>
        ),
    },
  ];
  
  const generateRows = (params: any) => {
    return params.map((data,index) => {
      return {
        index: index,
        image: data.thumbnail,
        type: data.mediaType,
        id: data.id,
        mediaName: data.mediaName,
        duration: data.duration,
        durationType: data.durationType,
        volume: data.volume
      };
    });
  };

  async function fetchMyApi(name: string) {
    setLoader(true);
    var response = await PlayListService.getPlayListItems(name); 
    if (response.status == true) {
        setPlaylist(response.data);
    }
    setLoader(false);
  }

  const openModel = (component: any, props?: any) => {
    ModalService.open(component, props);
  };

  async function deleteMedia(e :any, row: PlayList) {
    var pItem = playlist.find( p => p.id == row.id);
    if(pItem && pItem.actionInd == "A"){
      setPlaylist(playlist.filter( p => p.id != pItem?.id));
    }else{
      var result = await PlayListService.deletePlayListItem(row.id);
      if (result.status == true) {
          await fetchMyApi(playlistId!.toString());
      }
    }
  }

  function addMedia(){
    Router.push({pathname:'/playlist/Add', query: { id: playlistId }})
  };

  async function updatePlayList(){
    setLoader(true);
    var formData = new FormData();
    formData["playlist"] = playlist;
    var response = await PlayListService.updatePlayList(playlist);  
    if (response.status == true) {
        fetchMyApi(playlistId!.toString());
    }
    setLoader(false);
  };

  
 
  const rows = generateRows(playlist);
  return (
    <Layout>
      <div className="flex justify-between items-center m-6">
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <Breadcrumbs
            currentPage={"Playlist Editor"}
            routes={breadcrumbPaths}
          />
        </div>
      </div>
      {loader ? <div>Loading... </div> :
        <div>
          <div className="flex justify-between items-center m-6 font-italic-bold">Drag & Drop files to the below playlist</div>
          <div style={{height: '500px'}}
          className={`media-dropzone ${dragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          > 
          <DataGrid
            sx={{
                [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                  outline: 'none',
                },
                [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                  {
                    outline: 'none',
                  },
                  '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                    display: 'none',
                  },
              }}
            rows={rows}
            columns={columns}
            className={"m-6"}
            rowHeight={100}
            disableSelectionOnClick
            initialState={{
              pagination: {
                pageSize:5
              },
            }}
            checkboxSelection
          />
          </div>
          <div className="flex justify-between items-center m-6">
                <Button  variant="contained" type="submit" onClick={() => updatePlayList() }>Save Changes</Button>
          </div>
        </div>
      }
    </Layout>
  );
}

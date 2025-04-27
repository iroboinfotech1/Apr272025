import React, { useState, useMemo, useEffect} from "react";
import { useForm } from "react-hook-form";
import Layout from "../../../components/Layout";
import Button from "../../../components/common/Button";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import PlayListService from "../../../services/playlist.service";
import ApiResponse from "../../../models/ApiResponse";
import PlayList from "../../../models/PlayList/PlayList";
import { InputLabel, Select, FormHelperText, TextField, SelectChangeEvent, FormControl, FormControlLabel, 
    Box, FormLabel, Radio, RadioGroup, Slider, Stack, MenuItem } from "@mui/material";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
let breadcrumbPathsAddPlayList = [{ name: "Home", path: "/" },{ name: "Playlist Management", path: "/playlist" }];
// let breadcrumbPathsAddMedia = [{ name: "Home", path: "/" },{ name: "Playlist Management", path: "/playlist" },{ name: "Playlist Editor", path: "/playlist/editor?name=testlist" }];
import Router, {useRouter} from 'next/router';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    playListName: yup.string().required('Playlist name is required'),
    mediaName: yup.string().required('Media is required'),
    thumbnail: yup.string().required('Thumbnail is required'),
  });

type props = {playList?: PlayList};
const AddPlayList = ({playList}:props) => {

    const router = useRouter()
    const {id} = router.query
    const  isAddPlayList = id ? false : true ;
    const [loader, setLoader] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(30);
    const [durationType, setDurationType] = useState('full');
    const [playDuration, setPlayDuration] = useState('10:00');
    const [playlistId, setPlaylistId] = React.useState<string>();
    const [playlistItem, setPlaylistItem] = React.useState<PlayList>();
    let nameQuery = '';
    let breadcrumbPathsAddMedia = [{ name: "Home", path: "/" }
                                ,{ name: "Playlist Management", path: "/playlist" }
                                ,{ name: "Playlist Editor", path: "/playlist/editor?name=" + id?.toString() }];

    const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
        return playList;
        }, [playList])
    });

    React.useEffect(() => {
        if(id){
          nameQuery = id.toString();
          setPlaylistId(nameQuery);
          setValue("playListName", nameQuery);
          
        }
        //fetchMyApi(nameQuery);
      }, []);
    
    async function fetchMyApi(name: string) {
        setLoader(true);
        var response = await PlayListService.getPlayListItems(name); 
        console.log("playlistService getAllPlayLists", response);
        if (response.status == true) {
            setPlaylistItem(response.data[0]);
        }
        setLoader(false);
    }

    const handleChange = (event: SelectChangeEvent) => {
        let roleId = event.target.value ? parseInt(event.target.value) : 0;
        //setRoleId(roleId);
    };

    const onSubmit = async (data: any) => {
        console.log("form data", data);
        var formData: any = {};
        for (var key in data) {
            formData[key] = data[key];
        }
        formData.volume = volume;
        formData.durationType = durationType;
        formData.playDuration = playDuration;

        let response: ApiResponse;
        response = await PlayListService.addPlayList(formData);

        if(response.status == true){
            if(isAddPlayList){
                Router.push('/playlist');
            }
            else{ 
                Router.push({pathname:'/playlist/editor', query: { name: playlistId }})
            }
        }

        console.log("PlayListService addPlayList", response);
    }

    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    const handleDurationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDurationType((event.target as HTMLInputElement).value);
    };

    const handlePlayDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayDuration((event.target as HTMLInputElement).value);
    };

    return(
        <Layout>
            <h2 className="text-xl font-bold"> {isAddPlayList ?  'Add Playlist' : 'Add Media'}</h2>
            <Breadcrumbs currentPage={isAddPlayList ?  'Add Playlist' : 'Add Media'} 
                routes={isAddPlayList ? breadcrumbPathsAddPlayList : breadcrumbPathsAddMedia}/>
            {
                <div className="container">
                    {loader ? <div>Loading... </div> :
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('playListName')} fullWidth label="Playlist Name" variant="outlined" className="pk-input"
                                    error={!!errors.playListName}
                                    helperText={errors.playListName?.message?.toString()}
                                    disabled={isAddPlayList ?  false : true} />
                                </div>
                                <div className="col-12 col-md-4 mt-3">
                                    <TextField {...register('mediaName')} fullWidth label="Media Name" variant="outlined" className="pk-input"
                                    error={!!errors.mediaName}
                                    helperText={errors.mediaName?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-8 mt-3">
                                    <TextField {...register('thumbnail')} fullWidth label="Thumbnail" variant="outlined" className="pk-input"
                                    error={!!errors.thumbnail}
                                    helperText={errors.thumbnail?.message?.toString()}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-8 mt-3">
                                <InputLabel id="demo-simple-select-label">Play Duration</InputLabel>
                                <FormControl fullWidth  >
                                    <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group" defaultValue={"full"}  onChange={handleDurationTypeChange} >
                                        <FormControlLabel value="full" control={<Radio />} label="Play to End" />
                                        <FormControlLabel value="part" control={<Radio />} label="Play Duration" />
                                    </RadioGroup> 
                                </FormControl>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-8 mt-3">
                                <InputLabel id="demo-simple-select-label">Volume</InputLabel>
                                <FormControl fullWidth  >
                                    <Box sx={{ width: 200 }}>
                                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                            <VolumeDown />
                                            <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} />
                                            <VolumeUp />
                                        </Stack>
                                    </Box>
                                </FormControl>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-4">
                                    <Button variant="contained" type="submit">{isAddPlayList ?  'Add Playlist' : 'Add Media'}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    }
                </div>
            }
        </Layout>
    )
}


export default AddPlayList;
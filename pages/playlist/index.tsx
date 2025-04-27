import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Button from "../../components/common/Button";
import PlaylistCard from "../../components/common/PlaylistCard";
import PlayList from "../../models/PlayList/PlayList";
import Layout from "../../components/Layout";
import PlayListService from "../../services/playlist.service";
import Router from 'next/router';
import {RecoilRoot, atom, useRecoilState } from "recoil";
import PlayListManagement from "../playlist";

export const playListDataAtom = atom<PlayList[]>({
  key: "playListData",
  default: [],
});

function Index() {

  let breadcrumbPaths = [{ name: "Home", path: "/" }];

  const [loader, setLoader] = useState<boolean>(false);
  const [ playListData , setPlayListData] = useRecoilState<PlayList[]>(playListDataAtom)

  useEffect(() => {
    fetchMyApi()
  }, [])

  async function fetchMyApi() {
        setLoader(true);
        var response = await PlayListService.getAllPlayLists();
        console.log("playlistService getAllPlayLists", response);
        if (response.status == true) {
          setPlayListData(response.data);
        }
        setLoader(false);
    }




  return (
    
    <>
      <Layout>
        <div className="flex justify-between items-center m-6">
        <div>
          <h2 className="text-xl font-bold">Playlist Management</h2>
          <Breadcrumbs
            currentPage={"Playlist Management"}
            routes={breadcrumbPaths}
          />
          </div>
          <Button variant="contained" type="submit" onClick={() => Router.push('/playlist/Add')}>Add Playlist</Button>
        </div>
        <div className="m-6 flex gap-4 flex-wrap ">
            {playListData.map(data => <PlaylistCard key={data.id} name={data.playListName} id={data.id} image={data.thumbnail}/>) }
        </div>
      </Layout>
    </>
    
  );
}

export default Index;

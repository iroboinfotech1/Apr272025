import { createContext, useState,useEffect } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { PlayerManagement } from "../components/features/PlayerManagement";
import PlayerDetails from "../components/features/PlayerManagement/playerDetails";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import AddUpdatePlayer from '../components/features/PlayerManagement/grid-view/AddUpdatePlayer';
import {RecoilRoot, atom, useRecoilValue, useRecoilState } from "recoil";
import withAuth from '../HOC/withAuth';
export const PlayerContext: any = createContext({
  setopenPlayerDetailTab: () => {},
  playerDetailId: {},
  setPlayerDetailId: () => {},
  setopenAddPlayerTab: () => {},
  setReloadPlayerGrid: () => {},
  selectedSerialNumber: {},
  setSelectedSerialNumber: () => {},
});

const Player = () => {
  const router = useRouter();
  const [playerId, setPlayerId] = useState<any>(null);
  useEffect(() => {
    if(router.query.id){
      setPlayerId(router.query.id)
      console.log("id", router.query.id);
    }

  }, [router.query.id]);
  const [connectorList, setConnectorList] = useState([]);
  const [openPlayerDetailTab, setOpenPlayerDetailTab] = useState(false);
  const [playerDetailId, setPlayerDetailId] = useState({});
  const [openAddPlayerTab, setOpenAddPlayerTab] = useState(false);
  const [reloadPlayerGrid, setReloadPlayerGrid] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<any>(null);
  return (
    <RecoilRoot>
    <Layout>
      <PlayerContext.Provider
        value={{ setOpenPlayerDetailTab, connectorDetailId: playerDetailId, setPlayerDetailId, setOpenAddPlayerTab, setReloadPlayerGrid,selectedSerialNumber, 
          setSelectedSerialNumber,}}
      >
        {openPlayerDetailTab && <PlayerDetails />}
        {openAddPlayerTab && <AddUpdatePlayer />}
        <h2 className="text-xl font-bold">Player Management</h2>
        <Breadcrumbs currentPage={"Player Management"} />
        <PlayerManagement></PlayerManagement>
      </PlayerContext.Provider>
    </Layout>
    </RecoilRoot>
  );
};
export default withAuth(Player);

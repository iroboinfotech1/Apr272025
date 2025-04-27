import React, { useContext } from "react";
//import ConnectorIcon from '../../icons/ConnectorIcon'
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ConnectorContext } from "../../../pages/connector";
import { config } from "../../../services/http-common";
import axios from "axios";
import DeleteAlert from "../../common/deleteAlert";
import { useState } from "react";
import moment from 'moment';
import ModalService from "../../lib/modalPopup/services/ModalService";

function ConnectorList({ data, fetchConnectorList, setConnectStatus }: any) {
  const [loader, setLoader] = useState<boolean>(false);
  const contextData: any = useContext(ConnectorContext);
  const handleClick = () => {
    contextData.setopenConnectorDetailTab(true);
    contextData.setConnectorDetailId(data);
  };
  const handleSettings = () => {
    contextData.setConnectorDetailId(data);
    contextData.setOpenConnectorModal(true);
  };

  const handleDelete = () => {
    openModel(DeleteAlert, {
      onDelete: async () => {
        setLoader(true);
        let url =
          config.connectionManagement.baseURL +
          config.connectionManagement.deleteConnector;
        const reqData = {
          name: data.name,
          orgId: data.id.toString(),
        };
        console.log(reqData);
        const result = await axios.post(url, reqData);
        if (result.status == 200) {
          //await fetchMyApi();
          console.log("Delete Success");
        } else console.log("Delete Failed");
        fetchConnectorList();
        setLoader(false);
      },
    });
  };

  const openModel = (component: any, props?: any) => {
    ModalService.open(component, props);
  };

  return (
    <div className="flex justify-between px-6 py-4 mt-2 items-center border border-gray-800	rounded hover:cursor-pointer">
      <div
        className="flex items-center"
        style={{ width: "25%" }}
        onClick={handleClick}
      >
        <div className="font-extrabold ml-3">{data.name}</div>
      </div>
      <div
        className="h-3.5 w-3.5 rounded-full"
        style={{
          backgroundColor: data.status === "Inactive" ? "grey" : "green", // red for inactive, green for active
        }}
       onClick={handleClick}></div>
      <div className="text-xs opacity-60" onClick={handleClick}>
        last Synched Time {moment(data.modified).format("YY-MM-DD HH:mm")}
      </div>
      <div className="opacity-60">
        <SettingsOutlinedIcon
          sx={{ marginRight: "5px" }}
          onClick={handleSettings}
        />
        <DeleteOutlineOutlinedIcon onClick={handleDelete} />
      </div>
    </div>
  );
}

export default ConnectorList;

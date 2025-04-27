import React, { useState, useEffect, createContext } from "react";
import Layout from "../components/Layout";
import ChooseConnector from "../components/features/ConnectionManagement/ChooseConnector";
import ModalRoot from "../components/lib/modalPopup/components/ModalRoot";
import ModalService from "../components/lib/modalPopup/services/ModalService";
import Button from "../components/common/Button";
import { getConnectorList } from "./api/connectorAPI";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ConnectorList from "../components/features/ConnectionManagement/ConnectorList";
import SearchBar from "../components/common/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import ConnectorDetails from "../components/features/ConnectionManagement/ConnectionDetails/ConnectorDetails";
import axios from "axios";
import { config } from "../services/http-common";
import ConnectorManagementService from "../services/connectorManagement.service";
import ConnectionDetails from "../models/connector/connectionDetails";
import CalendarDetails from "../models/connector/calendarDetails";
import connectorStyle from "../components/features/ConnectionManagement/ConnectionDetails/connector.module.css";
import withAuth from "../HOC/withAuth";

export const ConnectorContext: any = createContext({
  setopenConnectorDetailTab: () => {},
  connectorDetailId: {},
  setConnectorDetailId: () => {},
  setOpenConnectorModal: () => {},
});

const Connector = () => {
  //const [connectorList, setConnectorList] = useState([]);
  const [connectorList, setConnectorList] = useState<ConnectionDetails[]>([]);
  const [openConnectorDetailTab, setopenConnectorDetailTab] = useState(false);
  const [openConnectorModal, setOpenConnectorModal] = useState(false);
  const [connectorDetailId, setConnectorDetailId] = useState({} as any);
  const [selectedConnectorDetail, setSelectedConnectorDetail] =
    useState<ConnectionDetails>({} as ConnectionDetails);
  const [errorOnFetch, setErrorOnFetch] = useState<boolean>(false);

  function onSearch(searchName: any) {
    let searchReqd = searchName != null && searchName.length > 0 ? true : false;
    let url = searchReqd
      ? config.connectionManagement.baseURL +
        config.connectionManagement.GetConnectorByName
      : config.connectionManagement.baseURL +
        config.connectionManagement.GetAllConnectors;
    let reqData = searchReqd ? { params: { name: searchName } } : {};
    const temp: any = [{}];
    axios.get(url, reqData).then((res) => {
      if (res.data != null && res.data.length > 0) setConnectorList(res.data);
      else setConnectorList(temp);
    });
  }

  const fetchConnectorList = () => {
    let url =
      config.connectionManagement.baseURL +
      config.connectionManagement.GetAllConnectors;
    axios
      .get(url)
      .then((res) => {
        setConnectorList(res.data);
      })
      .catch((error) => setErrorOnFetch(true));
  };

  useEffect(() => {
    if(!openConnectorDetailTab) fetchConnectorList();
  }, [openConnectorDetailTab]);

  const setConnectStatus = (id :number, status: string) => {
    const temp = connectorList.map((connector) => {
      if (connector.id === id) {
        connector.status = status;
      }
      return connector;
    }

    );
    setConnectorList(temp);
  }

  useEffect(() => {
    if (openConnectorModal) {
      ConnectorManagementService.getAuditAndLogs(connectorDetailId.name).then(
        (response: ConnectionDetails) => {
          setSelectedConnectorDetail(response);
          ConnectorManagementService.getCalenderFromSource(
            connectorDetailId.name
          ).then((calenderSource: CalendarDetails[]) => {
            const connectorCalendar = calenderSource.filter(
              (calendar: CalendarDetails) =>
                !response.calendars.some(
                  (responseCalendar: CalendarDetails) =>
                    responseCalendar.title === calendar.title
                )
            );
            const connectorResponse =
              response.calendars.concat(connectorCalendar);
              let ofz365ConStr: any | null = null;
              connectorList.map(connector=>{
                  if(connector.id==connectorDetailId.id)
                  {
                    ofz365ConStr = connector.connectionStringOffice365;
                  }
              });
            const modalResponse = {
              connectorName: connectorDetailId.name,
              connectorResponse,
              fetchConnectorList,
              source: connectorDetailId.source,
              selectedCalandar: response.calendars,
              isEditFlow: true,
              ofz365ConStr:ofz365ConStr
            };
            ModalService.open(ChooseConnector, {
              modalResponse,
              close: setOpenConnectorModal(false),
            });
          });
        }
      );
    }
  }, [connectorDetailId, openConnectorModal]);

  const addModal = () => {
    ModalService.open(ChooseConnector, {
      fetchConnectorList,
    });
  };

  return (
    <>
      <Layout>
        <ConnectorContext.Provider
          value={{
            setopenConnectorDetailTab,
            connectorDetailId: connectorDetailId,
            setConnectorDetailId,
            setOpenConnectorModal,
            selectedConnectorDetail,
          }}
        >
          <h2 className="text-xl font-bold">Connector Management</h2>
          <Breadcrumbs currentPage={"Connector Management"} />
          {errorOnFetch ? (
            <div
              className={`flex justify-center items-center h-100 ${connectorStyle.flexDirectionColumn}`}
            >
              <p>
                There was an error processing your request. Please contact your
                System Adminstrator.
              </p>
            </div>
          ) : connectorList.length === 0 ? (
            <div
              className={`flex justify-center items-center h-100 ${connectorStyle.flexDirectionColumn}`}
            >
              <p>No Connectors Found</p>
              <Button
                onClick={() => {
                  addModal();
                }}
              >
                Add a Connector
              </Button>
            </div>
          ) : (
            <div>
              {openConnectorDetailTab && <ConnectorDetails />}
              <div className="flex flex-column py-4 ">
                <div className="flex w-full">
                  <SearchBar onSearch={onSearch} />
                  <button
                    onClick={() => {
                      addModal();
                    }}
                    className={
                      "flex items-center justify-center btn text-primary border border-primary"
                    }
                  >
                    <div className="bg-primary text-white rounded-full p-2 h-5 w-5 mr-3 flex justify-center items-center ">
                      <AddIcon fontSize="small" />
                    </div>
                    Add a Connector
                  </button>
                </div>
                <div
                  className="py-4 overflow-auto"
                  style={{ maxHeight: "68vh" }}
                >
                  {connectorList.map((data, index) => (
                    <ConnectorList
                      key={index}
                      data={data}
                      fetchConnectorList={fetchConnectorList}
                      setConnectStatus={setConnectStatus}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </ConnectorContext.Provider>
      </Layout>
      <ModalRoot />
    </>
  );
};

export default withAuth(Connector);

import React, { useContext } from 'react'
import styles from './connector.module.css'
import { ConnectorContext } from '../../../../pages/connector'
import Tabs from '../../../common/Tabs'
import RoomsandCalendersTab from './RoomsandCalendersTab';
import Settings from './Settings';
import Audit from './Audit';
import Logs from './Logs';

function ConnectorDetails() {
  const { connectorDetailId, setopenConnectorDetailTab }: any = useContext(ConnectorContext)
  const [connectorStatus, setconnectorStatus] = React.useState(connectorDetailId.status);
  const tabsData: any = [
    {
      label: 'Rooms and Calenders',
      component: RoomsandCalendersTab
    },
    {
      label: 'Settings',
      component: Settings,
      props: { connectorStatus, setconnectorStatus }
    },
    {
      label: 'Audit',
      component: Audit,
    },
    {
      label: 'Logs',
      component: Logs,

    },
  ];
  return (

    <div className={styles.connectordetails}>
      <div className="flex justify-between font-bold">
        <h2 className="flex items-center">
          {connectorDetailId.name}{" "}
          {connectorStatus === "Inactive" ? (
            <div className="h-3.5 w-3.5 rounded-full ml-2" style={{ backgroundColor: "grey" }}>
              {" "}
            </div>
          ) : (
            <div className="h-3.5 w-3.5 rounded-full ml-2" style={{ backgroundColor: "rgb(34 197 94)" }} />
          )}
        </h2>
        <button className="opacity-30 ml-auto	" onClick={() => setopenConnectorDetailTab(false)}>
          ✖
        </button>
      </div>
      <div className='text-xs opacity-70'>Data Synched rt{connectorDetailId.lastSyncedTime} ago</div>
      <Tabs tabsData={tabsData} />
    </div>
  )
}

export default ConnectorDetails
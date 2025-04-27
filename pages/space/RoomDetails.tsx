import React, { useContext } from 'react'
import Tabs from '../../components/common/Tabs'
import styles from './RoomDetails.module.css'

import RoomsandCalendersTab from '../../components/features/ConnectionManagement/ConnectionDetails/RoomsandCalendersTab';
import General from './TabComponents/General';
import Resources from './TabComponents/Resources';
import Settings from './TabComponents/Settings';


// import  Tabs  from './Tabs'

const tabsData: any = [
    {
        label: 'General',
        component: General
    },
    {
        label: 'Resources',
        component: Resources
    },
    {
        label: 'Settings',
        component: Settings
    },
    {
        label: 'Calenders',
        component: RoomsandCalendersTab
    },


];

function RoomDetails({ onClose,space }: any) {
    return (

        <div className={styles.roomdetails} style={{height:"100%"}} >
            <div className='flex justify-between font-bold'>
                <h2 className='flex'>Meeting Details</h2>
                <button className="opacity-30 ml-auto	" onClick={(e) => onClose()}>✖</button>

            </div>
            <div className='text-xs opacity-70'>Data Synched rt{34} ago</div>
            <Tabs tabsData={tabsData} spaceDetails = {space} />
        </div>
    )
}

export default RoomDetails
import { useState } from "react";
import Router from 'next/router'
import { DASHBOARD_CARDS_ICON_BASE_PATH, DASHBOARD_FOOTER_ICON_HOME, DASHBOARD_FOOTER_ICON_MYBOOKING, DASHBOARD_FOOTER_ICON_NOTIFICATION, DASHBOARD_FOOTER_ICON_PROFILE } from "../../../common/constants";

const MobileFooterMenu = () => {
    const [active, setActive] = useState('/home')
    const handleClick = (str: string) => {
        setActive(str)
        Router.push(str);
    }
    return (
        <footer className='fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t h-[60px] flex justify-around items-center shadow sm:flex hidden'>
            <button onClick={() => handleClick('/bookSpaces/home')} className='w-[18px] h-[18px] flex flex-col items-center bg-no-repeat bg-contain mt-[-10px]' style={{ backgroundImage: `url(${DASHBOARD_CARDS_ICON_BASE_PATH}${active === '/home' ? DASHBOARD_FOOTER_ICON_HOME : DASHBOARD_FOOTER_ICON_HOME + '_inactive'}.svg)` }}><span className='mt-5 text-[12px]' style={{ color: active === '/bookSpaces/BookRoom' ? '#1a8ef1' : '#191919' }}>Home</span></button>
            <button onClick={() => handleClick('/')} className='w-[18px] h-[18px] flex flex-col items-center bg-no-repeat bg-contain mt-[-10px]' style={{ backgroundImage: `url(${DASHBOARD_CARDS_ICON_BASE_PATH}${active === '/bookSpaces/MyBookings' ? DASHBOARD_FOOTER_ICON_MYBOOKING : DASHBOARD_FOOTER_ICON_MYBOOKING + '_inactive'}.svg)` }}><span className='mt-5 text-[12px]' style={{ color: active === '/bookSpaces/BookDesk' ? '#1a8ef1' : '#191919', whiteSpace: 'nowrap' }}>My Booking</span></button>
            <button onClick={() => handleClick('/bookSpaces/BookParking')} className='w-[18px] h-[18px] flex flex-col items-center bg-no-repeat bg-contain mt-[-10px]' style={{ backgroundImage: `url(${DASHBOARD_CARDS_ICON_BASE_PATH}${active === '/bookSpaces/BookParking' ? DASHBOARD_FOOTER_ICON_NOTIFICATION : DASHBOARD_FOOTER_ICON_NOTIFICATION + '_inactive'}.svg)` }}><span className='mt-5 text-[12px]' style={{ color: active === '/bookSpaces/BookParking' ? '#1a8ef1' : '#191919' }}>Notification</span></button>
            <button onClick={() => handleClick('/user/UserProfile?id=1')} className='w-[18px] h-[18px] flex flex-col items-center bg-no-repeat bg-contain mt-[-10px]' style={{ backgroundImage: `url(${DASHBOARD_CARDS_ICON_BASE_PATH}${active === '/bookSpaces/BookService' ? DASHBOARD_FOOTER_ICON_PROFILE : DASHBOARD_FOOTER_ICON_PROFILE + '_inactive'}.svg)` }}><span className='mt-5 text-[12px]' style={{ color: active === '/bookSpaces/BookService' ? '#1a8ef1' : '#191919' }}>Profile</span></button>
        </footer>
    )
}

export default MobileFooterMenu;
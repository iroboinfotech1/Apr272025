import Router from 'next/router';
import { useState } from 'react';
// import { DASHBOARD_CARDS_ICON_BOOKDESK, DASHBOARD_CARDS_ICON_BOOKPARKING, DASHBOARD_CARDS_ICON_BOOKROOM, DASHBOARD_CARDS_ICON_BOOKSERVICES, DASHBOARD_CARDS_ICON_FINDCOLLEAGUE, DASHBOARD_CARDS_ICON_INSTABOOKING, DASHBOARD_CARDS_ICON_MANAGEVISITOR } from '../common/constants';
import { DASHBOARD_CARDS_ICON_BOOKDESK, DASHBOARD_CARDS_ICON_BOOKPARKING, DASHBOARD_CARDS_ICON_BOOKROOM, DASHBOARD_CARDS_ICON_BOOKSERVICES, DASHBOARD_CARDS_ICON_FINDCOLLEAGUE, DASHBOARD_CARDS_ICON_INSTABOOKING, DASHBOARD_CARDS_ICON_MANAGEVISITOR } from '../../common/constants';
import MobileFooterMenu from './compponents/MobileFooterMenu';
import TileButton from './compponents/TileButton';
// import TileButton from '../components/common/TileButton';

const Home = () => {
    const [active, setActive] = useState('/bookSpaces/BookRoom')
    const handleClick = (str: string) => {
        setActive(str)
        Router.push(str);
    }

    return (
        <div className='p-4 min-w-[330px]'>
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-xl font-bold">Hi John Davis,</h2>
                    <span>Have a great day ahead!</span>
                </div>
                <button className='w-[48px] h-[48px] bg-contain' onClick={() => alert('implement scan functionality')} style={{ backgroundImage: `url(../ui/assets/icons/scan.svg)` }}>
                </button>
            </div>
            <div className='flex flex-wrap justify-between mt-6 mb-[50px] gap-[12px]'>
                <TileButton name='Marketing Meeting' routeUrl='/bookSpaces/bookroom/confirmMeeting' type='statusbar' timeRemaining='15:00' />
                <TileButton name='Instant Booking' routeUrl='/bookSpaces/BookRoom' icon={DASHBOARD_CARDS_ICON_INSTABOOKING} />
                <TileButton name='Book Room' routeUrl='/bookSpaces/BookRoom' icon={DASHBOARD_CARDS_ICON_BOOKROOM} />
                <TileButton name='Book Desk' routeUrl='/bookSpaces/BookDesk' icon={DASHBOARD_CARDS_ICON_BOOKDESK} />
                <TileButton name='Book Parking' routeUrl='/bookSpaces/BookParking' icon={DASHBOARD_CARDS_ICON_BOOKPARKING} />
                <TileButton name='Book Services' routeUrl='/bookSpaces/BookService' icon={DASHBOARD_CARDS_ICON_BOOKSERVICES} />
                <TileButton name='Find Colleague' routeUrl='/bookSpaces/FindColleague' icon={DASHBOARD_CARDS_ICON_FINDCOLLEAGUE} />
                <TileButton name='Manage Visitor' routeUrl='/bookSpaces/ManageVisitor' icon={DASHBOARD_CARDS_ICON_MANAGEVISITOR} />
            </div>
            <MobileFooterMenu />
        </div>

    )
}

export default Home;
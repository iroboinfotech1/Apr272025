//import { Inter } from 'next/font/google'
import MeetingRoomInfo from '../../../components/Player/MeetingRoomInfo'
import MeetingCalenderContainer from '../../../components/Player/MeetingCalenderContainer'
import LowerContainer from '../../../components/Player/LowerContainer'

//const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={`min-h-[700px] h-screen max-h-screen w-screen p-4 box-border bg-cover `} style={{backgroundImage: `url(../assets/images/mainbg.png)`}}>
    <div className={`w-full h-full`}>
        <div id="modal-root"  className={`w-full h-full flex flex-col bg-white/25 rounded-[40px]`}>
            <MeetingRoomInfo info={false} size={'SMALL'}/>
            <LowerContainer />
        </div>
    </div>
</div>
  )
}

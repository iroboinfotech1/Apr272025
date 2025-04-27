import Router from 'next/router'
import { DASHBOARD_CARDS_ICON_BASE_PATH } from '../../../common/constants';

type TileButtonProps = {
    name: string;
    routeUrl: string;
    type?: string;
    icon?: string;
    timeRemaining?: string;
}

const TileButton = (props: TileButtonProps) => {
    const routeTo = (url: string) => {
        Router.push(url);
    }
    return (
        <button onClick={() => routeTo(props.routeUrl)} className="border shadow rounded h-[120px] flex justify-center items-center relative" style={{ width: 'calc(50% - 6px)', overflowX: "visible" }}>
            {props.type === 'statusbar' ?
                <div className='flex flex-col items-start'>
                    <span className='text-sm font-semibold text-[#2e2e2e]'>{props.name}</span>
                    <span className='text-xs text-[#a5a0a0]'>{props.timeRemaining} minutes remaining</span>
                    <div className='flex gap-4 mt-4'>
                        <span className='w-[24px] h-[24px] bg-no-repeat bg-contain' style={{ backgroundImage: `url(../assets/icons/stop_ico.svg)` }}></span>
                        <span className='w-[24px] h-[24px] bg-no-repeat bg-contain' style={{ backgroundImage: `url(../assets/icons/arrow_ico.svg)` }}></span>
                    </div>
                    <div className='absolute left-0 right-0 bottom-0'>
                        <div className='bg-[#ff0000] h-[6px] w-[50%]'></div>
                    </div>
                </div>
                :
                <div className='flex flex-col items-center gap-3'>
                    <span className='w-[40px] h-[40px] bg-no-repeat bg-contain' style={{ backgroundImage: `url(${DASHBOARD_CARDS_ICON_BASE_PATH}${props.icon})` }}></span>
                    <span className='text-sm font-semibold text-[#2e2e2e]'>{props.name}</span>
                </div>
            }
        </button>
    )
}

export default TileButton;
import { DeviceInfoCard } from "../../../common/deviceInfoCard"
import PlayerCardInfo from '../../../../models/player/PlayerCardInfo'
import {atom, useRecoilValue} from 'recoil' 


export const PlayerCardInfoAtom = atom<PlayerCardInfo>({
    key : "PlayerCardInfoAtom",
    default : {total: 0,active: 0,critical: 0,incidents: 0 },
});

export const PlayerDeviceInfo = () => {

    const playerCardInfo = useRecoilValue(PlayerCardInfoAtom);

    return (
        <div className='flex flex-wrap gap-3 justify-evenly mb-4'>
            <DeviceInfoCard color={'blue'} count={playerCardInfo.total} title={'TOTAL DEVICES'} icon={''} />
            <DeviceInfoCard color={'green'} count={playerCardInfo.active} title={'ACTIVE DEVICES'} icon={''} />
            <DeviceInfoCard color={'red'} count={playerCardInfo.critical} title={'CRITICAL DEVICES'} icon={''} />
            <DeviceInfoCard color={'blue'} count={playerCardInfo.incidents} title={'INCIDENTS'} icon={''} />
        </div>
    )
}
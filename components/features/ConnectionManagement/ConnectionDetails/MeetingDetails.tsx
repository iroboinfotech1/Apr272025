import moment from 'moment';
import React from 'react'
import Meeting from '../../../../models/connector/meeting';

const MeetingDetails = (props: any) => {

  const startTime = moment(props.startTime).format('hh:mm A');
  const endTime = moment(props.endTime).format('hh:mm A');
  const endDate = moment(props.endTime).format('DD-MM-YY');
  const endDay = moment(props.endTime).format('dddd');

  return (
    <div className='flex justify-between items-center border-top p-4'>
      <div>
        <div>{startTime} - {endTime} on {endDate}</div>
        <div> {props.summary}</div>
        <div className='opacity-30 text-xs'> John Walker, Fardeen, Diya Stakes, etc...</div>
      </div>
      <div>
        <div> ...</div>
      </div>
    </div>
  )
}

export default MeetingDetails
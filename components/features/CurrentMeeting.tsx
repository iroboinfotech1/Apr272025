import { ArrowForward, ArrowRight, Stop } from "@mui/icons-material";
import { Card, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IMeeting } from "../common/UpcomingMeetingCard";
import dayjs from "dayjs";

const CurrentMeeting = (props: IMeeting) => {
  const { meeting } = props;
  const { startDate, endDate } = meeting;
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = dayjs();
      const endDateTime = dayjs(endDate);
      const startTime = dayjs(startDate);
      const totalMeetingMinutes = -startTime.diff(endDateTime, "minute");
      console.log(totalMeetingMinutes);
      const totalRemainingMinutes = -currentTime.diff(endDateTime, "minute");
      const remainingHours = Math.floor(totalRemainingMinutes / 60);
      const remainingMinutes = (totalRemainingMinutes % 60) + 1;
      setRemainingTime(`${remainingHours}:${remainingMinutes}`);
      const currentProgress =
        ((totalMeetingMinutes - totalRemainingMinutes) / totalMeetingMinutes) *
        100;
      setProgress(currentProgress);
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate, startDate]);
  return (
    <Card className="min-h-[76px] border shadow w-full flex justify-center flex-col p-4 gap-2">
      <h5>Marketing Meeting</h5>
      <div className="flex justify-between w-full gap-2 items-center">
        <span className="text-sm font-light text-gray-500">
          {`${remainingTime} minutes remaining`}
        </span>
        <span className="flex gap-2">
          <button className="btn btn-primary min-h-[24px] min-w-[24px] rounded-full m-0 p-0 flex items-center justify-center">
            <Stop className="text-sm" />
          </button>
          <button className="btn btn-primary min-h-[24px] min-w-[24px] rounded-full m-0 p-0 flex items-center justify-center">
            <ArrowForward className="text-sm" />
          </button>
        </span>
      </div>
      <LinearProgress
        variant="determinate"
        value={progress}
        className="h-[10px] rounded"
        style={{ backgroundColor: "#e5e5e5", color: "EE6E6D" }}
      />
    </Card>
  );
};

export default CurrentMeeting;

import React, { useEffect, useState } from 'react';
import { getWeekdayOrdinalLabel } from "./dayhelper"; 

const RadioButtonGroup = ({ visitDate }: { visitDate: string }) => {
    debugger;
   
    const [selectedOption, setSelectedOption] = useState('option1');
    
    const [labelInfo, setLabelInfo] = useState<{
        label: string;
        day: number;
        month: number;
        year: number;
    }>();

    useEffect(() => {
        debugger;
       console.log("visitDate", visitDate);
       const info = getWeekdayOrdinalLabel(visitDate);
       setLabelInfo(info);
      }, [visitDate]);
      

    return (
        <><div className="flex flex-col space-y-4 pt-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="option1"
          checked={selectedOption === 'option1'}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="form-radio text-blue-600"
        />
        <span className="text-sm text-gray-700">
          {labelInfo ? `On Day ${labelInfo.day}` : "Loading..."}
        </span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="option2"
          checked={selectedOption === 'option2'}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="form-radio text-blue-600"
        />
        <span className="text-sm text-gray-700">
          {labelInfo ? `On the ${labelInfo.label}` : "Loading..."}
        </span>
      </label>
    </div>
    {/* <div>
            {labelInfo && (
                <>
                    <p>{labelInfo.label}</p>
                    <p>Day: {labelInfo.day}</p>
                    <p>Month: {labelInfo.month}</p>
                    <p>Year: {labelInfo.year}</p>
                </>
            )}
        </div>*/}</>  
    );
};

export default RadioButtonGroup;

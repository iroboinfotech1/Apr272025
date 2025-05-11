import { Button, Checkbox, FormControlLabel, MenuItem, Select, TextField,RadioGroup,Radio } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import { useEffect, useState } from 'react';

const SetRecurringModal = (props: any) => {
    const [chooseEndDate, setChooseEndDate] = useState<boolean>(true);
    const [removeEndDate, setRemoveEndDate] = useState<boolean>(false);
    const [visitDate, setVisitDate] = useState<string>(
        moment().format("YYYY-MM-DD hh:mm:ss a")
    );

    const repeatType = ['day', 'week', 'month', 'year'];
    const [settingsSaved, setSettings] = useState<string>('');
    const [workWeekDays, setWorkWeekDays] = useState<String[]>([])
    const weekList = [" MON", " TUE", " WED", " THU", " FRI", " SAT", " SUN"];
    const [selectedRepeatType, setSelectedRepeatType] = useState<string>('day');

    useEffect(() => {
        const arrayWorkWeekDays = settingsSaved?.split(',') ?? [];
        setWorkWeekDays(arrayWorkWeekDays);
    }, [])

    const onSetChooseEndDate = () => {
        setChooseEndDate(false);
        setRemoveEndDate(true);
    };

    const onSetRemoveEndDate = () => {
        setChooseEndDate(true);
        setRemoveEndDate(false);
    };


    return (
        <div className="m-4">
            <div className="mt-2">
                <FormControl
                    size="small"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Start Date"
                            value={visitDate}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setVisitDate(newValue);
                                }
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
            </div>

            <div className='mt-6'>
                <Typography>Repeat Every</Typography>
                <div className='flex sm:flex-col w-full gap-4 justify-between'>
                    <FormControl
                        fullWidth
                        sx={{ margin: "20px 0px 0px 0px" }}
                        size="small"
                        className="min-w-48"
                    >
                        <Select
                            labelId="reminderLabel"
                            className="text-sm"
                            value={1}
                        >
                            {[...Array(99)].map((_, i) => {
                                return (
                                    <MenuItem value={i + 1} key={i + 1}>{i + 1}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl
                        fullWidth
                        sx={{ margin: "20px 0px 0px 0px" }}
                        size="small"
                        className="min-w-48"
                    >
                        <Select
                            labelId="reminderLabel"
                            className="text-sm"
                            value={selectedRepeatType}
                            onChange={(e) => {setSelectedRepeatType(e.target.value);setSettings(`every ${e.target.value}`) }}
                        >
                            {repeatType.map((item: any, i: number) => {
                                return (
                                    <MenuItem value={item} key={item}>{item}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>
            </div>
            {(selectedRepeatType === 'week' || selectedRepeatType === 'day') ? 
            <div className="flex mt-6 flex-wrap">
                {
                    weekList.map((x, i) => {
                        return (
                            <FormControlLabel
                                key={i}
                                control={
                                    <Checkbox value={x}
                                        checked={workWeekDays?.includes(x)}
                                        onChange={(e) => {
                                            let workWeek = workWeekDays ?? [];
                                            if (e.target.checked)
                                                workWeek.push(e.target.value);
                                            else
                                                workWeek.splice(workWeek.indexOf(e.target.value), 1);
                                            setSettings(workWeek?.toString());
                                        }} />
                                }
                                label={x}
                                labelPlacement="bottom"
                            />
                        )
                    })
                }
            </div>:null}
            {(selectedRepeatType === 'month' || selectedRepeatType === 'year') ? 
            <div>
            <div className="flex mt-1 flex-wrap">
                    <div className="py-4">
                        <RadioGroup className="flex justify-between sm:flex-col" row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            //defaultValue=''
                            name="row-radio-buttons-group"
                            //value=''
                            //onChange={(e) => handleValueChange(e.target.value, question)}
                        >
                           <FormControlLabel key={0}
                                    value="10"
                                    control={<Radio />}
                                    label={selectedRepeatType === 'month'?"On day 10":"On May 10"}
                                /> 
                                <FormControlLabel key={0}
                                    value="saturday"
                                    control={<Radio />}
                                    label={selectedRepeatType === 'month'?"On the second Saturday":"On the second Saturday of May"}
                                /> 
                        </RadioGroup>
                    </div>
            </div>
            </div>:null}
            <div className="my-2 flex gap-2 items-center mb-4">
                <span style={{ fontSize: "12px", color: "#a5a0a0" }}>Occurs every {settingsSaved.slice(1)} {removeEndDate && 'until'}</span>
                {chooseEndDate && <Button className="normal-case p-0 m-0" size="small" onClick={() => onSetChooseEndDate()}>Choose an end date</Button>}
            </div>
            {removeEndDate && <div className="flex gap-2 items-center">
                <FormControl
                    size="small"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date"
                            renderInput={(props) => <TextField {...props} />}
                            value={visitDate}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setVisitDate(newValue);
                                }
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
                {removeEndDate && <Button className="normal-case p-0 m-0" size="small" onClick={() => onSetRemoveEndDate()}>Remove end date</Button>}
            </div>}

            <div className="flex sm:flex-col gap-4 mt-8">
                <Button variant="contained" className="flex-1">
                    Save
                </Button>
                <Button
                    variant="contained"
                    className="flex-1"
                >
                    Discard
                </Button>
                <Button
                    variant="outlined"
                    className="flex-1"
                    disabled
                >
                    Remove
                </Button>
            </div>

        </div >
    );
};
export default SetRecurringModal;
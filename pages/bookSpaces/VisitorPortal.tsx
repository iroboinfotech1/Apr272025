import React, { useState, useEffect } from "react";
import QuestionnairesService from "../../services/questionnaires.service";
import { Questionnaires } from "../../models/Booking/Questionnaires";
import LaunchCamera from "../bookSpaces/compponents/LaunchCamera";
import { DataGrid } from '@mui/x-data-grid';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import withAuth from '../../HOC/withAuth';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { format } from 'date-fns';
import { Modal, Box } from '@mui/material';
import { Height } from "@mui/icons-material";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const VisitorPortal = (props: any) => {
    const [loader, setLoader] = useState<boolean>(true);
    const [questionnaireList, setQuestionnaireList] = useState<Questionnaires[]>([]);
    const [items, setItems] = useState<any>([]);
    const [visitDate, setVisitDate] = React.useState<string>(
        moment().format("YYYY-MM-DD hh:mm:ss a")
    );

    var storedData: any = '1';
    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        setLoader(true);
        storedData = sessionStorage.getItem('QID');
        var response = await QuestionnairesService.GetQuestionnaireById(parseInt(storedData));
        if (response.status === true) {
            var jsonObject = JSON.parse(response.data.qJson);

            setQuestionnaireList(jsonObject);

        }
        setLoader(false);
        console.log(questionnaireList);
    }

    const handleValueChange = (value: string, question: Questionnaires) => {
        if (items != null && items.length > 0 && items.some(item => item.qId === question.qId)) {
            setItems(items.map(item => item.qId === question.qId ? { ...item, qAnswer: value } : item));
        }
        else {
            setItems([...items, { qId: question.qId, qText: question.qText, qAnswer: value }]);
        }
        console.log(items);
    };

    async function SaveAnswers() {
        if (items != null && items.length > 0) {
            setLoader(true);
            const jsonObject = JSON.stringify(items);
            console.log(jsonObject);
            var formatedDate = format(new Date(visitDate), 'yyyy-MM-dd');
            var response = await QuestionnairesService.SaveQuestionnaireAnswers(formatedDate, jsonObject, capturedImage);
            setLoader(false);
            setItems([]);
        }
    };

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const handleCapture = (image: string) => {
        setCapturedImage(image); // Store the captured image in state or handle further logic
        setOpen(false);
        console.log('Captured Image:', image);
    };

    const handleUploadClick = () => {
        setIsCameraOpen(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Layout>
            <h2 className="text-xl font-bold">Questionnaire</h2>
            <Breadcrumbs currentPage={"Questionnaire"} />
            <div>
                {
                    loader ? <div>Loading Data...</div>
                        :
                        <div>
                            <div className="row">
                                <div className='col-9'>
                                    <div className="row">
                                        <div className='col-12'>
                                            <div className="row justify-content-center align-items-center">
                                                <div className="col-12 col-md-4 mt-3">
                                                    <label> Visit Date </label>
                                                </div>
                                                <div className="col-12 col-md-4 mt-3">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <FormControl fullWidth size="small">
                                                            <DatePicker
                                                                renderInput={(props) => <TextField {...props} />}
                                                                label="Visit Date"
                                                                value={visitDate}
                                                                onChange={(newValue) => {
                                                                    if (newValue) {
                                                                        setVisitDate(newValue);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                            {questionnaireList.map((question) => (
                                                <div key={question.qId} className="row justify-content-center align-items-center">
                                                    <div className="col-12 col-md-4 mt-3">
                                                        <label> {question.qText} </label>
                                                    </div>
                                                    <div className="col-12 col-md-4 mt-3">
                                                        {question.qType == 'Text' && (
                                                            <TextField fullWidth label={question.qText} variant="outlined" className="pk-input"
                                                                onChange={(e) => handleValueChange(e.target.value, question)} />
                                                        )}
                                                        {question.qType == 'Options' && (
                                                            <div className="py-4">
                                                                <RadioGroup className="flex justify-between sm:flex-col" row
                                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                                    //defaultValue=''
                                                                    name="row-radio-buttons-group"
                                                                    //value=''
                                                                    onChange={(e) => handleValueChange(e.target.value, question)}
                                                                >
                                                                    {question.qTypeValue.split("|").map((option, i) => (
                                                                        <FormControlLabel key={i}
                                                                            value={option}
                                                                            control={<Radio />}
                                                                            label={option}
                                                                        />
                                                                    ))}
                                                                </RadioGroup>
                                                            </div>
                                                        )}
                                                        {question.qType == 'List' && (
                                                            <div className="py-4">
                                                                <FormControl fullWidth className="pk-dropdown" >
                                                                    <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
                                                                    <Select labelId="demo-simple-select-label" id="demo-simple-select" label='Question Type'
                                                                        defaultValue={''} onChange={(e) => handleValueChange(e.target.value, question)}>
                                                                        {question.qTypeValue.split("|").map((option, i) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        )}
                                                        {question.qType == 'Grid' && (
                                                            <div className="py-4">
                                                                {/* <DataTable  editMode="row" dataKey="facilityId" size="small"> 
                                                                    <Column field="make" header="Make"  ></Column>
                                                                    <Column field="model" header="Model"  ></Column>
                                                                    <Column field="serialNumber" header="Serial Number"  ></Column>
                                                                    <Column bodyStyle={{ textAlign: 'center' }} ></Column>
                                                                    <Column style={{ width: '3em' }} />
                                                                </DataTable> */}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div>
                                        <h2 className="heading4 font-bold">{`Upload Visitor Photo`}</h2>
                                        {capturedImage && (
                                            <div>
                                                <h3>Captured Image:</h3>
                                                <img src={capturedImage} alt="Captured" className="w-[100px] aspect-video rounded-md" />
                                            </div>
                                        )}

                                        <button onClick={handleUploadClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Take Photo
                                        </button>
                                        <Modal open={open} onClose={handleClose}
                                            aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                            <Box sx={style}>
                                                {isCameraOpen && <LaunchCamera onCapture={handleCapture} onCancel={handleClose} />}
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12 col-md-4 mt-3">
                                    <Button variant="contained" type="submit" onClick={() => SaveAnswers()}>Submit</Button>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </Layout>
    )

}

export default withAuth(VisitorPortal);

import { useForm } from "react-hook-form";
import React, { useMemo, useEffect, useState } from "react";
import QuestionnairesService from "../../services/questionnaires.service";
import { Questionnaires } from "../../models/Booking/Questionnaires";
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Layout from "../../components/Layout";
import Router from 'next/router';
import withAuth from '../../HOC/withAuth';
import AddQuestionnaire from './Questionnaire/AddQuestionnaire';
//import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeleteAlert from "../../components/common/deleteAlert";
import ModalService from "../../components/lib/modalPopup/services/ModalService";
import { Button, TextField, Checkbox, FormControl, FormControlLabel, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from "@mui/material";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    qName: yup.string().required('Questionnaire Name is required'),
});

interface QuestionnairesPage {
    qName: string;
}

const QuestionnairesPage = (props: any) => {

    const qColumnList = [
        { field: 'qId', headerName: 'Q. ID', width: 50, hide: true },
        { field: 'qText', headerName: 'Text', width: 600 },
        { field: 'qType', headerName: 'Type', width: 100 },
        { field: 'qTypeValue', headerName: 'Type Value', width: 200 },
        {
            field: "actionButton",
            headerName: "Actions",
            description: "Actions column.",
            sortable: false,
            width: 150,
            renderCell: (params: any) => {
                return (
                    <div className="flex">
                        <div className="flex">
                            <Button onClick={(e) => updateQuestionnaire(e, params.row)}>
                                <EditIcon></EditIcon>
                            </Button>
                        </div>
                        <Button onClick={(e) => deleteQuestionnaire(e, params.row)} color="error" >
                            <DeleteIcon></DeleteIcon>
                        </Button>
                    </div>
                );
            }
        }
    ];

    const [loader, setLoader] = useState<boolean>(true);
    const [questionnaireList, setQuestionnaireList] = useState<Questionnaires[]>([]);
    const [selectedQuestionnaireList, setSelectedQuestionnaireList] = useState<Questionnaires[]>([]);
    //const navigate  = useNavigate();
    const [questionnairesPage, setQuestionnairesPage] = useState<QuestionnairesPage>();
    const [qDefault, setQDefault] = useState<boolean>(false);

    const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return questionnairesPage;
        }, [questionnairesPage])
    });

    useEffect(() => {
        fetchMyApi();
    }, []);

    async function fetchMyApi() {
        setLoader(true);
        var response = await QuestionnairesService.GetQuestionnairesMasterList();
        if (response.status === true) {
            setQuestionnaireList(response.data);
        }
        setLoader(false);
    }

    async function updateSelection(e: any, row: Questionnaires) {
        const questionnaire = questionnaireList.find((q) => q.qId === row.qId);
        console.log(questionnaire);
    }

    const onRowsSelectionHandler = (ids) => {
        const selectedList = ids.map((id) => questionnaireList.find((row) => row.qId === id));
        setSelectedQuestionnaireList(selectedList)
        console.log(selectedList);
    };

    async function updateQuestionnaire(e: any, row: Questionnaires) {
        if (row.qId) {
            //setEditUserData(editUser);
            Router.push({ pathname: '/bookSpaces/Questionnaire/AddQuestionnaire', query: { qId: row.qId } })
        }
    }

    async function deleteQuestionnaire(e: any, row: Questionnaires) {
        // openModel(DeleteAlert, {
        //     "onDelete": async () => {
        //         setLoader(true);
        //         var result = await QuestionnairesService.DeleteQuestionnaire(row.qId);
        //         if (result.status == true) {
        //             await fetchMyApi();
        //         }
        //         setLoader(false);
        //     }
        // });

        var result = await QuestionnairesService.DeleteQuestionnaire(row.qId);
        if (result.status == true) {
            await fetchMyApi();
        }
        setLoader(false);
    }

    const openModel = (component: any, props?: any) => {
        console.log("open clicked");
        ModalService.open(component, props);
    };

    async function SaveQuestionnaire(data: any) {
        if(selectedQuestionnaireList && selectedQuestionnaireList.length > 0){
            setLoader(true);
            var formData = new FormData();
            formData["questionnaireList"] = selectedQuestionnaireList;
            const sortedList = [...selectedQuestionnaireList].sort((a, b) => a.qId - b.qId);
            const jsonObject = JSON.stringify(sortedList);
            console.log(jsonObject);
            var response = await QuestionnairesService.CreateQuestionnaire(jsonObject, data['qName'], qDefault);
            setLoader(false);
        }
        else{
            alert('Select atleast one Questionnaire.');
        }
    };

    return (
        <Layout>
            <h2 className="text-xl font-bold">Questionnaire</h2>
            <Breadcrumbs currentPage={"Questionnaire"} />
            <div>
                {
                    loader ? <div>Loading Data...</div>
                        :
                        <form onSubmit={handleSubmit(SaveQuestionnaire)}>
                            <div className='col-12'>
                                <div className="row mb-3">
                                    <div className="col-12 text-right">
                                        <div className="mt-5">
                                            <Button variant="contained" type="submit" onClick={() => Router.push('/bookSpaces/Questionnaire/AddQuestionnaire')}>Add Questionnaire</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12" style={{ height: 600, width: '100%' }}>
                                        <DataGrid
                                            initialState={{
                                                columns: {
                                                    columnVisibilityModel: {
                                                        qId: false,
                                                    },
                                                },
                                            }}
                                            rows={questionnaireList}
                                            columns={qColumnList}
                                            checkboxSelection
                                            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                            //onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                            getRowId={(row) => row.qId}
                                        />
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-4 mt-3">
                                        <TextField {...register('qName')} fullWidth label="Question Text" variant="outlined" className="pk-input"
                                            error={!!errors.qName}
                                            helperText={errors.qName?.message?.toString()}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4 mt-3">
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={qDefault} onChange={() => { setQDefault(!qDefault); }} />
                                            }
                                            label="Do you want to default this Questionnaire?"className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="flex m-6">
                                        <Button variant="contained" type="submit">Save Changes</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                }
            </div>
        </Layout>
    )
}

export default withAuth(QuestionnairesPage);
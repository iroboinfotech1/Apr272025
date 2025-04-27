import { useForm } from "react-hook-form";
import React, { useMemo, useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from "@mui/material";
import Router, { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import ApiResponse from "../../../models/ApiResponse";
import withAuth from '../../../HOC/withAuth';
import QuestionnairesService from "../../../services/questionnaires.service";
import { Questionnaires } from "../../../models/Booking/Questionnaires";
import DeleteIcon from '@mui/icons-material/Delete';

const OptionsList = [
    {
        id: "1",
        value: "Text"
    },
    {
        id: "2",
        value: "Options"
    },
    {
        id: "3",
        value: "List"
    },
    {
        id: "4",
        value: "Grid"
    },
]

const schema = yup.object().shape({
    qText: yup.string().required('Question Text is required'),
    qType: yup.string().required('Question Type is required'),
});

const AddQuestionnaire = () => {
    const router = useRouter()
    const { qId } = router.query
    const isAddQuestion = qId ? false : true;
    const [loader, setLoader] = useState<boolean>(false);
    const [questionnaireItem, setQuestionnaireItem] = useState<Questionnaires>();
    const [items, setItems] = useState<any>([]);
    const [newItem, setNewItem] = useState("");

    const { register, handleSubmit, setValue, formState: { errors, defaultValues } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: useMemo(() => {
            return questionnaireItem;
        }, [questionnaireItem])
    });

    useEffect(()=> {
        console.log("isAddUser :" + isAddQuestion)
        if(qId){
            const qesId = parseInt(qId.toString(),10); 
            fetchUserData(qesId);
        } 
    },[]);  

    async function fetchUserData(qId: number){
        setLoader(true);
        var response = await QuestionnairesService.GetQuestionnairesMasterById(qId);
        console.log("QuestionnairesService GetQuestionnairesMasterById", response);
        if (response.status == true) {
            setValue("qText", response.data.qText);
            setValue("qType", response.data.qType);

            setQuestionnaireItem(response.data);
        }
        setLoader(false);
        console.log("UsermanagementService-getUser", response);
    }

    const addItem = () => {
        if (newItem.trim() !== "") {
            setItems([...items, newItem]);
            setNewItem("");
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: any) => {
        var request = {
            qText: data['qText'],
            qType: data['qType'],
            qTypeValue: items.join('|'),
        }

        console.log("request", request);

        let response: ApiResponse;
        //if(isAddQuestion){
            response = await QuestionnairesService.AddQuestionnaire(request);
         //}
        //else{
        //     //response = await UsermanagementService.updateUser(formData);
        // }

        if(response.status == true){
            Router.push('/bookSpaces/QuestionnairesPage');
        }

        console.log("UsermanagementService addUser", response);
    }

    let breadcrumbPaths = [{ 'name': 'Home', 'path': '/' }, { 'name': 'Questionnaire', 'path': '/bookSpaces/QuestionnairesPage' }];  
    return (
        <Layout>
            <h2 className="text-xl font-bold">Questionnaire</h2>
            <Breadcrumbs currentPage={"Questionnaire"} routes={breadcrumbPaths}/>
            <div>
                {
                    loader ? <div>Loading Data...</div>
                        :
                        <div className='col-12'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-12 col-md-4 mt-3">
                                        <TextField {...register('qText')} fullWidth label="Question Text" variant="outlined" className="pk-input"
                                            error={!!errors.qText}
                                            helperText={errors.qText?.message?.toString()}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4 mt-3">

                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-12 col-md-4 mt-3">
                                        <FormControl fullWidth className="pk-dropdown" error={!!errors.qType} >
                                            <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
                                            <Select {...register('qType')} defaultValue={questionnaireItem?.qType ?? "" } labelId="demo-simple-select-label" id="demo-simple-select" label='Question Type' 
                                            disabled={isAddQuestion ?  false : true}>
                                                {OptionsList?.map((x: any) => (<MenuItem key={x.id} value={x.value}>{x.value}</MenuItem>))}
                                            </Select>
                                            {errors.qType && <FormHelperText>{errors.qType.message?.toString()}</FormHelperText>}
                                        </FormControl>
                                    </div>
                                    <div className="col-12 col-md-4 mt-3">

                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-12 col-md-4 mt-3">
                                        <TextField fullWidth label="Question Type Value" variant="outlined" className="pk-input"
                                            value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add new item" />
                                    </div>
                                    <div className="col-12 col-md-4 mt-3">
                                        <Button variant="contained" onClick={addItem}>{'Add new item'}</Button>
                                    </div>
                                </div>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-12 col-md-4 mt-3">
                                        <ul>
                                            {items.map((item, index) => (
                                                <li key={index}>
                                                    {item} <button type="button" onClick={() => removeItem(index)}>Remove</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center mt-4">
                                        <Button variant="contained" type="submit">{isAddQuestion ? 'Add Questionnaire' : 'Update Questionnaire'}</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                }
            </div>
        </Layout>
    )
}

export default withAuth(AddQuestionnaire);
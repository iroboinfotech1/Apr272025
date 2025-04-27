import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    floorName: yup.string(),
});

const AddFloorItem = ({ onAddFile }: any) => {

    //let selectedFile!: File;
    // const [selectedFile, setSelectedFile] = useState<File>();

    const {register,handleSubmit,getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [fileName, setFileName] = useState("");

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.target.files);
        if (e.target.files != null && e.target.files.length > 0) {
            // setSelectedFile(e.target.files[0]);
            getBase64(e.target.files[0]);
            // onAddFile(e.target.files[0])?
        }

        //const files = Array.from(e.target.files);
        //console.log("files:", files)
    }
    // const onNamechange = (e: any) => {
    //     setFileName(e.target.value);
    // }

    const getBase64 = (file: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setFileName(file.name);
            onAddFile({ floorName: getValues('floorName'), floorPlan: reader.result })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


    return (
        <div className="row">
            <div className="col-12 col-md-4 mt-3">
                {/* <TextField fullWidth label="Floor Name" variant="outlined" value={fileName} onChange={onNamechange} className="pk-input" /> */}
                <TextField {...register('floorName')} fullWidth label="Floor Name" variant="outlined" className="pk-input" 
                    error={!!errors.alias} helperText={errors.alias?.message?.toString()} />
            </div>
            <div className="col-12 col-md-8 mt-3">
                <div className="row">
                    <div className="col-6">
                        <Button variant="contained" component="label">
                            Upload Floor Plan
                            <input hidden accept="image/*" onChange={handleFileSelected} type="file" />
                        </Button>
                    </div>
                    <div className="col-6">
                        {(fileName ? fileName : "No files Selected")}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddFloorItem;
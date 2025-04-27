
import { useState } from "react";
import PopupHeader from "../../../common/PopupHeader";
import SuccessMessage from "../common/SuccessMessage";

import AddRoom from "./AddRoom/AddRoom";
import SelectSpace from "./SelectSpace";
import SpaceDetails from "./SpaceDetails";
import cup from "/assets/icons/cup.svg"


const CreateSpace = (props: any) => {
    const steps = ['Select Space', props?.addSpace == true ? 'Add Details' : 'Edit Details', props?.addSpace == true ? 'Add Room' : 'Edit Room'];
    const header = (props.addSpace ? 'Add ' : 'Edit ') + props.space
    const [currentStep, setCurrentStep] = useState(0);
    // const [editDetails, setEditDetails] = useState(props.spaceDetails);
    const [step1Details, setStep1Details] = useState<any>();
    const [step2Details, setStep2Details] = useState<any>();
    const [step0Details, setStep0Details] = useState<any>();
    const [space, setSpace] = useState<string>('');
    const bodyText= "You have successfully " + (props.addSpace ? 'added ' : 'updated ') + " the " + space + "."
    const changeStep = (data: any) => {
        //debugger;
        if(data)
            setSpace(data.space);
        if (currentStep == 0)
            setStep0Details(data);
        else if (currentStep == 1)
            setStep1Details(data);
        else if (currentStep == 2)
            setStep2Details(data);
        setCurrentStep(currentStep + 1);
    }
    const onSuccessClick = () => {
        props.close();
        props.submittedCallback();

    }
    const getRenderPage = () => {
        if (currentStep === 0 || currentStep === 1)
            return (
                <div className="col-10 col-md-6 col-lg-4">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-lg-10 card">
                            <div className="card-body p-4">
                                <PopupHeader title={steps[currentStep]} close={props.close} align="left" ></PopupHeader>
                                {currentStep === 0 ? 
                                    <SelectSpace addSpace={props.addSpace} spaceDetails={props.spaceDetails} afterSubmit={changeStep}></SelectSpace> 
                                    : 
                                    <SpaceDetails addSpace={props.addSpace} space={space} spaceDetails={props.spaceDetails} afterSubmit={changeStep}></SpaceDetails>}
                            </div>
                        </div>
                    </div>
                </div>
            );

        if (currentStep === 2)
            return (
                <AddRoom addSpace={props?.addSpace} space={space} floorDetails={{ ...step0Details, ...step1Details, ...step2Details }} spaceDetails={props.spaceDetails} close={props.close} afterSubmit={changeStep}></AddRoom>
            );
        if (currentStep == 3)
            return (
                <SuccessMessage
                    headerText="Congratulation!"
                    bodyText= {bodyText}
                    headerIcon={cup}
                    buttonText="View Space"
                    close={props.close}
                    buttonCallback={onSuccessClick}
                ></SuccessMessage>
            )
    }

    return getRenderPage();
}

export default CreateSpace;
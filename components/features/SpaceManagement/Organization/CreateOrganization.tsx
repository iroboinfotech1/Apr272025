import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import classNames from "classnames";
import Router from "next/router";
import { useState } from "react";
import PopupHeader from "../../../common/PopupHeader";
import StepProgress from "../../../common/StepProgress";
import SuccessMessage from "../common/SuccessMessage";

import Facilities from "./Facilities";
import AddOrgGeneral from "./General";
import cup from "/assets/icons/cup.svg"


const CreateOrganization = (props: any) => {
    console.log(props.organization);
    const [currentStep, setCurrentStep] = useState(1);
    var stepList = ["General", "Facilities"];

    const changeStepHandler = (step: number) => { setCurrentStep(step); };

    const [organization, setOrganization] = useState(props.organization);

    const onSubmitOrganization = (org: any) => {
        if (!(organization && organization?.orgId))
            setOrganization(org);
        props.submittedCallback();
    }
    const onSuccessClick = () => {
        Router.push('/space/BuildingManagement?openModal=true')

    }

    const className = classNames("col-10 col-lg-11", {
        ["col-xl-8"]: currentStep === 1,
        ["col-xl-10"]: currentStep === 2,
        ["col-xl-6"]: currentStep === 3,
    }
    );

    async function  onCloseAddFacilities() {
        //do Nothing 
    }

    return (

        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className={className}>
                    {
                        currentStep != 3 &&
                        <div className="card">
                            <div className="card-body p-7">
                                <div className="text-center pb-2.5">
                                    <PopupHeader title="Add Organization" subHeading="Please fill the organization details" align="center" close={props.close} ></PopupHeader>
                                </div>
                                <div className="row">
                                    <div className="col-12 mb-2">
                                        <StepProgress stepList={stepList} currentStep={currentStep} ></StepProgress>
                                    </div>
                                </div>
                                {
                                    currentStep === 1 ? 
                                        <AddOrgGeneral organization={props.organization} key={1} submittedCallback={onSubmitOrganization} changeStep={changeStepHandler}></AddOrgGeneral> 
                                    : 
                                        <Facilities key={2} orgId={organization?.orgId} onClose={props.close} changeStep={changeStepHandler} facilitiesMgmt={false} closeCallback={onCloseAddFacilities}></Facilities>
                                }
                            </div>
                        </div>
                    }
                    {
                        currentStep == 3 &&
                        <SuccessMessage
                            headerText="Congratulation!"
                            bodyText="You have successfully created company profile."
                            headerIcon={cup}
                            buttonText="Add Building"
                            close={props.close}
                            buttonCallback={onSuccessClick}

                        ></SuccessMessage>
                    }
                </div>
            </div>
        </div>

    );
}

export default CreateOrganization;
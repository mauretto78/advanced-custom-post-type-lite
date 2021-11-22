import React from 'react';
import {useSelector} from "react-redux";
import Step from "./Step";

export default function StepsContainer({steps}) {

    const {activeStep} = useSelector(state => state.stepsReducer);

    return(
        <div className="acpt-steps-wrapper">
            {steps.map((step, index) => (
                    <Step component={step} isActive={activeStep === (index+1)} />
                )
            )}
        </div>
    );
}
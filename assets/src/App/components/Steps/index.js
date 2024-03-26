import React from "react";
import PropTypes from 'prop-types';

const Steps = ({steps, activeStep = 0}) => {


    const realActiveStep = () => {

        if(activeStep < 0){
            return 0;
        }

        if(activeStep > steps.length){
            return steps.length;
        }

        return activeStep;
    };

    if(!steps[realActiveStep()]){
        return null;
    }

    return (
        <div>
            {steps[realActiveStep()]}
        </div>
    );
};

Steps.propTypes = {
    activeStep: PropTypes.number,
    steps: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default Steps;
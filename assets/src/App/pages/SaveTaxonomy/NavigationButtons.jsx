import React from 'react';
import PropTypes from "prop-types";
import {useFormContext} from "react-hook-form";

const NavigationButtons = ({stepActive, setStepActive, setFormValues = null, steps}) => {

    const { getValues } = useFormContext();

    let buttons = [];

    for (const [index, s] of Object.entries(steps)) {
        buttons.push(
            <li
                className={`acpt-accordion-tab ${parseInt(index) === parseInt(stepActive) ? 'active' : ''}`}
                key={index}
                onClick={() => {
                    if(setFormValues){
                        setFormValues((oldValues) => {
                            oldValues[parseInt(stepActive)+1] = getValues();

                            return oldValues;
                        });
                    }

                    setStepActive(index);
                }}
            >
                <span>
                    {s.label}
                </span>
            </li>
        );
    }

    return (
        <div className="acpt-tabs mb-12">
            <ul role="tablist" className="tablist mb-12">
                {buttons && buttons.map((button) => button)}
            </ul>
        </div>
    );
};

NavigationButtons.propTypes = {
    setFormValues: PropTypes.func,
    setStepActive: PropTypes.func.isRequired,
    stepActive: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
        label:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
};

export default NavigationButtons;
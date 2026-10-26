import React, {useRef} from 'react';
import PropTypes from "prop-types";
import {useFormContext} from "react-hook-form";
import {isEmpty} from "../../utils/objects";
const NavigationButtons = ({stepActive, setStepActive, setFormValues = null, steps}) => {

    const { getValues, formState } = useFormContext();

    const tabRefs = useRef({});

    let buttons = [];

    const formStateIsValid = isEmpty(formState.errors);

    const goToStep = (index) => {
        if(parseInt(index) === parseInt(stepActive)){
            return;
        }

        if(!formStateIsValid){
            return;
        }

        if(setFormValues){
            setFormValues((oldValues) => {
                oldValues[parseInt(stepActive)+1] = getValues();

                return oldValues;
            });
        }

        setStepActive(parseInt(index));
    };

    const stepIndexes = Object.keys(steps);

    const moveFocus = (targetIndex) => {
        goToStep(targetIndex);
        tabRefs.current[targetIndex]?.focus();
    };

    for (const [index, s] of Object.entries(steps)) {
        const isActive = parseInt(index) === parseInt(stepActive);
        const isBlocked = !isActive && !formStateIsValid;

        buttons.push(
            <li
                className={`acpt-accordion-tab ${isActive ? 'active' : ''}`}
                key={index}
                ref={(el) => { tabRefs.current[index] = el; }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-disabled={isBlocked}
                onClick={() => goToStep(index)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' || e.key === ' '){
                        e.preventDefault();
                        goToStep(index);
                        return;
                    }

                    const arrowKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

                    if(!arrowKeys.includes(e.key)){
                        return;
                    }

                    e.preventDefault();

                    const currentPos = stepIndexes.indexOf(index);
                    let nextPos = currentPos;

                    if(e.key === 'ArrowRight'){
                        nextPos = (currentPos + 1) % stepIndexes.length;
                    } else if(e.key === 'ArrowLeft'){
                        nextPos = (currentPos - 1 + stepIndexes.length) % stepIndexes.length;
                    } else if(e.key === 'Home'){
                        nextPos = 0;
                    } else if(e.key === 'End'){
                        nextPos = stepIndexes.length - 1;
                    }

                    moveFocus(stepIndexes[nextPos]);
                }}
            >
                <span>
                    {s.title}
                </span>
            </li>
        );
    }

    return (
        <div className="acpt-tabs mb-12">
            <ul role="tablist" className={`acpt-tablist mb-12 ${!formStateIsValid ? "invalid" : "valid"}`}>
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
        title:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
};

export default NavigationButtons;
import React from 'react';
import {useSelector} from "react-redux";

export default function StepsHeaderElement({heading}) {

    const {activeStep} = useSelector(state => state.stepsReducer);

    const getClassName = () => {
        let className = 'acpt-steps__heading';

        if(activeStep == heading.number){
            className += ' active';
        } else if(activeStep > heading.number){
            className += ' done';
        } else {
            className += ' undone';
        }

        return className;
    };

    return(
        <div className={getClassName()}>
            <div className="number">{heading.number}</div>
            <h3 className="title">{heading.title}</h3>
            {heading.description && <div className="description">
                {heading.description}
            </div>}
        </div>
    )
}
import React from "react";
import PropTypes from 'prop-types';

const StepsHeaderElement = ({heading, stepActive, index}) => {

    const getClassName = () => {
        let className = 'acpt-steps-heading';

        if(index === stepActive){
            className += ' active';
        } else if(stepActive > index){
            className += ' done';
        } else {
            className += ' undone';
        }

        return className;
    };

    return (
        <div className={getClassName()}>
            <div className="number">{index+1}</div>
            <h3 className="title">{heading.title}</h3>
            {heading.description && <div className="description">
                {heading.description}
            </div>}
        </div>
    );
};

StepsHeaderElement.propTypes = {
    index: PropTypes.number.isRequired,
    stepActive: PropTypes.number.isRequired,
    heading: PropTypes.shape({
        label:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    }).isRequired,
};

export default StepsHeaderElement;
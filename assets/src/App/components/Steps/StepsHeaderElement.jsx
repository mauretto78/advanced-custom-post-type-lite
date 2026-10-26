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
            {/* Step label in a wizard progress indicator, not a document
                content section — a real heading here would misrepresent
                the page's heading outline (jumps straight from the page's
                h1 with no h2 in between, and repeats once per step). */}
            <div className="title">{heading.title}</div>
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
        title:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    }).isRequired,
};

export default StepsHeaderElement;
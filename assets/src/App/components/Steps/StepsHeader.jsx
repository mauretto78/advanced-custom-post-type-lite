import React from "react";
import PropTypes from 'prop-types';
import StepsHeaderElement from "./StepsHeaderElement";
import {isRTLOrientation} from "../../utils/misc";

const StepsHeader = ({stepActive, headings}) => {

    return (
        <div className={`acpt-steps ${isRTLOrientation()}`}>
            {headings.map((heading, index) => (
                <StepsHeaderElement
                    key={`step-header-${index}`}
                    heading={heading}
                    index={index}
                    stepActive={stepActive}
                />
            ))}
        </div>
    );
};

StepsHeader.propTypes = {
    stepActive: PropTypes.number.isRequired,
    headings: PropTypes.arrayOf(PropTypes.shape({
        title:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
};

export default StepsHeader;
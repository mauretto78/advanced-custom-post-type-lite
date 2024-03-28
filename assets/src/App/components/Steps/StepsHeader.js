import React from "react";
import PropTypes from 'prop-types';
import StepsHeaderElement from "./StepsHeaderElement";

const StepsHeader = ({stepActive, headings}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    return (
        <div className={`acpt-steps ${globals.is_rtl === true ? `rtl` : ``}`}>
            {headings.map((heading, index) => (
                <StepsHeaderElement heading={heading} index={index} stepActive={stepActive} />
            ))}
        </div>
    );
};

StepsHeader.propTypes = {
    stepActive: PropTypes.number.isRequired,
    headings: PropTypes.arrayOf(PropTypes.shape({
        label:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
};

export default StepsHeader;
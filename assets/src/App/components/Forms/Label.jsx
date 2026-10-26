import React from 'react';
import PropTypes from 'prop-types';
import {sizes} from "../../constants/forms.jsx";

const Label = ({size = 'default', label, id, className, isRequired = false}) => {

    return (
        <label htmlFor={id} className={`form-label ${size} ${className} i-flex-center s-4`}>
            <span>{label}</span>
            {isRequired && (
                <span className="color-danger">*</span>
            )}
        </label>
    );
};

Label.propTypes = {
    size: PropTypes.oneOf(sizes),
    isRequired: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
};

export default Label;
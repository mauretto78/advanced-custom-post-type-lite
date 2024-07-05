import React from 'react';
import PropTypes from 'prop-types';

const Label = ({label, id, isRequired = false}) => {
    return (
        <label htmlFor={id} className="form-label i-flex-center s-4">
            <span>{label}</span>
            {isRequired && (
                <span className="color-danger">*</span>
            )}
        </label>
    );
};

Label.propTypes = {
    isRequired: PropTypes.bool,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default Label;
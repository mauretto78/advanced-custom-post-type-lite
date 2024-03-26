import React from 'react';
import PropTypes from "prop-types";

const FormGroup = ({inline = false, children}) => {
    return (
        <div className={`form-group ${inline ? 'inline' : ''}`}>
            {children}
        </div>
    );
};

FormGroup.propTypes = {
    inline: PropTypes.bool
};

export default FormGroup;
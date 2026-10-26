import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";
import {sizes} from "../../constants/forms.jsx";

const Alert = ({size = "default", style = 'default', className = '', children}) => {
    return (
        <div role="alert" className={`acpt-alert acpt-alert-${style} ${className}`.trim()}>
            <span className={`font-size-${size}`}>
                {children}
            </span>
        </div>
    );
};

Alert.propTypes = {
    size: PropTypes.oneOf(sizes),
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    className: PropTypes.string,
};

export default Alert;
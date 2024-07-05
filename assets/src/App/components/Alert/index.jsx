import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";

const Alert = ({style = 'default', children}) => {
    return (
        <div className={`acpt-alert acpt-alert-${style}`}>
            {children}
        </div>
    );
};

Alert.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired
};

export default Alert;
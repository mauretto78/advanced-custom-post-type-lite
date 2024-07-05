import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";

const Badge = ({style = 'default', children}) => {
    return (
        <span className={`acpt-badge acpt-badge-${style}`}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired
};

export default Badge;
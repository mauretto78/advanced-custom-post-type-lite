import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";

const Button = ({style = 'default', size = 'default', type = 'submit', onClick, disabled = false, css, className, children, testId}) => {

    return (
        <button
            style={css}
            type={type}
            onClick={onClick}
            className={`acpt-btn acpt-btn-${style} acpt-btn-${size} ${className ? className : ''}`}
            disabled={disabled}
            data-cy={testId ? "button-"+testId : null}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    size: PropTypes.oneOf([
        'default',
        'sm',
        'xs',
    ]),
    css: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    testId: PropTypes.string,
    disabled: PropTypes.bool
};

export default Button;
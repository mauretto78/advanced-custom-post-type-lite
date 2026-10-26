import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {styleVariants} from "../../constants/styles";
import {sizes} from "../../constants/forms.jsx";
import {inlineStyleShape} from "../../constants/propShapes.jsx";

const iconWidth = (size) => {
    if (size === 'xs') return 14;
    if (size === 'sm') return 16;
    return 18;
};

const Button = ({style = 'default', size = 'default', type = 'submit', onClick, disabled = false, css, className, children, icon, iconPosition = 'left', testId, ariaLabel}) => {

    return (
        <button
            style={css}
            type={type}
            onClick={onClick}
            className={`acpt-btn acpt-btn-${style} acpt-btn-${size} ${className ? className : ''}`}
            disabled={disabled}
            data-testid={testId ? "button-"+testId : null}
            aria-label={ariaLabel}
        >
            {icon ? (
                <span className="i-flex-center">
                    {iconPosition === 'left' ? (
                        <React.Fragment>
                            <Icon icon={icon} width={iconWidth(size)} />
                            {children}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {children}
                            <Icon icon={icon} width={iconWidth(size)} />
                        </React.Fragment>
                    ) }
                </span>
            ) : children}
        </button>
    );
};

Button.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    size: PropTypes.oneOf(sizes),
    css: inlineStyleShape,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.string,
    iconPosition: PropTypes.oneOf([
        'left',
        'right'
    ]),
    testId: PropTypes.string,
    disabled: PropTypes.bool,
    ariaLabel: PropTypes.string
};

export default Button;
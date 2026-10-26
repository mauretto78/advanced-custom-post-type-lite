import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Icon} from "@iconify/react";
import {styleVariants} from "../../constants/styles";
import {sizes} from "../../constants/forms.jsx";

const iconWidth = (size) => {
    if (size === 'xs') return 14;
    if (size === 'sm') return 16;
    return 18;
};

const ButtonLink = ({style = 'default', size = 'default', to, target, icon, iconPosition = 'left', children, testId, ariaLabel}) => {
    return (
        <Link
            to={to ? to : '#'}
            target={target}
            className={`acpt-btn acpt-btn-${style} acpt-btn-${size}`}
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
        </Link>
    );
};

ButtonLink.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    size: PropTypes.oneOf(sizes),
    to: PropTypes.string.isRequired,
    target: PropTypes.oneOf([
        '_blank',
        '_self',
        '_parent',
        '_top',
    ]),
    icon: PropTypes.string,
    iconPosition: PropTypes.oneOf([
        'left',
        'right'
    ]),
    testId: PropTypes.string,
    ariaLabel: PropTypes.string,
};

export default ButtonLink;
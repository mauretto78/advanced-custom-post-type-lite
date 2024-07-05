import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {styleVariants} from "../../constants/styles";

const ButtonLink = ({style = 'default', size = 'default', to, target, children}) => {
    return (
        <Link
            to={to ? to : '#'}
            target={target}
            className={`acpt-btn acpt-btn-${style} acpt-btn-${size}`}
        >
            {children}
        </Link>
    );
};

ButtonLink.propTypes = {
    style: PropTypes.oneOf(Object.values(styleVariants)).isRequired,
    size: PropTypes.oneOf([
        'default',
        'sm',
        'xs',
    ]),
    to: PropTypes.string.isRequired,
    target: PropTypes.oneOf([
        '_blank',
        '_self',
        '_parent',
        '_top',
    ]),
};

export default ButtonLink;
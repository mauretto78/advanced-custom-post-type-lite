import React from 'react';
import PropTypes from 'prop-types';

/**
 * Small "PRO" pill shown next to features available in ACPT PRO.
 */
const ProBadge = ({className = ""}) => {

    return (
        <span className={`acpt-lite-pro-badge ${className}`} aria-label="ACPT PRO">
            PRO
        </span>
    );
};

ProBadge.propTypes = {
    className: PropTypes.string,
};

export default ProBadge;

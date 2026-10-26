import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import {dangerColor, successColor} from "../../utils/colors.jsx";

const Boolean = ({status, ariaLabel}) => {

    const icon = status ? 'bx:bx-check-circle' : 'bx:bx-x-circle';
    const color = status ? successColor() : dangerColor();
    const label = ariaLabel ?? (status ? 'True' : 'False');

    return <Icon icon={icon} color={color} width={24} aria-label={label} aria-hidden={false} />
};

Boolean.propTypes = {
    status: PropTypes.bool.isRequired,
    ariaLabel: PropTypes.string
};

export default Boolean;
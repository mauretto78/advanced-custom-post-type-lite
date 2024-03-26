import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';

const Boolean = ({status}) => {

    const icon = status ? 'bx:bx-check' : 'bx:bx-x';
    const color = status ? '#02C39A' : '#F94144';

    return <Icon icon={icon} color={color} width="18px" />
};

Boolean.propTypes = {
    status: PropTypes.bool.isRequired
};

export default Boolean;
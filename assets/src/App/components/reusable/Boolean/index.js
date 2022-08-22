import React from 'react';
import {Icon} from "@iconify/react";

const Boolean = ({status}) => {

    const icon = status ? 'bx:bx-check' : 'bx:bx-x';
    const color = status ? '#02c39a' : '#f94144';

    return <Icon icon={icon} color={color} width="18px" />
};

export default Boolean;
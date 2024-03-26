import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';

const ElementIcon = ({value}) => {

    // render image if values starts by http / https
    if(value && value.includes("http://") || value && value.includes("https://")){
        return (
            <img src={value} width={18}  alt="" />
        );
    }

    // add dashicons: for retro-compatibility
    if(value && !value.includes("dashicons")){
        return (
            <Icon icon={`dashicons:${value}`} color="#777" width="18px" />
        );
    }

    return (
        <Icon icon={value} color="#777" width="18px" />
    );
};

ElementIcon.propTypes = {
    value: PropTypes.string.isRequired
};

export default ElementIcon;
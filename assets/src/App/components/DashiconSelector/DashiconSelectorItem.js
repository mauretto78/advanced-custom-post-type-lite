import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';

const DashiconSelectorItem = ({icon, callback}) => {

    return (
        <div
            title={icon}
            className="icon"
            onClick={()=>{
                callback(icon);
            }}
        >
            <Icon icon={icon} width="24px"/>
        </div>
    );
};

DashiconSelectorItem.propTypes = {
    icon: PropTypes.string.isRequired,
    callback: PropTypes.func,
};

export default DashiconSelectorItem;
import React from 'react';
import './DashiconListElement.css';
import {Icon} from "@iconify/react";

const DashiconListElement = ( {icon}) => {
    return (
        <div className="dashicon-element">
            <Icon icon={`dashicons:${icon}`}  width="18px" />
            <span className="dashicon-label">{icon}</span>
        </div>
    );
};

export default DashiconListElement;
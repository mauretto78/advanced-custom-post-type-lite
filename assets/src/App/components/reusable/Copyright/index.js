import React from 'react';
import {Icon} from "@iconify/react";

const Copyright = () => {
    return (
        <div className="acpt-copyright">
            <span style={{display:"inline-block", marginRight: "7px"}}>
                Copyright &copy; 2021 - {new Date().getFullYear()} &nbsp;
                <a href="https://acpt.io" target="_blank">ACPT</a>
            </span>
            <a href="https://acpt.io/documentation" target="_blank" className="acpt-btn acpt-btn-sm acpt-btn-primary-o">
                <Icon icon="fa-regular:life-ring" width="18px" />
                &nbsp;
                Documentation
            </a>
        </div>
    );
};

export default Copyright;
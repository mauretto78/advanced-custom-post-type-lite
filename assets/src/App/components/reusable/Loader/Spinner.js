import React from 'react';
import {Icon} from "@iconify/react";

export default function Spinner() {

    return (
        <div className="acpt-loading">
            <div className="acpt-loader">
                <span className="spinning-icon">
                    <Icon icon="bx:bx-loader-alt" color="#02c39a" width="18px" />
                </span>
                &nbsp;
                <span className="label">
                    Loading...
                </span>
            </div>
        </div>
    );
};
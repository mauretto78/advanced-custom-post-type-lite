import React from 'react';
import {Icon} from "@iconify/react";
import {primaryColor} from "../../utils/colors";

const Loader = () => {
    return (
        <div className="acpt-loading">
            <div className="acpt-loader">
                <span className="spinning-icon">
                    <Icon icon="bx:bx-loader-alt" color={primaryColor()} width={24} />
                </span>
            </div>
        </div>
    );
};

export default Loader;
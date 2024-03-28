import React from 'react';
import {Icon} from "@iconify/react";

const Loader = () => {
    return (
        <div className="acpt-loading">
            <div className="acpt-loader">
                <span className="spinning-icon">
                    <Icon icon="bx:bx-loader-alt" color="#007CBA" width={24} />
                </span>
            </div>
        </div>
    );
};

export default Loader;
import React from 'react';
import {Icon} from "@iconify/react";

const ToggleAside = ({onClick, visibleAside}) => {
    return (
        <div
            className="toggle"
            onClick={onClick}
        >
            {visibleAside ? <Icon icon="bx:bx-chevron-right" width="24px" /> : <Icon icon="bx:bx-chevron-left" width="24px" /> }
        </div>
    );
};

export default ToggleAside;
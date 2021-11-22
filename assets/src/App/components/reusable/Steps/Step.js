import React from "react";

export default function Step({isActive, component}) {
    return(
        <div className={`acpt-step ${isActive ? 'active': 'hidden'}`}>
            {component}
        </div>
    )
}
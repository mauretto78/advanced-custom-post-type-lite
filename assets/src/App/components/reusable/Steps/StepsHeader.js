import React from 'react';
import StepsHeaderElement from "./StepsHeaderElement";

export default function StepsHeader({headings}) {

    if(typeof headings === 'undefined'){
        return null;
    }

    return(
        <div className="acpt-steps__headings">
            {headings.map((heading) => (
                <StepsHeaderElement heading={heading} />
            ))}
        </div>
    )
}
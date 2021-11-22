import React from 'react';
import StepsHeaderElement from "./StepsHeaderElement";

export default function StepsHeader({headings}) {
    return(
        <div className="acpt-steps__headings">
            {headings.map((heading) => (
                <StepsHeaderElement heading={heading} />
            ))}
        </div>
    )
}
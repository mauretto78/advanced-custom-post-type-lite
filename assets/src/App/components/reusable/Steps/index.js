import React from "react";
import StepsHeader from "./StepsHeader";
import StepsContainer from "./StepsContainer";

export default function Steps( {headings, steps}) {
    return(
        <div className="acpt-steps">
            <StepsHeader headings={headings}/>
            <StepsContainer steps={steps}/>
        </div>
    )
}
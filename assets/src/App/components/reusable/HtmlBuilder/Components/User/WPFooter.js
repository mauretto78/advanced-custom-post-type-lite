import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";

export const WPFooter = ({name}) => {
    return (
        <KeyboardInteractiveElement display="block">
            <div className="element-container" style={{height: "100px"}}>
                {name}
            </div>
        </KeyboardInteractiveElement>
    );
};

WPFooter.craft = {
    displayName: '[wp-header]',
};

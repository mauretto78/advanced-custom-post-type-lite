import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";

export const WPHeader = ({name}) => {
    return (
        <KeyboardInteractiveElement display="block">
            <div className="element-container" style={{height: "100px"}}>
                <span className="title">{name}</span>
            </div>
        </KeyboardInteractiveElement>
    );
};

WPHeader.craft = {
    displayName: '[wp-header]',
};
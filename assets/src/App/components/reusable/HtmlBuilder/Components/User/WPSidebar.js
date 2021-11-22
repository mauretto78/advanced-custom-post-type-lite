import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";

export const WPSidebar = ({sidebarId, sidebarName}) => {
    return (
        <KeyboardInteractiveElement display="block">
            <div className="element-container" style={{height: "200px"}}>
                <span className="title">{sidebarName}</span>
                <span className="row" style={{width: "55%"}}/>
                <span className="row" style={{width: "70%"}}/>
                <span className="row" style={{width: "60%"}}/>
                <span className="row" style={{width: "50%"}}/>
                <span className="row" style={{width: "45%"}}/>
                <span className="row row-last" style={{width: "77%"}}/>
            </div>
        </KeyboardInteractiveElement>
    );
};

WPSidebar.craft = {
    displayName: '[wp-sidebar]',
};
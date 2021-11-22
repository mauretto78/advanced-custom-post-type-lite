import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnTwoThirds = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-8">
            <div className="element-container">
                <span className="title">Column 2/3</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnTwoThirds.craft = {
    displayName: "Column 2/3"
};
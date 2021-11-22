import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnOneThird = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-4">
            <div className="element-container">
                <span className="title">Column 1/3</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnOneThird.craft = {
    displayName: "Column 1/3"
};
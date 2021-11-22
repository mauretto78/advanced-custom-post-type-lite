import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnOneHalf = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-6 component">
            <div className="element-container">
                <span className="title">Column 1/2</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnOneHalf.craft = {
    displayName: "Column 1/2"
};


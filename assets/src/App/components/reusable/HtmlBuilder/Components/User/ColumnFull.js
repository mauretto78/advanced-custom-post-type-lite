import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnFull = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-12">
            <div className="element-container">
                <span className="title">Column full width</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnFull.craft = {
    displayName: "Column full width"
};
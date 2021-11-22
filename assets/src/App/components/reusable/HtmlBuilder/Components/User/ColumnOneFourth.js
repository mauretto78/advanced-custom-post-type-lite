import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnOneFourth = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-3">
            <div className="element-container">
                <span className="title">Column 1/4</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnOneFourth.craft = {
    displayName: "Column 1/4"
};
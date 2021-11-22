import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const ColumnThreeFourths = ({children}) => {

    return (
        <KeyboardInteractiveElement className="acpt-col-md-9">
            <div className="element-container">
                <span className="title">Column 3/4</span>
                <div className="content">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

ColumnThreeFourths.craft = {
    displayName: "Column 3/4"
};
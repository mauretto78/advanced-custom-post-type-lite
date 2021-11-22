import {ColumnOneThird} from "./ColumnOneThird";
import React from "react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {Void} from "./Void";

export const Row = ({children}) => {

    return (
        <KeyboardInteractiveElement>
            <div className="element-container">
                <span className="title">Row</span>
                <div className="content acpt-row m-0">
                    {children ? children : <Void /> }
                </div>
            </div>
        </KeyboardInteractiveElement>
    );
};

Row.craft = {
    rules: {
        canMoveIn: (node) => {
            const name = node[0].data.name;

            return (
                name === "ColumnOneHalf" ||
                name === "ColumnOneThird" ||
                name === "ColumnOneFourth" ||
                name === "ColumnTwoThirds" ||
                name === "ColumnThreeFourths" ||
                name === "ColumnFull"
            );
        },
    },
};
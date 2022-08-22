import {Icon} from "@iconify/react";
import React from "react";

export const EMAIL = 'Email';
export const SELECT = 'Select';
export const TEXT = 'Text';

export const fieldsList = [
    { value: EMAIL, label: <div className="vertical-center"><Icon icon="bx:bx-envelope" width="18px" /> &nbsp; Email address</div> },
    { value: TEXT, label: <div className="vertical-center"><Icon icon="bx:bx-text" width="18px" /> &nbsp; Text</div> },
    { value: SELECT, label: <div className="vertical-center"><Icon icon="bx:bx-select-multiple" width="18px" /> &nbsp; Select</div> },
];

export const fieldsListGroupedOptions = [
    {
        label: "BASIC",
        options: [
            fieldsList[0],
            fieldsList[1],
            fieldsList[2],
        ]
    },
];
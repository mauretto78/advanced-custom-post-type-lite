import {Icon} from "@iconify/react";
import React from "react";

export const CHECKBOX = 'Checkbox';
export const RADIO = 'Radio';
export const SELECT = 'Select';
export const TEXT = 'Text';
export const TEXTAREA = 'Textarea';

export const WooCommerceFieldsList = [
    { value: TEXT, label: <div className="vertical-center"><Icon icon="bx:bx-text" width="24px" /> &nbsp; Text</div> },
    { value: TEXTAREA, label: <div className="vertical-center"><Icon icon="bx:bx-pen" width="24px" /> &nbsp; Textarea</div> },
    { value: SELECT, label: <div className="vertical-center"><Icon icon="bx:bx-select-multiple" width="24px" /> &nbsp; Select</div> },
    { value: CHECKBOX, label: <div className="vertical-center"><Icon icon="bx:bx-checkbox-checked" width="24px" /> &nbsp; Checkbox</div> },
    { value: RADIO, label: <div className="vertical-center"><Icon icon="bx:bx-radio-circle-marked" width="24px" /> &nbsp; Radio</div> },
];


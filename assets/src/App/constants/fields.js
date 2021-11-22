import {Icon} from "@iconify/react";
import React from "react";

export const ADDRESS = 'Address';
export const COLOR = 'Color';
export const CURRENCY = 'Currency';
export const DATE = 'Date';
export const EDITOR = 'Editor';
export const EMAIL = 'Email';
export const EMBED = 'Embed';
export const FILE = 'File';
export const GALLERY = 'Gallery';
export const HTML = 'HTML';
export const IMAGE = 'Image';
export const LENGTH = 'Length';
export const LIST = 'List';
export const NUMBER = 'Number';
export const POST = 'Post';
export const PHONE = 'Phone';
export const SELECT = 'Select';
export const SELECT_MULTI = 'SelectMulti';
export const TEXT = 'Text';
export const TEXTAREA = 'Textarea';
export const TOGGLE = 'Toggle';
export const VIDEO = 'Video';
export const WEIGHT = 'Weight';
export const URL = 'Url';

export const fieldsList = [
    { value: EMAIL, label: <div className="vertical-center"><Icon icon="bx:bx-envelope" width="24px" /> &nbsp; Email address</div> },
    { value: TEXT, label: <div className="vertical-center"><Icon icon="bx:bx-text" width="24px" /> &nbsp; Text</div> },
    { value: SELECT, label: <div className="vertical-center"><Icon icon="bx:bx-select-multiple" width="24px" /> &nbsp; Select</div> },
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


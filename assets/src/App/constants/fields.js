import useTranslation from "../hooks/useTranslation";
import React from "react";
import {resolveField} from "../utils/resolvers";

export const fieldGroupsDisplay = {
    STANDARD: "standard",
    ACCORDION: 'accordion',
    VERTICAL_TABS: 'verticalTabs',
    HORIZONTAL_TABS: 'horizontalTabs'
};

export const fieldSettings = {
    MAX_NESTING: 4,
};

export const fieldTypes = {
    DATE: 'Date',
    EMAIL: 'Email',
    SELECT: 'Select',
    TEXT: 'Text',
    TEXTAREA: 'Textarea',
};

/**
 *
 * @return {[{options: [{label, value: string}, {label, value: string}], label: *}, {options: [], label: *}, {options: [], label: *}, {options: [], label: *}, {options: [], label: *}]}
 */
export const fieldsList = (nestingLevel) => {

    const fieldListElement = (fieldType) => {
        const {label} = resolveField(fieldType);

        return {label: useTranslation(label), value: fieldType};
    };

    return [
        {
            label: useTranslation("BASIC"),
            options: [
                fieldListElement(fieldTypes.TEXT),
                fieldListElement(fieldTypes.TEXTAREA),
                fieldListElement(fieldTypes.SELECT),
            ]
        },
        {
            label: useTranslation("SPECIALIZED FIELDS"),
            options: [
                fieldListElement(fieldTypes.DATE),
                fieldListElement(fieldTypes.EMAIL),
            ]
        },
    ];
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldHasOptions = (fieldType) => {

    return (
        fieldType === fieldTypes.SELECT
    );
};

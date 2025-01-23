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
    TEXTAREA: 'Textarea'
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

    let baseOptions = [
        {
            label: useTranslation("BASIC"),
            options: [
                fieldListElement(fieldTypes.EDITOR),
                fieldListElement(fieldTypes.NUMBER),
                fieldListElement(fieldTypes.RANGE),
                fieldListElement(fieldTypes.TEXT),
                fieldListElement(fieldTypes.TEXTAREA),
                fieldListElement(fieldTypes.PASSWORD),
                fieldListElement(fieldTypes.LIST),
                fieldListElement(fieldTypes.HTML),
                fieldListElement(fieldTypes.SELECT),
                fieldListElement(fieldTypes.SELECT_MULTI),
                fieldListElement(fieldTypes.TOGGLE),
                fieldListElement(fieldTypes.CHECKBOX),
                fieldListElement(fieldTypes.RADIO),
            ]
        },

    ];

    return baseOptions;
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

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsRepeater = (fieldType) => {

    return (
        fieldType === fieldTypes.REPEATER
    );
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsFlexible = (fieldType) => {

    return (
        fieldType === fieldTypes.FLEXIBLE
    );
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldIsRelational = (fieldType) => {

    return (
        fieldType === fieldTypes.POST
    );
};
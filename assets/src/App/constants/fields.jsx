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
    ADDRESS: 'Address',
    ADDRESS_MULTI: 'AddressMulti',
    BUTTON: 'Button',
    CAPTCHA: 'Captcha',
    CHECKBOX: 'Checkbox',
    CLONE: 'Clone',
    COLOR: 'Color',
    COUNTRY: 'Country',
    CURRENCY: 'Currency',
    DATE: 'Date',
    DATE_TIME: 'DateTime',
    DATE_RANGE: 'DateRange',
    EDITOR: 'Editor',
    EMAIL: 'Email',
    EMBED: 'Embed',
    FLEXIBLE: 'FlexibleContent',
    FILE: 'File',
    GALLERY: 'Gallery',
    HIDDEN: 'Hidden',
    HTML: 'HTML',
    ICON: 'Icon',
    IMAGE: 'Image',
    LENGTH: 'Length',
    LIST: 'List',
    NUMBER: 'Number',
    PASSWORD: 'Password',
    POST: 'Post',
    POST_OBJECT: 'PostObject',
    POST_OBJECT_MULTI: 'PostObjectMulti',
    PHONE: 'Phone',
    RADIO: 'Radio',
    RANGE: 'Range',
    RATING: 'Rating',
    REPEATER: 'Repeater',
    SELECT: 'Select',
    SELECT_MULTI: 'SelectMulti',
    TABLE: 'Table',
    TERM_OBJECT: 'TermObject',
    TERM_OBJECT_MULTI: 'TermObjectMulti',
    TEXT: 'Text',
    TEXTAREA: 'Textarea',
    TIME: 'Time',
    TOGGLE: 'Toggle',
    TURNSTILE: 'Turnstile',
    VIDEO: 'Video',
    WEIGHT: 'Weight',
    URL: 'Url',
    USER: 'User',
    USER_MULTI: 'UserMulti',
    WORDPRESS_POST_THUMBNAIL: 'PostThumbnail',
    WORDPRESS_POST_TITLE: 'PostTitle',
    WORDPRESS_POST_CONTENT: 'PostContent',
    WORDPRESS_POST_EXCERPT: 'PostExcerpt',
    WORDPRESS_POST_DATE: 'PostDate',
    WORDPRESS_POST_AUTHOR: 'PostAuthor',
    WORDPRESS_POST_TAXONOMIES: 'PostTaxonomies',
    WORDPRESS_USER_EMAIL: 'UserEmail',
    WORDPRESS_USER_FIRST_NAME: 'UserFirstName',
    WORDPRESS_USER_LAST_NAME: 'UserLastName',
    WORDPRESS_USER_USERNAME: 'Username',
    WORDPRESS_USER_PASSWORD: 'UserPassword',
    WORDPRESS_USER_BIO: 'UserBio',
    WORDPRESS_TERM_NAME: 'TermName',
    WORDPRESS_TERM_DESCRIPTION: 'TermDescription',
    WORDPRESS_TERM_SLUG: 'TermSlug'
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
        {
            label: useTranslation("SPECIALIZED FIELDS"),
            options: [
                fieldListElement(fieldTypes.TABLE),
                fieldListElement(fieldTypes.COUNTRY),
                fieldListElement(fieldTypes.DATE),
                fieldListElement(fieldTypes.DATE_TIME),
                fieldListElement(fieldTypes.DATE_RANGE),
                fieldListElement(fieldTypes.TIME),
                fieldListElement(fieldTypes.URL),
                fieldListElement(fieldTypes.PHONE),
                fieldListElement(fieldTypes.EMAIL),
                fieldListElement(fieldTypes.ADDRESS),
                fieldListElement(fieldTypes.ADDRESS_MULTI),
                fieldListElement(fieldTypes.COLOR),
                fieldListElement(fieldTypes.ICON),
                fieldListElement(fieldTypes.RATING),
            ]
        },
        {
            label: useTranslation("UNIT OF MEASURE"),
            options: [
                fieldListElement(fieldTypes.CURRENCY),
                fieldListElement(fieldTypes.WEIGHT),
                fieldListElement(fieldTypes.LENGTH),
            ]
        },
        {
            label: useTranslation("MEDIA"),
            options: [
                fieldListElement(fieldTypes.EMBED),
                fieldListElement(fieldTypes.FILE),
                fieldListElement(fieldTypes.GALLERY),
                fieldListElement(fieldTypes.IMAGE),
                fieldListElement(fieldTypes.VIDEO),
            ]
        },
    ];

    if(nestingLevel < 3){

        let groupedFields = [
            fieldListElement(fieldTypes.REPEATER),
            fieldListElement(fieldTypes.FLEXIBLE),
        ];

        if(nestingLevel === 0){
            groupedFields.push(fieldListElement(fieldTypes.CLONE));
        }

        baseOptions.push({
            label: useTranslation("GROUPED"),
            options: groupedFields
        });
    }

    baseOptions.push({
        label: useTranslation("RELATIONS"),
        options: [
            fieldListElement(fieldTypes.POST),
            fieldListElement(fieldTypes.POST_OBJECT),
            fieldListElement(fieldTypes.POST_OBJECT_MULTI),
            fieldListElement(fieldTypes.TERM_OBJECT),
            fieldListElement(fieldTypes.TERM_OBJECT_MULTI),
            fieldListElement(fieldTypes.USER),
            fieldListElement(fieldTypes.USER_MULTI),
        ]
    });

    return baseOptions;
};

/**
 *
 * @param fieldType
 * @return {boolean}
 */
export const fieldHasOptions = (fieldType) => {

    return (
        fieldType === fieldTypes.SELECT ||
        fieldType === fieldTypes.SELECT_MULTI ||
        fieldType === fieldTypes.CHECKBOX ||
        fieldType === fieldTypes.RADIO
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
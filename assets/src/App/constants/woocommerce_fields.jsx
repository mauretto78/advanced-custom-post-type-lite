import useTranslation from "../hooks/useTranslation.jsx";
import {fieldListElement, fieldTypes} from "./fields.jsx";

export const CHECKBOX = 'Checkbox';
export const COLOR = 'Color';
export const DATE = 'Date';
export const DATE_TIME = 'DateTime';
export const EMAIL = 'Email';
export const NUMBER = 'Number';
export const PHONE = 'Phone';
export const POST_OBJECT = 'PostObject';
export const POST_OBJECT_MULTI = 'PostObjectMulti';
export const RADIO = 'Radio';
export const SELECT = 'Select';
export const SELECT_MULTI = 'SelectMulti';
export const TERM_OBJECT = 'TermObject';
export const TERM_OBJECT_MULTI = 'TermObjectMulti';
export const TEXT = 'Text';
export const TEXTAREA = 'Textarea';
export const TIME = 'Time';
export const URL = 'Url';
export const USER = 'User';
export const USER_MULTI = 'UserMulti';

export const canFieldHaveOptions = (type) =>
    type === SELECT || type === SELECT_MULTI || type === RADIO;

export const WooCommerceFieldsList = [
    {
        label: useTranslation("BASIC"),
        options: [
            fieldListElement(fieldTypes.TEXT),
            fieldListElement(fieldTypes.TEXTAREA),
        ]
    },
    {
        label: useTranslation("ENUM"),
        options: [fieldListElement(fieldTypes.SELECT)]
    },
    {
        label: useTranslation("NUMERIC"),
        options: []
    },
    {
        label: useTranslation("DATE & TIME"),
        options: [fieldListElement(fieldTypes.DATE)]
    },
    {
        label: useTranslation("SPECIALIZED FIELDS"),
        options: [fieldListElement(fieldTypes.EMAIL)]
    },
    {
        label: useTranslation("RELATIONS"),
        options: []
    }
];
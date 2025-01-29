import {fieldTypes} from "../constants/fields";

/**
 *
 * @param fieldType
 * @return {{icon: string, label: string}}
 */
export const resolveField = (fieldType) => {

    let icon = 'bx:bx-map';
    let label = 'Address';

    switch (fieldType) {
        case fieldTypes.DATE:
            icon="bx:bx-calendar";
            label="Date";
            break;
        case fieldTypes.EMAIL:
            icon="bx:bx-envelope";
            label="Email";
            break;
        case fieldTypes.TEXT:
            icon="bx:bx-text";
            label="Text";
            break;
        case fieldTypes.TEXTAREA:
            icon="bx:bx-pen";
            label="Textarea";
            break;
        case fieldTypes.SELECT:
            icon="bx:bx-select-multiple";
            label="Select";
            break;
    }

    return {icon, label};
};
import {v4 as uuidv4} from "uuid";
import {TEXT} from "../../../constants/woocommerce_fields";

/**
 * Builds a new product data field object. Shared by the page-level "Add field"
 * button/drag-drop-from-sidebar flow and the sidebar palette's click-to-add.
 */
export const createField = (type) => ({
    id:           uuidv4(),
    name:         'field',
    type:         type ?? TEXT,
    isRequired:   false,
    description:  null,
    defaultValue: null,
    options:      [],
});

import {inArray, isIterable} from './objects';
import {fieldTypes} from "../constants/fields";

/**
 *
 * @param type
 * @return {boolean}
 */
export const isTextualField = (type) => {
    const allowed = [
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA,
        fieldTypes.SELECT,
        fieldTypes.SELECT_MULTI,
        fieldTypes.URL,
        fieldTypes.PHONE,
        fieldTypes.EMAIL,
        fieldTypes.WEIGHT,
        fieldTypes.LENGTH,
        fieldTypes.CURRENCY,
    ];

    return inArray(type, allowed);
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const canFieldHaveValidationAndLogicRules = (type) => {
    const allowed = [
        fieldTypes.RATING,
        fieldTypes.NUMBER,
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA,
        fieldTypes.RADIO,
        fieldTypes.CHECKBOX,
        fieldTypes.SELECT,
        fieldTypes.SELECT_MULTI,
        fieldTypes.DATE,
        fieldTypes.TIME,
        fieldTypes.URL,
        fieldTypes.PHONE,
        fieldTypes.EMAIL,
        fieldTypes.COLOR,
        fieldTypes.CURRENCY,
        fieldTypes.WEIGHT,
        fieldTypes.LENGTH,
        fieldTypes.TOGGLE,
        fieldTypes.POST_OBJECT,
        fieldTypes.POST_OBJECT_MULTI,
        fieldTypes.TERM_OBJECT,
        fieldTypes.TERM_OBJECT_MULTI,
        fieldTypes.USER,
        fieldTypes.USER_MULTI,
    ];

    return inArray(type, allowed);
};

/**
 *
 * @param boxes
 * @return {[]}
 */
export const getElementIds = (boxes) => {
    let ids = [];

    const recursiveAddIds = (field) => {
        ids.push(field.id);

        field.children && field.children.map((c) => {
            recursiveAddIds(c);
        });

        field.blocks && field.blocks.map((b) => {
            ids.push(b.id);
            b.fields && b.fields.map((c) => {
                recursiveAddIds(c);
            });
        });
    };

    boxes && boxes.map((b)=>{
        ids.push(b.id);

        b.fields && b.fields.map((f) => {
            recursiveAddIds(f);
        });
    });

    return ids;
};

/**
 * Returns (recursively) a form id for any field. Example:
 *
 * box.0.fields.1.text
 *
 * @param boxes
 * @param boxId
 * @param elementId
 * @param showIndex
 * @return {string}
 */
export const getFormId = (boxes, boxId, elementId, showIndex = true) => {

    const boxIndex = boxes.findIndex((b) => b.id === boxId);
    let label = `boxes.${boxIndex}.fields`;

    const recursiveSearchLabel = (el, index, prefix = '') => {

        if(el.id === elementId){
            label += `${prefix}`;

            if(showIndex){
                label += `.${index}`;
            }

        } else if(el.children && el.children.length > 0) {
            el.children.map((c, cIndex) => {
                recursiveSearchLabel(c, cIndex, `${prefix}.${index}.children`);
            });
        } else if(el.blocks && el.blocks.length > 0) {
            el.blocks.map((b, bIndex) => {
                recursiveSearchLabel(b, bIndex, `${prefix}.${index}.blocks`);
            });
        } else if(el.fields && el.fields.length > 0) {
            el.fields.map((f, fIndex) => {
                recursiveSearchLabel(f, fIndex, `${prefix}.${index}.fields`);
            });
        }
    };

    boxes
        .filter((b) => b.id === boxId)
        .map((box) => {
            box.fields && box.fields.map((f, fIndex) => {
                recursiveSearchLabel(f, fIndex);
            });
        });

    return label;
};

/**
 *
 * @param boxes
 * @param boxId
 * @param elementId
 * @return {number}
 */
export const fieldNestingLevel = (boxes, boxId, elementId) => {
    const formId = getFormId(boxes, boxId, elementId);
    const formIdArray = formId.split(".");

    if(formIdArray.length >= 4){
        return (formIdArray.length - 4)/2;
    }

    return 0;
};

/**
 * Hydrate an element
 *
 * @param boxes
 * @param boxId
 * @param elementId
 * @return {null}
 */
export const hydrateElement = (boxes, boxId, elementId) => {
    const formId = getFormId(boxes, boxId, elementId);
    const formIdArray = formId.split(".");
    formIdArray.shift();

    let obj = null;

    formIdArray.map((f) => {
        obj = obj ? obj[f] : boxes[f];
    });

    return obj;
};

/**
 * Append an element to a box object
 * Example:
 *
 * appendBoxElement(boxes, 980, newOption, 3, 'options')
 *
 * @param boxes
 * @param boxId
 * @param element
 * @param parentElementId
 * @param key
 * @return {*}
 */
export const appendBoxElement = (boxes, boxId, element, parentElementId = null, key) => {
    const boxIndex = boxes.findIndex((b) => b.id === boxId);
    const obj = (parentElementId) ? hydrateElement(boxes, boxId, parentElementId) : boxes[boxIndex];

    if(!obj || !obj[key] || !isIterable(obj[key])){
        return boxes[boxIndex];
    }

    obj[key].push(element);

    return boxes[boxIndex];
};

/**
 * Delete an element from a box object.
 *
 * Example:
 *
 * deleteBoxElement(boxes, 980, 6565, 545, 'children')
 *
 * @param boxes
 * @param boxId
 * @param elementId
 * @param parentElementId
 * @param key
 * @return {*}
 */
export const deleteBoxElement = (boxes, boxId, elementId, parentElementId = null, key) => {
    const boxIndex = boxes.findIndex((b) => b.id === boxId);
    const obj = (parentElementId) ? hydrateElement(boxes, boxId, parentElementId) : boxes[boxIndex];

    if(!obj || !obj[key] || !isIterable(obj[key])){
        return boxes[boxIndex];
    }

    obj[key] = obj[key].filter((e)=>e.id !== elementId);

    return boxes[boxIndex];
};

/**
 * Update an element in a box object.
 *
 * Example:
 *
 * updateBoxSortedElements(boxes, 980, sortedBlocks, 44, 'blocks')
 *
 * @param boxes
 * @param boxId
 * @param elements
 * @param parentElementId
 * @param key
 * @return {null|*}
 */
export const updateBoxSortedElements = (boxes, boxId, elements, parentElementId = null, key) => {
    const boxIndex = boxes.findIndex((b) => b.id === boxId);
    let parentObj = parentElementId ? hydrateElement(boxes, boxId, parentElementId) : boxes[boxIndex];

    if (!parentObj || !parentObj[key] || !isIterable(parentObj[key])) {
        return null;
    }

    parentObj[key] = elements;

    return boxes[boxIndex];
};

/**
 *
 * @param boxes
 * @param boxId
 * @param element
 * @return {*}
 */
export const updateBoxElement = (boxes, boxId, element) => {
    const boxIndex = boxes.findIndex((b) => b.id === boxId);

    const formId = getFormId(boxes, boxId, element.id);
    const formIdArray = formId.split(".");
    const lastIndex = formIdArray.splice(-1);
    formIdArray.shift();

    let obj = null;

    formIdArray.map((f) => {
        obj = obj ? obj[f] : boxes[f];
    });

    obj[lastIndex] = element;

    return boxes[boxIndex];
};
import {v4 as uuidv4} from "uuid";
import {inArray, isIterable} from './objects';
import {fieldTypes} from "../constants/fields";
import useTranslation from "../hooks/useTranslation";

/**
 * @return bool
 */
export const canControlHaveOptions = (type) => {
    return [fieldTypes.SELECT].includes(type);
};

/**
 * @return bool
 */
export const canBeQuickEdited = (type) => {
    const allowed = [
        fieldTypes.DATE,
        fieldTypes.SELECT,
        fieldTypes.EMAIL,
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA
    ];

    return inArray(type, allowed);
}

/**
 * @return bool
 */
export const isFilterable = (type) => {
    const allowed = [
        fieldTypes.DATE,
        fieldTypes.EMAIL,
        fieldTypes.SELECT,
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA
    ];

    return inArray(type, allowed);
};

export const canHaveAfterAndBefore = (type) => {
    const allowed = [
        fieldTypes.DATE,
        fieldTypes.EMAIL,
        fieldTypes.SELECT,
        fieldTypes.TEXTAREA,
        fieldTypes.TEXT
    ];

    return inArray(type, allowed);
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isCheckboxField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isTextualField = (type) => {
    const allowed = [
        fieldTypes.DATE,
        fieldTypes.EMAIL,
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA,
        fieldTypes.SELECT
    ];

    return inArray(type, allowed);
};

/**
 *
 * @return {boolean}
 */
export const isUOMField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

/**
 * The numeric/scalar field family that shares min/max/step settings in
 * TextualFieldsSettings.jsx's group1 (a superset of isUOMField -- also
 * includes NUMBER, RANGE and TIME, which have no unit of measure).
 *
 * @return bool
 */
export const isNumericField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

/**
 *
 * @return {boolean}
 */
export const isPasswordField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

export const isMessageField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

/**
 *
 * @return {boolean}
 */
export const isNestableField = (type) => {
    const allowed = [];

    return inArray(type, allowed);
};

/**
 *
 * @return {boolean}
 */
export const isDateField = (type) => {
    return type === fieldTypes.DATE;
};

/**
 *
 * @return {boolean}
 */
export const isDateTimeField = (type) => {
    return false;
};

/**
 *
 * @return {boolean}
 */
export const isTimeField = (type) => {
    return false;
};

/**
 *
 * @return {boolean}
 */
export const isUserField = (type) => {
    return false;
};

/**
 *
 * @return {boolean}
 */
export const isTermObjectField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isPostObjectField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isRelationalField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isAudioField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isCloneField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isIDfield = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isImageField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isImageSliderField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isGalleryField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isVideoField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isVideoMultiField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isFileField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isHTMLField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isTableField = (type) => {
    return false;
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const isTextarea = (type) => {
    return type === fieldTypes.TEXTAREA;
};

/**
 *
 * @return {boolean}
 */
export const isRadioField = (type) => {
    return false;
};

/**
 *
 * @return {boolean}
 */
export const isURLField = (type) => {
    return false;
};

/**
 *
 * @return {boolean}
 */
export const canCopyTheField = (isSaved) => {

    if(typeof isSaved !== 'undefined' && isSaved === false){
        return false
    }

    return true;
};

/**
 *
 * @param field
 * @param boxId
 * @param parentFieldId
 * @param parentBlockId
 * @return {{id: *, parentBlockId: *, parentFieldId: *, boxId: *}}
 */
export const formatFieldForSelection = (field, boxId, parentFieldId, parentBlockId) => {

    let children = [];

    // repeater fields
    field.children && field.children.map((c)=>{
        children.push(formatFieldForSelection(c, boxId, field.id, parentBlockId));
    });

    // flexible fields
    field.blocks && field.blocks.map((b)=>{
        b.fields && b.fields.map((c)=>{
            children.push(formatFieldForSelection(c, boxId, field.id, b.id));
        });
    });

    return {
        id: field.id,
        boxId: boxId,
        children: children,
        parentFieldId: parentFieldId,
        parentBlockId: parentBlockId
    };
};

/**
 *
 * @return {[{label: string, value: string}, {label: string, value: string}, {label: string, value: string}]}
 */
export const postFieldLayouts = () => {
    return [
        {label: useTranslation("Only name or title"), value: "basic"},
        {label: useTranslation("With image"), value: "image"}
    ];
};

/**
 *
 * @param type
 * @return {boolean}
 */
export const canFieldHaveValidationAndLogicRules = (type) => {
    const allowed = [
        fieldTypes.TEXT,
        fieldTypes.TEXTAREA,
        fieldTypes.SELECT,
        fieldTypes.DATE,
        fieldTypes.EMAIL
    ];

    return inArray(type, allowed);
};

/**
 * Get a field from boxes array
 * @param boxes
 * @param fieldId
 */
export const getField = (boxes, fieldId) => {

    let f = null;

    boxes.map((box) => {

        const recursiveSearchField = (field) => {
            if(field.id === fieldId){
                f = field;
            }

            field.children && field.children.map((c) => {
                recursiveSearchField(c);
            });

            field.blocks && field.blocks.map((b) => {
                b.fields && b.fields.map((c) => {
                    recursiveSearchField(c);
                });
            });
        };

        box.fields && box.fields.map((field) => {
            recursiveSearchField(field);
        });
    });

    return f;
};

/**
 * Get a field map of a box
 * (used by ConditionalRenderingElement)
 *
 * @param box
 * @return {[]}
 */
export const getFieldsMap = (box) => {
    let fields = [];

    const recursiveAddFields = (field, parentFields) => {

        fields.push({
            field: field,
            fields: parentFields.filter(f => f.id !== field.id)
        });

        field.children && field.children.map((c) => {
            recursiveAddFields(c, field.children);
        });

        field.blocks && field.blocks.map((b) => {
            fields.push(b.id);
            b.fields && b.fields.map((c) => {
                recursiveAddFields(c, b.fields);
            });
        });
    };

    box.fields && box.fields.map((f) => {
        recursiveAddFields(f, box.fields);
    });

    return fields;
};

/**
 * The fields a field's conditional rendering can depend on ("Other fields").
 *
 * The canvas form state is flat (children/block fields are box.fields
 * siblings carrying parentId/blockId), and conditions are evaluated against
 * the whole edit screen, so the candidates are (#1383):
 *  - every root field of every box of the group;
 *  - for a nested field, the fields of its own row (same parentId and blockId).
 * The field itself is never a candidate.
 *
 * @param {object[]} boxes   the form's boxes (flat fields)
 * @param {string} fieldId   the field being edited
 * @param {string[]} allowedTypes
 * @return {{box: object, field: object}[]}
 */
export const getConditionalRenderingOtherFields = (boxes, fieldId, allowedTypes) => {
    const allFields = (boxes ?? []).flatMap(box => (box?.fields ?? []).filter(Boolean));
    const current = allFields.find(f => f.id === fieldId);
    const isNested = !!(current && (current.parentId || current.blockId));

    const candidates = [];

    (boxes ?? []).forEach((box) => {
        (box?.fields ?? []).filter(Boolean).forEach((field) => {
            if(field.id === fieldId || !allowedTypes.includes(field.type)){
                return;
            }

            const isRoot = !field.parentId && !field.blockId;
            const isSameRow = isNested &&
                (field.parentId ?? null) === (current.parentId ?? null) &&
                (field.blockId ?? null) === (current.blockId ?? null);

            if(isRoot || isSameRow){
                candidates.push({box, field});
            }
        });
    });

    return candidates;
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

        b.fields && b.fields.length > 0 && b.fields.map((f) => {
            recursiveAddIds(f);
        });

        b.children && b.children.length > 0 && b.children.map((c) => {
            recursiveAddIds(c);
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

/**
 *
 * @param boxes
 * @param boxId
 * @param fieldId
 * @param value
 * @return {string}
 */
export const metaFieldFormId = (boxes, boxId, fieldId, value) => {
    return `${getFormId(boxes, boxId, fieldId)}.${value}`;
};

/**
 * Canonical new-field factory for the Meta canvas.
 *
 * @param type
 * @param boxId
 * Returns baseName unchanged if no field in existingFields already uses it
 * (case-insensitively); otherwise appends the smallest free `_N` suffix.
 * Mirrors the backend's own Strings::getTheFirstAvailableName() scheme.
 *
 * @param {string} baseName
 * @param {object[]} existingFields
 * @return {string}
 */
export const getUniqueFieldName = (baseName, existingFields = []) => {
    const taken = new Set((existingFields ?? []).filter(Boolean).map(f => (f.name ?? '').toLowerCase()));

    if (!taken.has((baseName ?? '').toLowerCase())) return baseName;

    let n = 1;
    while (taken.has(`${baseName}_${n}`.toLowerCase())) n++;

    return `${baseName}_${n}`;
};

/**
 * @param parentFieldId
 * @param parentBlockId
 * @return {object}
 */
export const createField = (type, boxId, parentFieldId = null, parentBlockId = null) => ({
    id:                   uuidv4(),
    boxId,
    name:                 'meta_box_field',
    label:                'meta box field',
    type:                 type ?? fieldTypes.TEXT,
    defaultValue:         "",
    description:          "",
    isRequired:           false,
    showInArchive:        false,
    quickEdit:            false,
    filterableInAdmin:    false,
    sort:                 1,
    advancedOptions:      [],
    options:              [],
    relations:            [],
    blocks:               [],
    blockId:              parentBlockId,
    validationRules:      [],
    visibilityConditions: [],
    hasManyRelation:      [],
    children:             [],
    parentId:             parentFieldId,
    isATextualField:      true,
    isFilterable:         true,
    isSaved:              false
});

/**
 * Canonical new-box factory for the Meta canvas.
 *
 * @param existingBoxesCount
 * @return {object}
 */
export const createBox = (existingBoxesCount = 0) => ({
    id:      uuidv4(),
    name:    "meta_box_title",
    UIName:  "meta box title",
    label:   "meta box title",
    fields:  [],
    isSaved: false,
    sort:    existingBoxesCount
});

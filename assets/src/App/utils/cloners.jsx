import {v4 as uuidv4} from "uuid";

/**
 * Clone a page object
 *
 * @param page
 * @return {*}
 */
export const clonePage = (page) => {

    const objCopy = {...page};
    const newPageId = uuidv4();
    let clonedPages = [];

    objCopy.id = newPageId;
    objCopy.menuSlug = objCopy.menuSlug + "_copy";
    objCopy.menuTitle = objCopy.menuTitle + " copy";
    objCopy.pageTitle = objCopy.pageTitle + " copy";
    objCopy.isSaved = false;
    objCopy.children && objCopy.children.map((child, index) => {
        clonedPages.push(cloneChildPage(newPageId, child));
    });

    objCopy.children = clonedPages;

    return objCopy;
};

/**
 * Clone a child page object
 *
 * @param parentId
 * @param page
 * @return {*}
 */
export const cloneChildPage = (parentId, page) => {

    const objCopy = {...page};
    const newPageId = uuidv4();

    objCopy.id = newPageId;
    objCopy.parentId = parentId;
    objCopy.menuSlug = objCopy.menuSlug + "_copy";
    objCopy.menuTitle = objCopy.menuTitle + " copy";
    objCopy.pageTitle = objCopy.pageTitle + " copy";
    objCopy.isSaved = false;

    return objCopy;
};

/**
 * Clone a box object
 *
 * @param box
 * @return {*}
 */
export const cloneBox = (box) => {

    const objCopy = {...box};
    const newBoxId = uuidv4();
    let clonedFields = [];

    objCopy.id = newBoxId;
    objCopy.name = objCopy.name + "_copy";
    objCopy.isSaved = false;
    objCopy.fields && objCopy.fields.map((field, index) => {
        clonedFields.push(cloneField(newBoxId, field));
    });

    objCopy.fields = clonedFields;

    return objCopy;
};

export const cloneWCField = (field) => {
    const objCopy = {...field};
    const newFieldId = uuidv4();
    let clonedOptions = [];

    objCopy.id = newFieldId;
    objCopy.name = objCopy.name + "_copy";

    objCopy.options && objCopy.options.map((option) => {
        clonedOptions.push(cloneWCOption(newFieldId, option));
    });

    return objCopy;
};

const cloneWCOption = (fieldId, option) => {
    const objCopy = {...option};
    const newOptionId = uuidv4();

    objCopy.id = newOptionId;
    objCopy.fieldId = fieldId;

    return objCopy;
};

/**
 * Clone a field object
 *
 * @param boxId
 * @param field
 * @param parentId
 * @param parentBlockId
 */
export const cloneField = (boxId, field, parentId = null, parentBlockId = null) => {

    const objCopy = {...field};
    const newFieldId = uuidv4();
    let clonedOptions = [];
    let clonedAdvancedOptions = [];
    let clonedVisibilityConditions = [];
    let clonedValidationRules = [];
    let clonedBlocks = [];
    let clonedChildren = [];

    objCopy.id = newFieldId;
    objCopy.boxId = boxId;
    objCopy.label = objCopy.label + " copy";
    objCopy.name = objCopy.name + "_copy";
    objCopy.parentId = parentId;
    objCopy.blockId = parentBlockId;
    objCopy.isSaved = false;

    objCopy.advancedOptions && Object.keys(objCopy.advancedOptions).map((index) => {
        clonedAdvancedOptions[index] = cloneOption(boxId, newFieldId, objCopy.advancedOptions[index]);
    });

    objCopy.options && objCopy.options.map((option) => {
        clonedOptions.push(cloneOption(boxId, newFieldId, option));
    });

    objCopy.visibilityConditions && objCopy.visibilityConditions.map((condition) => {
        clonedVisibilityConditions.push(cloneVisibilityCondition(boxId, newFieldId, condition));
    });

    objCopy.validationRules && objCopy.validationRules.map((rule) => {
        clonedValidationRules.push(cloneValidationRule(boxId, newFieldId, rule));
    });

    objCopy.children && objCopy.children.map((child) => {
        clonedChildren.push(cloneField(boxId, child, newFieldId));
    });

    objCopy.blocks && objCopy.blocks.map((block) => {
        clonedBlocks.push(cloneBlock(boxId, newFieldId, block));
    });

    objCopy.advancedOptions = clonedAdvancedOptions;
    objCopy.options = clonedOptions;
    objCopy.validationRules = clonedValidationRules;
    objCopy.visibilityConditions = clonedVisibilityConditions;
    objCopy.children = clonedChildren;
    objCopy.blocks = clonedBlocks;

    return objCopy;
};

const cloneOption = (boxId, fieldId, option) => {
    const objCopy = {...option};
    const newOptionId = uuidv4();

    objCopy.id = newOptionId;
    objCopy.boxId = boxId;
    objCopy.fieldId = fieldId;

    return objCopy;
};

const cloneVisibilityCondition = (boxId, fieldId, condition) => {
    const objCopy = {...condition};
    const newConditionId = uuidv4();

    objCopy.id = newConditionId;
    objCopy.operator = condition.operator;
    objCopy.value = condition.value;
    objCopy.logic = condition.logic;
    objCopy.type = condition.type;

    return objCopy;
};

const cloneValidationRule = (boxId, fieldId, rule) => {
    const objCopy = {...rule};
    const newRuleId = uuidv4();

    objCopy.id = newRuleId;
    objCopy.condition = rule.condition;
    objCopy.value = rule.value;

    return objCopy;
};

export const cloneBlock = (boxId, fieldId, block) => {
    const objCopy = {...block};
    const newBlockId = uuidv4();

    objCopy.id = newBlockId;
    objCopy.boxId = boxId;
    objCopy.fieldId = fieldId;
    objCopy.name = block.name + "_copy";
    objCopy.label = block.label + " copy";
    objCopy.isSaved = false;

    let clonedFields = [];

    objCopy.fields && objCopy.fields.map((f, fIndex) => {
        clonedFields.push(cloneField(boxId, fieldId, null, newBlockId));
    });

    objCopy.fields = clonedFields;

    return objCopy;
};
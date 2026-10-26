import {createSlice} from '@reduxjs/toolkit';
import {cloneBox, cloneField} from "../../utils/cloners";
import {getElementIds, getUniqueFieldName} from "../../utils/fields";
import {savedIsClosed} from "../../utils/localStorage";
import {flattenFields} from "../../utils/flattenFields";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    group: {},
    activeElement: null,  // { id, boxId, boxIndex, fieldIndex, parentFieldId, parentFieldIndex, parentBlockId }
    activeBox: null,      // { id, index }
    selectedElements: [],
    selectedElementsType: null,
    closedElements: []
};

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const metaStateSlice = createSlice({
    name: 'metaState',
    initialState,
    reducers: {
        addBelong: (state, action) => {
            if(action.payload){
                const {belong} = action.payload;

                if(!state.group.belongs){
                    state.group.belongs = [];
                }

                if(!state.group.boxes){
                    state.group.boxes = [];
                }

                state.group = {
                    ...state.group,
                    belongs: [...state.group.belongs, belong]
                };
            }
        },
        addBlock: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, block} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === parentFieldId);
                if(field){
                    if(!field.blocks) field.blocks = [];
                    field.blocks.push(block);
                }
            }
        },
        addBox: (state, action) => {
            if(action.payload){
                if(!state.group.boxes){
                    state.group.boxes = [];
                }

                state.group = {
                    ...state.group,
                    boxes: [...state.group.boxes, action.payload]
                };
            }
        },
        addBoxConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, element} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                if(!state.group.boxes[boxIndex].visibilityConditions) state.group.boxes[boxIndex].visibilityConditions = [];
                state.group.boxes[boxIndex].visibilityConditions.push(element);
            }
        },
        addField: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, parentBlockId, field} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                const newField = {
                    ...field,
                    name: getUniqueFieldName(field.name, state.group.boxes[boxIndex].fields),
                    parentId: parentFieldId || null,
                    blockId: parentBlockId || null,
                };

                state.group.boxes[boxIndex].fields.push(newField);
            }
        },
        addOption: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, option} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field){
                    if(!field.options) field.options = [];
                    field.options.push(option);
                }
            }
        },
        addConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, element} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field){
                    if(!field.visibilityConditions) field.visibilityConditions = [];
                    field.visibilityConditions.push(element);
                }
            }
        },
        addValidationRule: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, rule} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field){
                    if(!field.validationRules) field.validationRules = [];
                    field.validationRules.push(rule);
                }
            }
        },
        addPermission: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, permission} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field){
                    if(!field.permissions) field.permissions = [];
                    field.permissions.push(permission);
                }
            }
        },
        deleteAllBoxes: (state) => {
            state.group = {
                ...state.group,
                boxes: []
            };

            state.activeBox = null;
            state.activeElement = null;
            state.selectedElements = [];
            state.selectedElementsType = null;
        },
        deleteBelong: (state, action) => {
            if(action.payload){
                const {belongId} = action.payload;

                state.group.belongs = (state.group.belongs || []).filter((b) => b.id !== belongId);
            }
        },
        deleteBlock: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, blockId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                state.selectedElements = [];
                state.selectedElementsType = null;

                const field = state.group.boxes[boxIndex].fields.find(f => f.id === parentFieldId);
                if(field && field.blocks){
                    field.blocks = field.blocks.filter(b => b.id !== blockId);
                }
                // Also remove any fields that belonged to this block
                state.group.boxes[boxIndex].fields = state.group.boxes[boxIndex].fields.filter(f => f.blockId !== blockId);
            }
        },
        deleteBox: (state, action) => {
            if(action.payload){
                state.group = {
                    ...state.group,
                    boxes: state.group.boxes ? state.group.boxes.filter((b) => b.id !== action.payload) : []
                };

                state.activeBox = null;
                state.selectedElements = [];
                state.selectedElementsType = null;
            }
        },
        deleteBoxConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, elementId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                if(!state.group.boxes[boxIndex].visibilityConditions) return;

                state.group.boxes[boxIndex].visibilityConditions = state.group.boxes[boxIndex].visibilityConditions.filter(el => el.id !== elementId);
            }
        },
        deleteConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, elementId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field && field.visibilityConditions){
                    field.visibilityConditions = field.visibilityConditions.filter(el => el.id !== elementId);
                }
            }
        },
        deleteField: (state, action) => {
            if(action.payload){
                const {boxId, fieldId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                if(state.activeElement?.id === fieldId){
                    state.activeElement = null;
                }

                state.selectedElements = [];
                state.selectedElementsType = null;

                // Cascade delete: remove field and all descendants
                const idsToRemove = new Set([fieldId]);
                let changed = true;
                while(changed){
                    changed = false;
                    state.group.boxes[boxIndex].fields.forEach(f => {
                        if(!idsToRemove.has(f.id)){
                            // Direct child (parentId match)
                            if(f.parentId && idsToRemove.has(f.parentId)){
                                idsToRemove.add(f.id);
                                changed = true;
                            }
                            // Block field (blockId belongs to a block of a removed field)
                            if(f.blockId){
                                state.group.boxes[boxIndex].fields.forEach(parent => {
                                    if(idsToRemove.has(parent.id) && parent.blocks){
                                        parent.blocks.forEach(block => {
                                            if(block.id === f.blockId){
                                                idsToRemove.add(f.id);
                                                changed = true;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }

                state.group.boxes[boxIndex].fields = state.group.boxes[boxIndex].fields.filter(f => !idsToRemove.has(f.id));
            }
        },
        deleteOption: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, optionId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field && field.options){
                    field.options = field.options.filter(o => o.id !== optionId);
                }
            }
        },
        deleteValidationRule: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, ruleId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field && field.validationRules){
                    field.validationRules = field.validationRules.filter(r => r.id !== ruleId);
                }
            }
        },
        deletePermission: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, permissionId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field && field.permissions){
                    field.permissions = field.permissions.filter(p => p.id !== permissionId);
                }
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
            state.selectedElementsType = null;
        },
        hideElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;

                if(!state.closedElements.includes(id)){
                    state.closedElements.push(id);
                }
            }
        },
        duplicateBox: (state, action) => {
            if(action.payload){
                state.group = {
                    ...state.group,
                    boxes: [...state.group.boxes, cloneBox(action.payload)]
                };
            }
        },
        duplicateField: (state, action) => {
            if(action.payload){
                const {boxId, field} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                const {...box} =  state.group.boxes.filter((b) => b.id === boxId)[0];
                box.fields.push(cloneField(boxId, field));
                state.group.boxes[boxIndex] = box;
            }
        },
        hydrateState: (state, action) => {
            if(action.payload){
                const payload = {...action.payload};

                // Flatten nested children/block-fields into flat box.fields
                if(payload.boxes && Array.isArray(payload.boxes)){
                    payload.boxes = payload.boxes.map(box => ({
                        ...box,
                        fields: flattenFields(box.fields ?? [])
                    }));
                }

                state.group = payload;

                const ids = getElementIds(state.group.boxes);
                ids.map((id) => {
                    if(savedIsClosed(id) && !state.closedElements.includes(id)){
                        state.closedElements.push(id);
                    }
                });
            }
        },
        setActiveBox: (state, action) => {
            if(action.payload){
                state.activeBox     = action.payload; // { id, index }
                state.activeElement = null;
            }
        },
        setActiveElement: (state, action) => {
            if(action.payload){
                // payload: { id, boxId, boxIndex, fieldIndex, parentFieldId, parentFieldIndex, parentBlockId }
                state.activeElement = action.payload;
                state.activeBox     = null;
            }
        },
        setBlocks: (state, action) => {
            if(action.payload){
                const {boxId, sortedBlocks, parentFieldId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === parentFieldId);
                if(field){
                    field.blocks = sortedBlocks;
                }
            }
        },
        setBoxes: (state, action) => {
            if(action.payload){
                state.group = {
                    ...state.group,
                    boxes: action.payload
                };
            }
        },
        setFields: (state, action) => {
            if(action.payload){
                const {boxId, sortedFields, parentFieldId, parentBlockId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;

                // Replace only the fields matching the given parent scope
                const otherFields = state.group.boxes[boxIndex].fields.filter(f => {
                    if(parentBlockId) return f.blockId !== parentBlockId;
                    if(parentFieldId) return !(f.parentId === parentFieldId && !f.blockId);
                    // Root level: keep nested fields, replace root ones
                    return !!(f.parentId || f.blockId);
                });

                state.group.boxes[boxIndex].fields = [...otherFields, ...sortedFields];
            }
        },
        setOptions: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, sortedOptions} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const field = state.group.boxes[boxIndex].fields.find(f => f.id === fieldId);
                if(field){
                    field.options = sortedOptions;
                }
            }
        },
        showElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                state.closedElements =  state.closedElements.filter((e) => e !== id);
            }
        },
        updateField: (state, action) => {
            if(action.payload){
                const {field, boxId} = action.payload;
                const boxIndex = state.group.boxes.findIndex((b) => b.id === boxId);
                if(boxIndex === -1) return;
                const fieldIndex = state.group.boxes[boxIndex].fields.findIndex(f => f.id === field.id);
                if(fieldIndex !== -1){
                    state.group.boxes[boxIndex].fields[fieldIndex] = {
                        ...state.group.boxes[boxIndex].fields[fieldIndex],
                        ...field
                    };
                }
            }
        },
        unsetActiveBox: (state) => {
            state.activeBox = null;
        },
        unsetActiveElement: (state) => {
            state.activeElement = null;
        },
        moveField: (state, action) => {
            if(action.payload){
                const {fieldId, fromBoxId, toBoxId, insertBeforeFieldId} = action.payload;
                const fromBox = state.group.boxes.find(b => b.id === fromBoxId);
                const toBox   = state.group.boxes.find(b => b.id === toBoxId);
                if(!fromBox || !toBox) return;
                const field = fromBox.fields.find(f => f.id === fieldId);
                if(!field) return;
                fromBox.fields = fromBox.fields.filter(f => f.id !== fieldId);
                if(insertBeforeFieldId){
                    const idx = toBox.fields.findIndex(f => f.id === insertBeforeFieldId);
                    if(idx !== -1){
                        toBox.fields.splice(idx, 0, field);
                    } else {
                        toBox.fields.push(field);
                    }
                } else {
                    toBox.fields.push(field);
                }
            }
        },
    }
});

export const {
    addBelong,
    addBlock,
    addBox,
    addBoxConditionalRenderingElement,
    addField,
    addOption,
    addConditionalRenderingElement,
    addValidationRule,
    addPermission,
    duplicateBox,
    duplicateField,
    deleteAllBoxes,
    deleteBelong,
    deleteBlock,
    deleteBox,
    deleteBoxConditionalRenderingElement,
    deleteConditionalRenderingElement,
    deleteField,
    deleteOption,
    deleteValidationRule,
    deletePermission,
    deselectAllElements,
    hideElement,
    hydrateState,
    moveField,
    setActiveBox,
    setActiveElement,
    setBlocks,
    setBoxes,
    setFields,
    setOptions,
    showElement,
    updateField,
    unsetActiveBox,
    unsetActiveElement
} = metaStateSlice.actions;

export default metaStateSlice.reducer
import {createSlice} from '@reduxjs/toolkit';
import {cloneBox, cloneField} from "../../utils/cloners";
import {
    appendBoxElement,
    deleteBoxElement,
    getElementIds,
    updateBoxElement,
    updateBoxSortedElements
} from "../../utils/fields";
import {savedIsClosed} from "../../utils/localStorage";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    group: {},
    activeElement: null,
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
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = appendBoxElement(state.group.boxes, boxId, block,  parentFieldId, "blocks");
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
        addField: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, parentBlockId, field} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                const parentElementId = () => {
                    if(parentBlockId){
                        return parentBlockId;
                    }

                    if(parentFieldId){
                        return parentFieldId;
                    }

                    return null;
                };

                const key = () => {
                    if(parentBlockId){
                        return "fields";
                    }

                    if(parentFieldId){
                        return "children";
                    }

                    return "fields";
                };

                state.activeElement = field.id;
                state.group.boxes[boxIndex] = appendBoxElement(state.group.boxes, boxId, field,  parentElementId(), key());
            }
        },
        addOption: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, option} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = appendBoxElement(state.group.boxes, boxId, option, fieldId, "options");
            }
        },
        addConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, element} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = appendBoxElement(state.group.boxes, boxId, element, fieldId, "visibilityConditions");
            }
        },
        addValidationRule: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, rule} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = appendBoxElement(state.group.boxes, boxId, rule, fieldId, "validationRules");
            }
        },
        deleteAllBoxes: (state) => {
            state.group = {
                ...state.group,
                activeElement: null,
                boxes: []
            };
        },
        deleteBelong: (state, action) => {
            if(action.payload){
                const {belongId} = action.payload;

                state.group.belongs = state.group.belongs.filter((b) => b.id !== belongId);
            }
        },
        deleteBlock: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, blockId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.selectedElements = [];
                state.selectedElementsType = null;
                state.group.boxes[boxIndex] = deleteBoxElement(state.group.boxes, boxId, blockId, parentFieldId, "blocks");
            }
        },
        deleteBox: (state, action) => {
            if(action.payload){
                state.group = {
                    ...state.group,
                    boxes: state.group.boxes.filter((b) => b.id !== action.payload)
                };

                state.selectedElements = [];
                state.selectedElementsType = null;
            }
        },
        deleteConditionalRenderingElement: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, elementId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = deleteBoxElement(state.group.boxes, boxId, elementId, fieldId, "visibilityConditions");
            }
        },
        deleteField: (state, action) => {
            if(action.payload){
                const {boxId, parentFieldId, parentBlockId, fieldId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                const parentElementId = () => {
                    if(parentBlockId){
                        return parentBlockId;
                    }

                    if(parentFieldId){
                        return parentFieldId;
                    }

                    return null;
                };

                const key = () => {
                    if(parentBlockId){
                        return "fields";
                    }

                    if(parentFieldId){
                        return "children";
                    }

                    return "fields";
                };

                if(state.activeElement === fieldId){
                    state.activeElement = null;
                }

                state.selectedElements = [];
                state.selectedElementsType = null;
                state.group.boxes[boxIndex] = deleteBoxElement(state.group.boxes, boxId, fieldId, parentElementId(), key());
            }
        },
        deleteOption: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, optionId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = deleteBoxElement(state.group.boxes, boxId, optionId, fieldId, "options");
            }
        },
        deleteValidationRule: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, parentFieldId, ruleId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = deleteBoxElement(state.group.boxes, boxId, ruleId, fieldId, "validationRules");
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
            state.selectedElementsType = null;
        },
        hideAll: (state, action) => {
            const ids = getElementIds(state.group.boxes);
            ids.map((id) => {
                state.closedElements.push(id);
            });
        },
        hideElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                state.closedElements.push(id);
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
                const {...box} =  state.group.boxes.filter((b) => b.id === boxId)[0];
                box.fields.push(cloneField(boxId, field));
                state.group.boxes[boxIndex] = box;
            }
        },
        hydrateState: (state, action) => {
            if(action.payload){
                state.group = action.payload;

                const ids = getElementIds(state.group.boxes);
                ids.map((id) => {
                    if(savedIsClosed(id) && !state.closedElements.includes(id)){
                        state.closedElements.push(id);
                    }
                });
            }
        },
        setActiveElement: (state,action) => {
            if(action.payload){
                const {fieldId} = action.payload;
                state.activeElement = fieldId;
            }
        },
        setBlocks: (state, action) => {
            if(action.payload){
                const {boxId, sortedBlocks, parentFieldId} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = updateBoxSortedElements(state.group.boxes, boxId, sortedBlocks, parentFieldId, 'blocks');
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
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                const parentElementId = () => {
                    if(parentBlockId){
                        return parentBlockId;
                    }

                    if(parentFieldId){
                        return parentFieldId;
                    }

                    return null;
                };

                const key = () => {
                    if(parentBlockId){
                        return "fields";
                    }

                    if(parentFieldId){
                        return "children";
                    }

                    return "fields";
                };

                state.group.boxes[boxIndex] = updateBoxSortedElements(state.group.boxes, boxId, sortedFields, parentElementId(), key());
            }
        },
        setOptions: (state, action) => {
            if(action.payload){
                const {boxId, fieldId, sortedOptions} = action.payload;
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = updateBoxSortedElements(state.group.boxes, boxId, sortedOptions, fieldId, 'options');
            }
        },
        selectElement: (state, action) => {
            if(action.payload){
                const {element, selected, type} = action.payload;

                if(selected === true){
                    state.selectedElements.push(element);
                } else {
                    state.selectedElements = state.selectedElements.filter(e => e.id !== element.id);
                }

                if(state.selectedElements.length > 0){
                    state.selectedElementsType = type;
                } else {
                    state.selectedElementsType = null;
                }
            }
        },
        showAll: (state, payload) => {
            state.closedElements = [];
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
                const boxIndex =  state.group.boxes.findIndex((b) => b.id === boxId);

                state.group.boxes[boxIndex] = updateBoxElement(state.group.boxes, boxId, field);
            }
        },
        unsetActiveElement: (state, action) => {
            state.activeElement = null;
        }
    }
});

export const {
    addBelong,
    addBlock,
    addBox,
    addField,
    addOption,
    addConditionalRenderingElement,
    addValidationRule,
    duplicateBox,
    duplicateField,
    deleteAllBoxes,
    deleteBelong,
    deleteBlock,
    deleteBox,
    deleteConditionalRenderingElement,
    deleteField,
    deleteOption,
    deleteValidationRule,
    deselectAllElements,
    hideAll,
    hideElement,
    hydrateState,
    setActiveElement,
    setBlocks,
    setBoxes,
    setFields,
    setOptions,
    selectElement,
    showElement,
    showAll,
    updateField,
    unsetActiveElement
} = metaStateSlice.actions;

export default metaStateSlice.reducer
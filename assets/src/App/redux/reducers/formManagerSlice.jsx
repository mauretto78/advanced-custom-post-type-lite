import {createSlice} from '@reduxjs/toolkit';
import {randomAlphabeticString} from "../../utils/strings";
import {v4 as uuidv4} from "uuid";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    elements: [],
    activeElement: null
};

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const formManagerSlice = createSlice({
    name: 'formManager',
    initialState,
    reducers: {
        addElement: (state, action) => {
            if(action.payload){
                const {element, position} = action.payload;

                /**
                 *
                 * @return {boolean}
                 */
                const canAddThisElement = () => {

                    if(element.field.isReusable === true){
                        return true;
                    }

                    // if the element is not reusable and is already on canvas do nothing
                    return state.elements.findIndex(el => el.field.name === element.field.name) === -1;
                };

                if(canAddThisElement()){
                    const newElement = () => {
                        const copiedField = {...element.field};
                        copiedField.id = uuidv4();
                        const newElement = {...element};
                        newElement.field = copiedField;
                        newElement.id = randomAlphabeticString(8);

                        return newElement;
                    };

                    if(position && position !== 'canvas-drop-area'){
                        const positions = position.split("-");
                        const targetId = positions[0];
                        const targetPosition = positions[1];
                        const targetIndex = state.elements.findIndex(elements => elements.id === targetId);
                        let newIndex = (targetPosition === 'top' || targetPosition === 'left') ? targetIndex-1 : targetIndex+1;
                        newIndex = (newIndex === -1) ? 0 : newIndex;

                        state.elements = [...state.elements.slice(0, newIndex), newElement(), ...state.elements.slice(newIndex, state.elements.length)];
                    } else {
                        state.elements.push(newElement());
                    }
                }
            }
        },
        addOption: (state, action) => {
            if(action.payload){
                const {elementId, label, value} = action.payload;
                const elementIndex =  state.elements.findIndex(el => el.id === elementId);

                const addNewOption = (elements, index) => {
                    const option = {
                        id: uuidv4(),
                        label: label ? label : "label",
                        value: value ? value : "value",
                    };

                    if(!elements[index].field.extra.options){
                        elements[index].field.extra.options = [];
                    }

                    elements[index].field.extra.options.push(option);

                    return elements[index];
                };

                state.elements[elementIndex] = addNewOption(state.elements, elementIndex);
            }
        },
        addValidationRule: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                const elementIndex =  state.elements.findIndex(el => el.id === id);

                const addValidationRule = (elements, index) => {
                    const rule = {
                        id: uuidv4(),
                        condition: "=",
                        value: "123",
                        message: "Value is not equal to {{v}}"
                    };

                    if(!elements[index].validationRules){
                        elements[index].validationRules = [];
                    }

                    elements[index].validationRules.push(rule);

                    return elements[index];
                };

                state.elements[elementIndex] = addValidationRule(state.elements, elementIndex);
            }
        },
        copyElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                const element = state.elements.filter(el => el.id === id);

                if(element.length === 1){

                    const newElement = () => {
                        const copiedField = {...element[0].field};
                        copiedField.id = uuidv4();
                        const newElement = {...element[0]};
                        newElement.field = copiedField;
                        newElement.id = randomAlphabeticString(8);

                        return newElement;
                    };

                    state.elements.push(newElement());
                }
            }
        },
        deleteElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;

                state.elements = state.elements.filter(el => el.id !== id);
                state.activeElement = null;
            }
        },
        deleteOption: (state, action) => {
            if(action.payload){
                const {id, elementId} = action.payload;
                const elementIndex =  state.elements.findIndex(el => el.id === elementId);

                const deleteFieldOption = (elements, index, id) => {
                    elements[elementIndex].field.extra.options = elements[index].field.extra.options.filter(o => o.id !== id);

                    return elements[elementIndex];
                };

                state.elements[elementIndex] = deleteFieldOption(state.elements, elementIndex, id);
            }
        },
        deleteValidationRule: (state, action) => {
            if(action.payload){
                const {id, elementId} = action.payload;
                const elementIndex =  state.elements.findIndex(el => el.id === elementId);

                const deleteValidationRule = (elements, index, id) => {
                    elements[index].validationRules = elements[index].validationRules.filter(rule => rule.id !== id);

                    return elements[index];
                };

                state.elements[elementIndex] = deleteValidationRule(state.elements, elementIndex, id);
            }
        },
        hydrateElements: (state, action) => {
            if(action.payload){
                const {elements} = action.payload;

                state.elements = elements;
            }
        },
        setActiveElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                const element = state.elements.filter(el => el.id === id);

                if(element.length === 1){
                    state.activeElement = element[0];
                }
            }
        },
        unsetActiveElement: (state, action) => {
            state.activeElement = null;
        },
        updateElement: (state, action) => {
            if(action.payload){
                const {id, key, value} = action.payload;
                const element = state.elements.filter(el => el.id === id);
                const elementIndex = state.elements.findIndex(el => el.id === id);

                if(element.length === 1){
                    const currentElement = element[0];
                    const currentElementCopy = {...currentElement};
                    currentElementCopy.field[key] = value;
                    state.elements[elementIndex] = currentElementCopy;
                }
            }
        },
        updateElementExtra: (state, action) => {
            if(action.payload){
                const {id, key, value} = action.payload;
                const element = state.elements.filter(el => el.id === id);
                const elementIndex = state.elements.findIndex(el => el.id === id);

                if(element.length === 1){
                    const currentElement = element[0];
                    const currentElementCopy = {...currentElement};
                    currentElementCopy.field.extra[key] = value;
                    state.elements[elementIndex] = currentElementCopy;
                }
            }
        },
        updateSettings: (state, action) => {
            if(action.payload){
                const {id, key, value} = action.payload;
                const element = state.elements.filter(el => el.id === id);
                const elementIndex = state.elements.findIndex(el => el.id === id);

                if(element.length === 1){
                    const currentElement = element[0];
                    currentElement.settings[key] = value;
                    state.elements[elementIndex] = currentElement;
                }
            }
        },
        updateRequiredRule: (state, action) => {
            if(action.payload){
                const {id, value} = action.payload;
                const element = state.elements.filter(el => el.id === id);
                const elementIndex = state.elements.findIndex(el => el.id === id);

                if(element.length === 1){
                    const currentElement = element[0];
                    currentElement.field.isRequired = value;
                    state.elements[elementIndex] = currentElement;
                }
            }
        },
        updateOption: (state, action) => {
            if(action.payload){
                const {elementId, optionIndex, option} = action.payload;
                const elementIndex = state.elements.findIndex(el => el.id === elementId);

                const updateFieldOption = (elements, elementIndex, optionIndex, option) => {
                    elements[elementIndex].field.extra.options[optionIndex] = option;

                    return elements[elementIndex];
                };

                state.elements[elementIndex] = updateFieldOption(state.elements, elementIndex, optionIndex, option);
            }
        },
        updateValidationRule: (state, action) => {
            if(action.payload){
                const {elementId, ruleIndex, rule} = action.payload;
                const elementIndex = state.elements.findIndex(el => el.id === elementId);

                const updateValidationRule = (elements, elementIndex, ruleIndex, rule) => {
                    elements[elementIndex].validationRules[ruleIndex] = rule;

                    return elements[elementIndex];
                };

                state.elements[elementIndex] = updateValidationRule(state.elements, elementIndex, ruleIndex, rule);
            }
        },
    }
});

export const {
    addElement,
    addOption,
    addValidationRule,
    copyElement,
    deleteElement,
    deleteOption,
    deleteValidationRule,
    hydrateElements,
    setActiveElement,
    unsetActiveElement,
    updateElement,
    updateElementExtra,
    updateSettings,
    updateRequiredRule,
    updateOption,
    updateValidationRule
} = formManagerSlice.actions;

export default formManagerSlice.reducer
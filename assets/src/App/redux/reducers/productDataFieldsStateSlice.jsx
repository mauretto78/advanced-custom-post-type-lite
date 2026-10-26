import {createSlice} from "@reduxjs/toolkit";
import {getElementIds} from "../../utils/fields";
import {savedIsClosed} from "../../utils/localStorage";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    fields: [],
    activeElement: null,
    selectedElements: [],
    closedElements: []
};

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const productDataFieldsStateSlice = createSlice({
    name: 'wc/product-data/fields/state',
    initialState,
    reducers: {
        addField: (state, action) => {
            if(action.payload){
                const {field} = action.payload;

                state.fields.push(field);
            }
        },
        addOption: (state, action) => {
            if(action.payload){
                const {fieldIndex, option} = action.payload;
                if(!state.fields[fieldIndex]) return;

                if(!state.fields[fieldIndex].options){
                    state.fields[fieldIndex].options = [];
                }

                state.fields[fieldIndex].options.push(option);
            }
        },
        deleteAllFields: (state) => {
            state.fields = [];
            state.activeElement = null;
            state.selectedElements = [];
        },
        deleteField: (state, action) => {
            if(action.payload){
                const {field} = action.payload;

                state.fields = state.fields.filter(p => p.id !== field.id);

                if(state.activeElement?.id === field.id){
                    state.activeElement = null;
                }
            }
        },
        deleteOption: (state, action) => {
            if(action.payload){
                const {fieldIndex, optionIndex} = action.payload;
                if(!state.fields[fieldIndex] || !state.fields[fieldIndex].options) return;

                state.fields[fieldIndex].options.splice(optionIndex, 1);
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
        },
        hideAll: (state, action) => {
            const ids = getElementIds(state.fields);
            ids.map((id) => {
                if(!state.closedElements.includes(id)){
                    state.closedElements.push(id);
                }
            });
        },
        hideElement: (state, action) => {
            if(action.payload){
                const {id} = action.payload;

                if(!state.closedElements.includes(id)){
                    state.closedElements.push(id);
                }
            }
        },
        hydrateState: (state, action) => {
            if(action.payload){
                state.fields = action.payload;

                const ids = getElementIds(state.fields);
                ids.map((id) => {
                    if(savedIsClosed(id) && !state.closedElements.includes(id)){
                        state.closedElements.push(id);
                    }
                });
            }
        },
        selectElement: (state, action) => {
            if(action.payload){
                const {element, selected} = action.payload;

                if(selected === true){
                    if(!state.selectedElements.some(e => e.id === element.id)){
                        state.selectedElements.push(element);
                    }
                } else {
                    state.selectedElements = state.selectedElements.filter(e => e.id !== element.id);
                }
            }
        },
        setFields: (state, action) => {
            if(action.payload){
                // Support both {fields: [...]} wrapper (canvas UI) and direct array (legacy)
                const fields = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.fields;
                state.fields = fields;
            }
        },
        setActiveElement: (state, action) => {
            state.activeElement = action.payload?.field ?? null;
        },
        unsetActiveElement: (state) => {
            state.activeElement = null;
        },
        setOptions: (state, action) => {
            if(action.payload){
                const {fieldIndex, sortedOptions} = action.payload;
                if(!state.fields[fieldIndex]) return;

                state.fields[fieldIndex].options = sortedOptions;
            }
        },
        updateField: (state, action) => {
            if(action.payload){
                const {field} = action.payload;
                const fieldIndex = state.fields.findIndex((f) => f.id === field.id);

                if(fieldIndex !== -1){
                    state.fields[fieldIndex] = field;
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
    }
});

export const {
    addField,
    addOption,
    deleteAllFields,
    deleteField,
    deleteOption,
    deselectAllElements,
    hideAll,
    hideElement,
    hydrateState,
    selectElement,
    setActiveElement,
    setFields,
    setOptions,
    showElement,
    showAll,
    unsetActiveElement,
    updateField,
} = productDataFieldsStateSlice.actions;

export default productDataFieldsStateSlice.reducer
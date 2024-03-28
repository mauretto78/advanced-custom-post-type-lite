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

                if(!state.fields[fieldIndex].options){
                    state.fields[fieldIndex].options = [];
                }

                state.fields[fieldIndex].options.push(option);
            }
        },
        deleteAllFields: (state) => {
            state.fields = [];
        },
        deleteField: (state, action) => {
            if(action.payload){
                const {field} = action.payload;

                state.fields = state.fields.filter(p => p.id !== field.id);
            }
        },
        deleteOption: (state, action) => {
            if(action.payload){
                const {fieldIndex, optionIndex} = action.payload;

                state.fields[fieldIndex].options.splice(optionIndex, 1);
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
        },
        hideAll: (state, action) => {
            const ids = getElementIds(state.fields);
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
        hydrateState: (state, action) => {
            if(action.payload){
                state.fields = action.payload;

                const ids = getElementIds(state.fields);
                ids.map((id) => {
                    if(savedIsClosed(id)){
                        state.closedElements.push(id);
                    }
                });
            }
        },
        selectElement: (state, action) => {
            if(action.payload){
                const {element, selected} = action.payload;

                if(selected === true){
                    state.selectedElements.push(element);
                } else {
                    state.selectedElements = state.selectedElements.filter(e => e.id !== element.id);
                }
            }
        },
        setFields: (state, action) => {
            if(action.payload){
                state.fields = action.payload;
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
    setFields,
    showElement,
    showAll,
} = productDataFieldsStateSlice.actions;

export default productDataFieldsStateSlice.reducer
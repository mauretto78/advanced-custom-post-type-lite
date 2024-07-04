import {createSlice} from '@reduxjs/toolkit';

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    items: [],
    selectedElements: [],
};

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const datasetStateSlice = createSlice({
    name: 'datasetState',
    initialState,
    reducers: {
        addItem: (state, action) => {
            if(action.payload){
                if(!state.items){
                    state.items = [];
                }

                state.items = [...state.items, action.payload];
            }
        },
        deleteAll: (state, action) => {
            state.items = [];
            state.selectedElements = [];
        },
        deleteItem: (state, action) => {
            if(action.payload){
                const {id} = action.payload;
                state.items = state.items.filter((i) => i.id !== id);
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
        },
        hydrateState: (state, action) => {
            if(action.payload){
                state.items = action.payload;
            }
        },
        selectAllElements: (state, action) => {
            state.selectedElements = state.items;
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
        setItems: (state, action) => {
            if(action.payload){
                state.items = action.payload;
            }
        },
    }
});

export const {
    addItem,
    deleteAll,
    deleteItem,
    deselectAllElements,
    hydrateState,
    setItems,
    selectAllElements,
    selectElement
} = datasetStateSlice.actions;

export default datasetStateSlice.reducer
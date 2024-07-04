import {createSlice} from "@reduxjs/toolkit";
import {getElementIds} from "../../utils/fields";
import {savedIsClosed} from "../../utils/localStorage";

/**
 * ****************************************************
 * Initial state
 * ****************************************************
 */
const initialState = {
    pages: [],
    selectedElements: [],
    closedElements: []
};

/**
 * ****************************************************
 * Reducer logic
 * ****************************************************
 */

export const optionPagesStateSlice = createSlice({
    name: 'option-pages/state',
    initialState,
    reducers: {
        addPage: (state, action) => {
            if(action.payload){
                const {page} = action.payload;

                if(page.parentId){
                    const parentPageIndex = state.pages.findIndex(p => p.id === page.parentId);
                    state.pages[parentPageIndex].children.push(page);
                } else {
                    state.pages.push(page);
                }
            }
        },
        deleteAllPages: (state) => {
            state.pages = [];
        },
        deletePage: (state, action) => {
            if(action.payload){
                const {page} = action.payload;

                if(page.parentId){
                    const parentPageIndex = state.pages.findIndex(p => p.id === page.parentId);
                    state.pages[parentPageIndex].children = state.pages[parentPageIndex].children.filter(c => c.id !== page.id);
                } else {
                    state.pages = state.pages.filter(p => p.id !== page.id);
                }
            }
        },
        deselectAllElements: (state, action) => {
            state.selectedElements = [];
        },
        hideAll: (state, action) => {
            const ids = getElementIds(state.pages);
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
                state.pages = action.payload;

                const ids = getElementIds(state.pages);
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
        setPages: (state, action) => {
            if(action.payload){
                state.pages = action.payload;
            }
        },
        setChildrenPages: (state, action) => {
            if(action.payload){
                const {parentPageIndex, sortedPages} = action.payload;
                state.pages[parentPageIndex].children = sortedPages;
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
    addPage,
    deleteAllPages,
    deletePage,
    deselectAllElements,
    hideAll,
    hideElement,
    hydrateState,
    selectElement,
    setPages,
    setChildrenPages,
    showElement,
    showAll,
} = optionPagesStateSlice.actions;

export default optionPagesStateSlice.reducer
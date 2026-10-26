import {localStorageVars} from "../constants/localStorage";
import {arrayUnique} from "./objects";

/**
 *
 * @param belongsTo
 * @return {any}
 */
export const hiddenElements = (belongsTo) => {
    if(typeof belongsTo !== 'string' || !belongsTo){
        return [];
    }

    const key = localStorageVars.HIDDEN_ELEMENTS + "_" + belongsTo;

    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

/**
 *
 * @param id
 * @param belongsTo
 * @return {*}
 */
export const restoreHiddenElement = (id, belongsTo) => {
    if(id === null || id === undefined || id === '' || typeof belongsTo !== 'string' || !belongsTo){
        return;
    }

    const elements = hiddenElements(belongsTo);
    const key = localStorageVars.HIDDEN_ELEMENTS + "_" + belongsTo;

    if(!elements.includes(id)){
        return;
    }

    const index = elements.indexOf(id);
    if (index > -1) {
        elements.splice(index, 1);
    }

    localStorage.setItem(key, JSON.stringify(elements));
};

/**
 *
 * @param id
 * @param belongsTo
 * @returns {*}
 */
export const isElementHidden = (id, belongsTo) => {
    if(id === null || id === undefined || id === '' || typeof belongsTo !== 'string' || !belongsTo){
        return false;
    }

    const elements = hiddenElements(belongsTo);

    return elements.includes(id);
};

/**
 * Hides an element by adding its identifier to a list of hidden elements
 * associated with a specific group and persisting the updated list in local storage.
 *
 * @param {string} id - The unique identifier of the element to hide.
 * @param {string} belongsTo - The group or context to which the element belongs.
 */
export const hideElement = (id, belongsTo) => {
    if(id === null || id === undefined || id === '' || typeof belongsTo !== 'string' || !belongsTo){
        return;
    }

    const elements = hiddenElements(belongsTo);
    const key = localStorageVars.HIDDEN_ELEMENTS + "_" + belongsTo;
    elements.push(id);
    localStorage.setItem(key, JSON.stringify(elements));
}

/**
 * Hides specified elements by storing them in local storage.
 *
 * This function processes the input `data` object to determine which elements should be hidden.
 * It checks if the `belongsTo` and `elements` properties are provided in the `data`.
 * The function merges the elements that need to be hidden with previously saved elements,
 * and stores the updated list in local storage under a unique key derived from the `belongsTo` property.
 *
 * @param {Object} data - The input data containing information about elements to be hidden.
 * @param {string} data.belongsTo - A unique identifier used to associate the hidden elements with a specific owner or category.
 * @param {Object} data.elements - A set of key-value pairs where keys represent element identifiers and values indicate whether the element should be hidden (`true`) or not (`false`).
 */
export const hideElements = (data) => {

    if(!data){
        return;
    }

    if(typeof data.belongsTo !== 'string' || !data.belongsTo){
        return;
    }

    if(!data.elements){
        return;
    }

    const belongsTo = data.belongsTo;
    const elements = data.elements;
    const key = localStorageVars.HIDDEN_ELEMENTS + "_" + belongsTo;

    let toBeHidden = [];

    // saved elements
    const savedElements = hiddenElements(belongsTo);

    // loop elements
    for (const [key, value] of Object.entries(elements)) {
        if(value === true){
            toBeHidden.push(key);
        }
    }

    const mergedElements = arrayUnique([...savedElements, ...toBeHidden]);

    localStorage.setItem(key, JSON.stringify(mergedElements));
};

/**
 * Checks whether a specific element, identified by its ID, is marked as closed or hidden in the application's saved visibility state.
 *
 * This function retrieves a visibility state array from the browser's `localStorage` and determines if the given element ID exists within that array.
 * It returns `false` if the provided `elementId` is `null`, `undefined`, or an empty string, or if the visibility state array does not contain the specified ID.
 *
 * @param {string|null|undefined} elementId - The unique identifier of the element to check.
 * @returns {boolean} - Returns `true` if the element ID exists in the saved visibility state, indicating it is closed; otherwise, returns `false`.
 */
export const savedIsClosed = (elementId) => {
    if(elementId === null || elementId === undefined || elementId === ''){
        return false;
    }

    const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
    const indexOf = visibilityState.indexOf(elementId);

    return indexOf !== -1;
};

/**
 *
 * @param elementId
 */
export const saveIsClosed = (elementId) => {
    if(elementId === null || elementId === undefined || elementId === ''){
        return;
    }

    const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
    const indexOf = visibilityState.indexOf(elementId);
    const savedIsClosed = indexOf !== -1;

    if(savedIsClosed){
        visibilityState.splice(indexOf, 1);
    } else {
        visibilityState.push(elementId);
    }

    localStorage.setItem(localStorageVars.META_ELEMENTS_VISIBILITY, JSON.stringify(visibilityState));
};

/**
 * Removes the specified element ID from the list of meta element visibility states stored in local storage.
 * This function ensures that the given element ID is no longer marked as visible.
 *
 * @param {string} elementId - The ID of the element to be removed from the visibility state.
 *                              If the parameter is null, undefined, or an empty string, the function will return without performing any action.
 */
export const releaseSaveIsClosed = (elementId) => {

    if(elementId === null || elementId === undefined || elementId === ''){
        return;
    }

    const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
    const indexOf = visibilityState.indexOf(elementId);

    if(indexOf !== -1){
        visibilityState.splice(indexOf, 1);
    }

    localStorage.setItem(localStorageVars.META_ELEMENTS_VISIBILITY, JSON.stringify(visibilityState));
};

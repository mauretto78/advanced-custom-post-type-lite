import {localStorageVars} from "../constants/localStorage";
import {arrayUnique} from "./objects";

/**
 *
 * @param belongsTo
 * @return {any}
 */
export const hiddenElements = (belongsTo) => {
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
 * @return {*}
 */
export const isElementHidden = (id, belongsTo) => {
    const elements = hiddenElements(belongsTo);

    return elements.includes(id);
};

/**
 *
 * @param data
 */
export const hideElements = (data) => {

    if(!data.belongsTo){
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
 *
 * @return {string}
 */
export const savedView = (id) => {

    const savedSwitchView = localStorage.getItem(localStorageVars.META_VIEW) ? JSON.parse(localStorage.getItem(localStorageVars.META_VIEW)).filter((i) => i.id === id) : [];

    if(savedSwitchView && savedSwitchView.length === 1 && savedSwitchView[0].view === 'tabular'){
        return 'tabular';
    }

    if(savedSwitchView && savedSwitchView.length === 1 && savedSwitchView[0].view === 'accordion'){
        return 'accordion';
    }

    return 'list';
};

/**
 *
 * @param elementId
 * @return {boolean}
 */
export const savedIsClosed = (elementId) => {
    const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
    const indexOf = visibilityState.indexOf(elementId);

    return indexOf !== -1;
};

/**
 *
 * @param elementId
 */
export const saveIsClosed = (elementId) => {

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

export const saveCloseAll = (elementIds) => {
    elementIds.map((elementId) => {
        const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
        const indexOf = visibilityState.indexOf(elementId);
        const savedIsClosed = indexOf !== -1;

        if(!savedIsClosed){
            visibilityState.push(elementId);
        }

        localStorage.setItem(localStorageVars.META_ELEMENTS_VISIBILITY, JSON.stringify(visibilityState));
    });
};

export const saveShowAll = (elementIds) => {
    elementIds.map((elementId) => {
        const visibilityState = localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY) ? JSON.parse(localStorage.getItem(localStorageVars.META_ELEMENTS_VISIBILITY)) : [];
        const indexOf = visibilityState.indexOf(elementId);
        const savedIsClosed = indexOf !== -1;

        if(savedIsClosed){
            visibilityState.splice(indexOf, 1);
        }

        localStorage.setItem(localStorageVars.META_ELEMENTS_VISIBILITY, JSON.stringify(visibilityState));
    });
};

export const toggleNavigation = (id, checked) => {
    const value = checked ? "1" : "0";
    localStorage.setItem(localStorageVars.TOGGLE_NAVIGATION+"_"+id, value);
};

/**
 *
 * @param id
 * @return {boolean}
 */
export const isNavigationEnabled = (id) => {
    const isEnabled = localStorage.getItem(localStorageVars.TOGGLE_NAVIGATION+"_"+id) ? localStorage.getItem(localStorageVars.TOGGLE_NAVIGATION+"_"+id) : "0";

    return isEnabled === "1";
};
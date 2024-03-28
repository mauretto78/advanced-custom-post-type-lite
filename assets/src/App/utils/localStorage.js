import {localStorageVars} from "../constants/localStorage";

/**
 *
 * @return {string}
 */
export const savedView = (id) => {

    const savedSwitchView = localStorage.getItem(localStorageVars.META_VIEW) ? JSON.parse(localStorage.getItem(localStorageVars.META_VIEW)).filter((i) => i.id === id) : [];

    if(savedSwitchView && savedSwitchView.length === 1 && savedSwitchView[0].view === 'tabular'){
        return 'tabular';
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
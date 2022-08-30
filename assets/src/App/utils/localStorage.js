
const keyInLocalStorage = (id) => {
    return `acpt_element_closed_${id}`;
};

/**
 *
 * @param id
 * @param isVisible
 */
export const saveMetaIsClosed = (id, isVisible) => {

    const value = isVisible ? "1" : "0";

    localStorage.setItem(keyInLocalStorage(id), value );
};

/**
 *
 * @param id
 * @returns {boolean}
 */
export const isMetaClosed = (id) => {
    return localStorage.getItem(keyInLocalStorage(id)) === "0";
};
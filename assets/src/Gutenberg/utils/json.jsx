/**
 * Checks if a given string is a valid JSON string.
 *
 * This function verifies if the input is a string and attempts to
 * parse it as JSON. If parsing succeeds without throwing an error,
 * the input is considered a valid JSON string.
 *
 * @param {string} str - The string to be checked for JSON validity.
 * @returns {boolean} - Returns true if the input is a valid JSON string,
 * otherwise false.
 */
export const isJsonString = (str) => {

    if(typeof str !== 'string' || str.length === 0){
        return false;
    }

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
};
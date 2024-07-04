/**
 *
 * @param str
 * @return {boolean}
 */
export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
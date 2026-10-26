/**
 * Determines whether a specific value (needle) exists within an array (haystack).
 *
 * @param {*} needle - The value to search for within the array.
 * @param {Array} haystack - The array in which to search for the specified value.
 * @returns {boolean} Returns true if the value is found in the array, otherwise false.
 */
export const inArray = (needle, haystack) => {
    const length = haystack.length;
    for( let i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }

    return false;
};

/**
 * Checks if the given object is empty.
 *
 * Determines whether the input object is considered empty based on the following conditions:
 * 1. Returns true if the object is `null`.
 * 2. Returns true if the object is `undefined`.
 * 3. Returns false if the object is not of type 'object'.
 * 4. For objects, returns true if the object's length is zero as determined by the `objLength` function.
 *
 * @param {any} obj - The object to be checked for emptiness.
 * @returns {boolean} - Returns true if the object is empty, otherwise false.
 */
export const isEmpty = (obj) => {

    if(null === obj){
        return true;
    }

    if(obj === undefined){
        return true;
    }

    if(typeof obj !== 'object'){
        return false;
    }

    return objLength(obj) === 0;
};

/**
 * Calculates the number of own enumerable properties in an object.
 *
 * This function takes an input and determines the total number of direct
 * properties that the object has, excluding inherited properties. If the
 * input is not a valid object, or if the object is null, undefined, or empty,
 * the function returns 0.
 *
 * @param {object} obj - The object whose properties are to be counted.
 * @returns {number} The number of own enumerable properties in the object.
 */
export const objLength = (obj) => {

    if(obj === null){
        return 0;
    }

    if(obj === undefined){
        return 0;
    }

    if(typeof obj !== 'object'){
        return 0;
    }

    if(!Object.keys(obj)){
        return 0;
    }

    return Object.keys(obj).length;
};

/**
 * Checks whether a specified key exists in an object and is not undefined.
 *
 * This function determines if a given `key` exists in the provided `obj`
 * and ensures that `obj[key]` is not strictly `undefined`.
 *
 * If the `obj` parameter is not an object or is undefined, the function
 * will return false. It also safely handles cases where accessing the
 * specified key may throw an error.
 *
 * @param {Object} obj - The object to inspect.
 * @param {string|number|symbol} key - The key to check for existence in the object.
 * @returns {boolean} Returns true if the key exists in the object and is not undefined; otherwise, returns false.
 */
export const isset = (obj, key) => {
    if(typeof obj === 'undefined'){
        return false;
    }

    if(typeof obj !== 'object'){
        return false;
    }

    try {
        return obj[key] !== undefined;
    } catch (e) {
        return false;
    }
};

/**
 * Filters a JSON object array to find and return the first object with a matching 'id' property.
 *
 * @param {Object[]} jsonObject - An array of objects to be filtered. If undefined, an empty object is returned.
 * @param {string | number} id - The value of the 'id' property to match against.
 * @returns {Object} The first object with a matching 'id' property, or an empty object if no match is found.
 */
export const filterById = (jsonObject, id) => {
    if(
        typeof jsonObject === 'undefined' ||
        jsonObject === null ||
        jsonObject === undefined ||
        id === null ||
        id === undefined
    ){
        return {};
    }

    const result = jsonObject.filter((jsonObject) => {
        return (jsonObject['id'] === id);
    });

    if(result.length > 0){
        return result[0];
    }

    return {};
};

/**
 * Filters a JSON object array and returns the first object
 * where the specified label matches the provided value.
 *
 * @param {Object[]} jsonObject - The array of JSON objects to filter.
 * @param {string} label - The key to match within each JSON object.
 * @param {*} value - The value to match against the specified label.
 * @returns {Object} The first matching object or an empty object if no match is found.
 */
export const filterByLabel = (jsonObject, label, value) => {
    if(
        typeof jsonObject === 'undefined' ||
        jsonObject === null ||
        jsonObject === undefined ||
        label === null ||
        label === undefined
    ){
        return {};
    }

    const result = jsonObject.filter((jsonObject) => {
        if(
            typeof jsonObject[label] === 'undefined' ||
            !jsonObject[label]
        ){
            return false;
        }

        return (jsonObject[label] === value);
    });

    if(result.length > 0){
        return result[0];
    }

    return {};
};

/**
 * Filters a JSON object array and retrieves the first object where the 'value' key matches the specified value.
 *
 * @param {Array<Object>} jsonObject - The array of JSON objects to be filtered.
 *                                     If undefined, an empty object is returned.
 * @param {*} value - The value to match against the 'value' key in the objects.
 * @returns {Object} The first object from the array where the 'value' key matches the specified value,
 *                   or an empty object if no match is found or if the input array is undefined.
 */
export const filterByValue = (jsonObject, value) => {
    if(
        typeof jsonObject === 'undefined' ||
        jsonObject === null
    ){
        return {};
    }

    const result = jsonObject.filter((jsonObject) => {return (jsonObject['value'] === value);});

    if(result.length > 0){
        return result[0];
    }

    return {};
};

/**
 *
 * @param array
 * @return {boolean}
 */
export const isArray = (array) => {
    return array instanceof Array;
};

/**
 *
 * @param obj
 * @return {boolean}
 */
export const isIterable = (obj) => {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }

    if(typeof obj !== 'object' && typeof obj !== 'function'){
        return false;
    }

    return typeof obj[Symbol.iterator] === 'function';
};

/**
 * Equivalent of PHP function array_unique
 *
 * @param arr
 * @return {unknown[]}
 */
export const arrayUnique = (arr) => {

    if(!isArray(arr)){
        return [];
    }

    return [...new Set(arr)];
};

/**
 * Converts a JavaScript object to a JSON string with escaped double quotes.
 *
 * This function takes an object as input, converts it to a JSON string using
 * JSON.stringify, and replaces all occurrences of double quotes (") with
 * the HTML entity &quot;. This ensures that the resulting string is safe to
 * use in HTML contexts where double quotes may need to be escaped.
 *
 * @param {Object} object - The object to be converted to a JSON string.
 * @returns {string} A JSON string representation of the object with double
 * quotes escaped as &quot;.
 */
export const objectToEscapedJson = (object) => {

    if(
        typeof object !== 'object' ||
        object === null ||
        object === undefined
    ){
        return '';
    }

    return JSON.stringify(object).replace(/"/g, "&quot;");
};

/**
 * Converts a JSON string with escaped double quotes (&quot;) into a parsed JSON object.
 * The function first replaces all occurrences of &quot; with standard double-quote characters ("),
 * then attempts to parse the resulting string into a JavaScript object.
 *
 * If the input is not a string or if the JSON parsing fails, the function returns null.
 *
 * @param {string} json - The JSON string with escaped double quotes to be processed.
 * @returns {Object|null} The parsed JavaScript object if successful, or null if the input is invalid or parsing fails.
 */
export const escapedJsonToObject = (json) => {

    if(typeof json !== 'string'){
        return null;
    }

    const replaced = json.replaceAll("&quot;", '"');

    try {
        return JSON.parse(replaced);
    } catch (e) {
        return null;
    }
};

/**
 * Used to fetch setting value
 * @param key
 * @param settings
 * @param defaultValue
 * @return {number|*}
 */
export const fetchSettingValue = (key, settings, defaultValue) => {

    if(typeof settings !== 'object' || settings === null){
        return defaultValue;
    }

    if(settings.length === 0){
        return defaultValue;
    }

    if(typeof filterByLabel(settings, 'key', key) === 'undefined'){
        return defaultValue;
    }

    if(isEmpty(filterByLabel(settings, 'key', key))){
        return defaultValue;
    }

    const value = filterByLabel(settings, 'key', key).value;

    if(value === "1"){
        return 1;
    }

    if(value === "0"){
        return 0;
    }

    return value;
};

/**
 * Moves an element within an array from one position to another, creating a new array without mutating the original.
 *
 * @param {Array} arr - The source array.
 * @param {number} from - The index of the element to move.
 * @param {number} to - The target index where the element should be moved.
 * @returns {Array} A new array with the element moved to the specified position.
 */
export const arrayMove = (arr, from, to) => {

    if(!isArray(arr)){
        return [];
    }

    const next = arr.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

export const reorderObjectByIdOrder = (obj, idOrder) => {
    const next = {};
    for (const id of idOrder) {
        if (obj[id] !== undefined) next[id] = obj[id];
    }
    // keep any stragglers that weren’t in the order array (optional)
    for (const id of Object.keys(obj)) {
        if (next[id] === undefined) next[id] = obj[id];
    }
    return next;
};

const UNSAFE_KEYS = ['__proto__', 'prototype', 'constructor'];

/**
 * Sets a nested value within an object at a given path, creating intermediary objects if necessary.
 *
 * Mutates `obj` in place (Immer-draft-safe) and returns nothing. Only creates an intermediary
 * object when the slot is missing or holds a non-object -- an existing object/array in the path
 * is walked into, not overwritten. Path segments `__proto__` / `prototype` / `constructor` are
 * rejected to avoid prototype pollution.
 *
 * @param {Object} obj - The target object in which the value should be set.
 * @param {string} path - The dot-separated string representing the nested path where the value should be set.
 * @param {*} value - The value to set at the specified nested path.
 */
export const setNestedValue = (obj, path, value) => {
    if (obj === null || typeof obj !== 'object' || typeof path !== 'string' || path === '') {
        return;
    }

    const keys = path.split('.');

    if (keys.some(key => UNSAFE_KEYS.includes(key))) {
        return;
    }

    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // Only create a container when the slot can't already be walked into --
        // never clobber a valid falsy value (0, '', false, null) or an existing array.
        if (current[key] === null || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
};

/**
 *
 * @param needle
 * @param haystack
 * @return {boolean}
 */
export const inArray = (needle, haystack) => {
    const length = haystack.length;
    for( let i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }

    return false;
};

/**
 * Check if an object is empty
 * @param obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
    return objLength(obj) === 0;
};

/**
 * Get object length
 * @param obj
 * @returns {number}
 */
export const objLength = (obj) => {
    return Object.keys(obj).length;
};

/**
 *
 * @param obj
 * @param key
 * @returns {boolean}
 */
export const isset = (obj, key) => {
    if(typeof obj === 'undefined'){
        return false;
    }

    return typeof obj[key] !== 'undefined';
};

/**
 * Filter a JSON object (array) by id
 * @param jsonObject
 * @param id
 * @returns {*}
 */
export const filterById = (jsonObject, id) => {
    if(typeof jsonObject === 'undefined'){
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
 * Filter a JSON object (array) by label => value couple
 * @param jsonObject
 * @param label
 * @param value
 * @returns {*}
 */
export const filterByLabel = (jsonObject, label, value) => {
    if(typeof jsonObject === 'undefined'){
        return {};
    }

    const result = jsonObject.filter((jsonObject) => {
        return (jsonObject[label] === value);
    });

    if(result.length > 0){
        return result[0];
    }

    return {};
};

/**
 * Filter a JSON object (array) by value
 * @param jsonObject
 * @param value
 * @returns {{}|*}
 */
export const filterByValue = (jsonObject, value) => {
    if(typeof jsonObject === 'undefined'){
        return {};
    }

    return jsonObject.filter((jsonObject) => {return (jsonObject['value'] === value);})[0];
};

/**
 *
 * @param array
 * @param element
 * @param key
 * @return {*}
 */
export const upsert = (array, element, key) => {

    const i = array.findIndex(_element => _element[key] === element[key]);

    if (i > -1) {
        array[i] = element;
    } else {
        array.push(element);
    }

    return array;
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

    return typeof obj[Symbol.iterator] === 'function';
};

/**
 * Equivalent of PHP function array_unique
 *
 * @param arr
 * @return {unknown[]}
 */
export const arrayUnique = (arr) => {
    return [...new Set(arr)];
};

/**
 *
 * @param object
 * @return {string}
 */
export const objectToEscapedJson = (object) => {
    return JSON.stringify(object).replace(/"/g, "&quot;");
};

/**
 *
 * @param json
 * @return {*}
 */
export const escapedJsonToObject = (json) => {
    return json.replaceAll("&quot;", '"');
};






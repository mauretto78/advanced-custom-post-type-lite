/**
 * Capitalize text
 *
 * @param txt
 * @return {string}
 */
export const capitalizeTxt = (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
};

/**
 * Converts [0,0,20,0,'px'] into 0px 0px 20px 0px
 * @param values
 * @return {string|null}
 */
export const squaresToString = (values) => {

    if(values && typeof values !== 'undefined'){
        return values[0]+values[4]+" "+values[1]+values[4]+" "+values[2]+values[4]+" "+values[3]+values[4];
    }

    return null;
};

/**
 *
 * @param item
 * @param searchTerm
 * @return {boolean}
 */
export const likeThat = (item, searchTerm) => {
    return item.toString().toLowerCase().indexOf(searchTerm.toString().toLowerCase()) > -1;
};

/**
 *
 * @param string
 * @return {*}
 */
export const addSlashes = (string) => {
    return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
};

/**
 *
 * @param string
 * @param maxLength
 * @return {string}
 */
export const sluggifyString = (string, maxLength) => {

    let sanitized = '';

    if(typeof string === 'string'){
        sanitized = string.toLowerCase();
        sanitized = sanitized.replace(" ", "-");
        sanitized = sanitized.replace(/[^a-z0-9_\-]/g, '-');
    }

    return sanitized.substr(0, maxLength ? maxLength : 20);
};

/**
 * Camelize a string
 *
 * @param str
 * @return {*}
 */
export const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
};

/**
 *
 * @param string
 * @param limit
 * @return {*}
 */
export const substring = (string, limit = 60) => {
    return string.substring(0,limit);
};

/**
 *
 * @param uuid
 * @return {*|boolean}
 */
export const isValidUuid = (uuid) => {
    const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    return typeof uuid === 'string' && regex.test(uuid);
};

/**
 *
 * @param str
 * @returns {boolean}
 */
export const isNumeric = (str) => {

    if(typeof str === 'number'){
        return true;
    }

    if(typeof str === 'string'){
        const parsedInt = parseInt(str);

        return isNumeric(parsedInt);
    }

    return false;
};

/**
 *
 * @param str
 * @returns {*}
 */
export const htmlspecialcharsDecode = (str) => {

    let string = str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });

    return string
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
    ;
};

/**
 *
 * @param length
 * @return {string}
 */
export const randomAlphabeticString = (length = 10) => {

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

/**
 *
 * @param regex
 * @param str
 * @return {boolean}
 */
export const pregMatchAll = (regex, str) => {
    return new RegExp(regex,'g').matchAll(str)
};
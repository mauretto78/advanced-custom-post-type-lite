/**
 * Capitalize text
 *
 * @param txt
 * @return {string}
 */
export const capitalizeTxt = (txt) => {
    if (typeof txt !== 'string' || !txt.length) return txt ?? '';
    return txt.charAt(0).toUpperCase() + txt.slice(1);
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
 * Determines whether a given string represents a numeric value.
 *
 * This function checks if the input string can be successfully
 * parsed as a numeric value. It returns false for boolean inputs
 * and only evaluates the numeric nature of non-boolean strings.
 *
 * @param {string} str - The input value to be checked for numeric nature.
 * @returns {boolean} - Returns true if the string represents a numeric value, otherwise false.
 */
export const isStringNumeric = (str) => {
    // Reject booleans
    if (typeof str === 'boolean') return false;

    // Convert to string and replace comma with dot
    const normalized = String(str).trim().replace(',', '.');

    // Check if it's a valid number
    return normalized !== '' && !isNaN(normalized) && !isNaN(parseFloat(normalized));
}

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
 * @param str
 * @return {boolean}
 */
export const isValidJSON = (str) => {
    if (str === null || str === undefined || typeof str !== 'string') return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
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
        return !isNaN(str);
    }

    if(typeof str === 'string'){
        if(str.trim() === ''){
            return false;
        }

        return !isNaN(Number(str));
    }

    return false;
};

/**
 *
 * @param str
 * @returns {*}
 */
export const htmlspecialcharsDecode = (str) => {

    if (typeof str !== 'string') return str ?? '';

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
    return str.matchAll(new RegExp(regex, 'g'));
};

/**
 *
 * @param string
 * @return {*}
 */
export const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string.length) return string ?? '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 *
 * @param string
 * @return {boolean}
 */
export const isValidHttpUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
};

/**
 * Validates that a string is well-formed SVG markup — not just a string
 * that happens to contain the substring "<svg". Parses it as XML and
 * checks both that parsing succeeded (no <parsererror>) and that the
 * document's root element is actually an <svg> tag.
 *
 * @param {string} value
 * @returns {boolean}
 */
export const isValidSvg = (value) => {
    if(typeof value !== 'string' || !value.trim()){
        return false;
    }

    try {
        const doc = new DOMParser().parseFromString(value, 'image/svg+xml');

        if(doc.getElementsByTagName('parsererror').length > 0){
            return false;
        }

        return doc.documentElement.tagName.toLowerCase() === 'svg';
    } catch (e) {
        return false;
    }
};

/**
 * Transform a string HELLO WORLD to Hello World
 * @param str
 * @return {string}
 */
export const titleCase = (str) => {
    if (typeof str !== 'string' || !str.length) return str ?? '';
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
};

/**
 * Sanitizes a given canvas ID by removing specific substrings.
 * This function modifies the canvas ID by stripping out predefined
 * substrings that are not required, resulting in a cleaner identifier.
 *
 * @param {string} id - The canvas ID to sanitize.
 * @returns {string} - The sanitized canvas ID with specific substrings removed.
 */
export const sanitizeCanvasId = (id) => {
    return id
        .replace("canvas-block-", "")
        .replace("-top", "")
        .replace("-left", "")
        .replace("-bottom", "")
        .replace("-right", "")
    ;
};

/**
 * Compares two version strings to determine if the first version is greater than or equal to the second.
 *
 * This function splits the version strings into their numerical components using a period ('.') as the delimiter
 * and compares each corresponding segment of the versions from left to right. If one version is shorter,
 * missing segments are treated as zero.
 *
 * @param {string|number} version - The version string or number to compare (e.g., "1.2.0" or 1.2).
 * @param {string|number} target - The target version string or number to compare against (e.g., "1.3.0").
 * @returns {boolean} Returns `true` if the `version` is greater than or equal to the `target`; otherwise, returns `false`.
 */
export const isVersionGreaterOrEqual = (version, target) => {
    const vParts = String(version).split('.').map(Number);
    const tParts = String(target).split('.').map(Number);

    for (let i = 0; i < Math.max(vParts.length, tParts.length); i++) {
        const v = vParts[i] || 0;
        const t = tParts[i] || 0;

        if (v > t) return true;
        if (v < t) return false;
    }

    return true;
};

export const removeNewLines = (str) => {

    if(typeof str !== 'string'){
        return str;
    }

    return str.replace(/\r?\n/g, "");
}

export const stripHtml = (label) => {

    if(typeof label !== 'string'){
        return '';
    }

    return label.replace(/(<([^>]+)>)/gi, "").trim();
};

/**
 * Calculates the length of a given string, accounting for multi-byte characters.
 *
 * This function determines the length of the provided string by converting it
 * to an array of characters using `Array.from()` to ensure that multi-byte
 * characters (e.g., emoji, accented characters) are correctly counted as a
 * single entity. If the input is not a string, the function returns 0.
 *
 * @param {string} str - The input string whose length is to be determined.
 * @returns {number} The length of the string, considering multi-byte characters,
 * or 0 if the input is not a string.
 */
export const mbStrLength = (str) => {

    if(typeof str !== 'string'){
        return 0;
    }

    return Array.from(str).length;
}

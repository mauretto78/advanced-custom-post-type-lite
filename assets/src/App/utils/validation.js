/**
 * validate a value for a given field type
 *
 * @param type
 * @param value
 * @return {boolean}
 */
import {COLOR, CURRENCY, DATE, EMAIL, LENGTH, NUMBER, PHONE, POST, SELECT, SELECT_MULTI, TOGGLE, WEIGHT} from "../constants/fields";

export const isAValidValueForThisType = (type, value, options) => {

    if(typeof value === 'undefined' || value === null || value === ''){
        return true;
    }

    if(value.length > 50){
        return false;
    }

    switch (type ) {
        case COLOR:
            return validColor(value);

        case CURRENCY:
            return validCurrency(value);

        case DATE:
            return validDate(value);

        case EMAIL:
            return validEmail(value);

        case WEIGHT:
        case LENGTH:
        case POST:
        case NUMBER:
            return validNumber(value);

        case PHONE:
            return validPhone(value);

        case SELECT:
        case SELECT_MULTI:
            return validSelect(value, options);

        case TOGGLE:
            return validToggle(value);

        case URL:
            return validURL(value);

        default:
            return true;
    }
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validEmail = (str) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validURL = (str) => {
    const pattern = new RegExp( '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i' ); // fragment locator

    return !!pattern.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validCurrency = (str) => {

    const re = /^[0-9]{1,}.[0-9]{2}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validNumber = (str) => {
    const re = /^[0-9]{1,}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validPhone = (str) => {
    const re = /^\+?([0-9]{2,3})\)?[-. ]?([0-9-. ]{6,15})$/;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validColor = (str) => {
    const re = /^#[a-f0-9]{6}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validDate = (str) => {
    const re = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
export const validToggle = (str) => {
    const re = /^[0-1]{1}$/i;

    return re.test(str);
};

/**
 *
 * @param value
 * @param options
 * @return {boolean}
 */
export const validSelect = (value, options) => {

    if(value === null || value === ''){
        return true;
    }

    if(options == null || options.length === 0){
        return false;
    }

    let matches = 0;

    options.forEach((o) => {
        if(o.value === value){
            matches++;
        }
    });

    return matches > 0;
};
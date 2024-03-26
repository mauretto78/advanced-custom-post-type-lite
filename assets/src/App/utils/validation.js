/**
 * validate a value for a given field type
 *
 * @param type
 * @param value
 * @return {boolean}
 */
import {fieldTypes} from "../constants/fields";
import {wpAjaxRequest} from "./ajax";
import useTranslation from "../hooks/useTranslation";

export const alphanumericallyValid = (string) => {

    const matches = string.match(/^[0-9a-zA-Z_-]+$/g);

    if (matches === null) {
        return 'Only alphanumeric characters allowed';
    }

    return true;
};

/**
 * Keys are used as internal identifiers. Lowercase alphanumeric characters, dashes, and underscores are allowed.
 * https://developer.wordpress.org/reference/functions/sanitize_key/
 *
 * @param post_name
 * @returns {boolean}
 */
export const isPostTypeNameValid = (post_name) => {

    const size = post_name.length;

    if (size > 20) {
        return 'Max post type name lenght is 20';
    }

    const matches = post_name.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    return true;
};

export const asyncIsPostTypeNameValid = async (post_name) => {

    const size = post_name.length;

    if (size > 20) {
        return 'Max post type name lenght is 20';
    }

    const matches = post_name.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    // check if already exists
    const res = await wpAjaxRequest("checkPostTypeNameAction", {postType: post_name});

    if(res.exists === true){
        return post_name + ' post type already exists.';
    }

    return true;
};

export const isTaxonomySlugValid = async (slug) => {

    const size = slug.length;

    if (size > 32) {
        return 'Max post type name lenght is 32';
    }

    const matches = slug.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    return true;
};

export const asyncIsTaxonomySlugValid = async (slug) => {

    const size = slug.length;

    if (size > 32) {
        return 'Max post type name lenght is 32';
    }

    const matches = slug.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    // check if already exists
    const res = await wpAjaxRequest("checkTaxonomySlugAction", {slug: slug});

    if (res.exists === true) {
        return slug + ' taxonomy already exists.';
    }

    return true;
};

export const isAValidValueForThisType = (type, value, options) => {

    if(typeof value === 'undefined' || value === null || value === ''){
        return true;
    }

    if(value.length > 50){
        return false;
    }

    switch (type ) {
        case fieldTypes.COLOR:
            return validColor(value);

        case fieldTypes.CURRENCY:
            return validCurrency(value);

        case fieldTypes.DATE:
            return validDate(value);

        case fieldTypes.EMAIL:
            return validEmail(value);

        case fieldTypes.WEIGHT:
        case fieldTypes.LENGTH:
        case fieldTypes.NUMBER:
            return validNumber(value);

        case fieldTypes.PHONE:
            return validPhone(value);

        case fieldTypes.CHECKBOX:
        case fieldTypes.RADIO:
        case fieldTypes.SELECT:
        case fieldTypes.SELECT_MULTI:
            return validSelect(value, options);

        case fieldTypes.TOGGLE:
            return validToggle(value);

        case fieldTypes.URL:
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

export const validWPGraphQLName = (name) => {

    if (null === name.match(/^[a-z]/)) {
        return "The string needs to start with a letter.";
    }

    if (null ===  name.match(/^[0-9a-zA-Z]+$/)) {
        return "The string needs to be alphanumeric (camelcase).";
    }
};

/**
 *
 * @param key
 * @return {string|boolean}
 */
export const validateGoogleMapsApiKey = (key) => {

    if(typeof key === 'undefined' ||  key === null || key === '' || key.length === 0){
        return  true;
    }

    if(key.length !== 39){
        return useTranslation('Key length must be 39.');
    }

    const regx = new RegExp( "^[A-Za-z0-9-_]+$" );

    if(!regx.test(key)){
        return useTranslation('Not valid format.');
    }

    return true;
};
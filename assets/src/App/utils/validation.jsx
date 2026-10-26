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
import {reservedTerms} from "../constants/reservedTerms";

export const alphanumericallyValid = (string) => {

    if(typeof string !== 'string' || string.length === 0){
        return 'Only alphanumeric characters allowed';
    }

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

    if(
        typeof post_name !== 'string' ||
        post_name.length === 0
    ){
        return 'Post type name is required';
    }

    const size = post_name.length;

    if (size > 20) {
        return 'Max post type name length is 20';
    }

    const matches = post_name.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    return true;
};

export const asyncIsPostTypeNameValid = async (post_name) => {

    if(
        typeof post_name !== 'string' ||
        post_name.length === 0
    ){
        return 'Post type name is required';
    }

    const size = post_name.length;

    if (size > 20) {
        return 'Max post type name length is 20';
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

export const isTaxonomySlugValid = (slug) => {

    if(
        typeof slug !== 'string' ||
        slug.length === 0
    ){
        return 'Slug is required';
    }

    const size = slug.length;

    if (size > 32) {
        return 'Max slug length is 32';
    }

    if(reservedTerms.includes(slug)){
        return 'Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info';
    }

    const matches = slug.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    return true;
};

export const asyncIsTaxonomySlugValid = async (slug) => {

    if(
        typeof slug !== 'string' ||
        slug.length === 0
    ){
        return 'Slug is required';
    }

    const size = slug.length;

    if (size > 32) {
        return 'Max slug length is 32';
    }

    if(reservedTerms.includes(slug)){
        return 'Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info';
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

export const validWPGraphQLName = (name) => {

    if(
        typeof name !== 'string' ||
        name.length === 0
    ){
        return 'Name is required';
    }

    if (null === name.match(/^[a-z]/)) {
        return "The string needs to start with a lowercase letter.";
    }

    if (null ===  name.match(/^[0-9a-zA-Z]+$/)) {
        return "The string needs to be alphanumeric (camelcase).";
    }

    return true;
};

/**
 *
 * @param key
 * @return {string|boolean}
 */
export const validateGoogleApiKey = (key) => {

    if(typeof key === 'undefined' ||  key === null || key === '' || key.length === 0){
        return true;
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
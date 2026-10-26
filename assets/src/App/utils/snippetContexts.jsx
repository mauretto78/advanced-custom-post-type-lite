import {metaTypes} from "../constants/metaTypes.jsx";

// A location rule's `belongsTo` (Meta group) / `rule` (CCT table group) has
// finer-grained variants than the coarse metaTypes a usage snippet cares about
// (e.g. POST_ID / POST_CAT / POST_TEMPLATE are all still "a post" for
// value-fetching purposes) -- collapse them.
export const normalizeBelongsTo = (rule) => {
    switch(rule){
        case 'POST_ID':
        case 'PARENT_POST_ID':
        case 'POST_CAT':
        case 'POST_TAX':
        case 'POST_TEMPLATE':
        case 'POST_FORMAT':
            return metaTypes.CUSTOM_POST_TYPE;
        case 'TERM_ID':
            return metaTypes.TAXONOMY;
        case 'USER_ID':
            return metaTypes.USER;
        default:
            return rule;
    }
};

// The metaTypes a MetaFieldSnippet can actually generate code for.
const SNIPPET_CONTEXTS = [
    metaTypes.CUSTOM_POST_TYPE,
    metaTypes.TAXONOMY,
    metaTypes.USER,
    metaTypes.COMMENT,
    metaTypes.MEDIA
];

const coerceFind = (find) => {
    // react-hook-form transiently sets `find` to [] while the user is changing
    // a rule's location; the PHP model serialises it as a comma-joined string.
    const value = Array.isArray(find) ? find[0] : find;
    return typeof value === 'string' ? value : '';
};

/**
 * Resolve a set of location rules to the distinct snippet contexts a field lives
 * in. Accepts both the Meta group belong shape ({belongsTo, operator, find}) and
 * the CCT table group shape ({rule, operator, value}).
 *
 * @param {Array} rules
 * @param {{cct?: boolean}} [options]
 *   cct: when true, only `=` rules count -- for CCT, other operators are
 *   visibility-only and never attach a record location, so a snippet for them
 *   would always resolve to nothing.
 * @returns {{belongsTo: string, find: string}[]} deduped, first-seen order
 */
export const resolveSnippetContexts = (rules, {cct = false} = {}) => {
    const seen = new Set();
    const out = [];

    for(const rule of rules ?? []){
        const rawBelongsTo = rule?.belongsTo ?? rule?.rule ?? null;
        const operator = rule?.operator ?? '';

        if(cct && operator && operator !== '='){
            continue;
        }

        const belongsTo = normalizeBelongsTo(rawBelongsTo);
        if(!SNIPPET_CONTEXTS.includes(belongsTo)){
            continue;
        }

        const find = coerceFind(rule?.find ?? rule?.value);

        // `find` only changes the generated snippet for option pages (it is the
        // `page=` slug); every other context uses a literal `123` placeholder.
        const key = belongsTo;
        if(seen.has(key)){
            continue;
        }

        seen.add(key);
        out.push({belongsTo, find});
    }

    return out;
};

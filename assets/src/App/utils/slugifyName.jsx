import {slugify, transliterate} from "transliteration";

/**
 * Canonical field/name slugifier for the canvas inline editors -- the
 * `slugify(transliterate(x))` combo that was previously inlined in ~15 places.
 *
 * Kept in its own module (not utils/strings.jsx) so the ESM-only
 * `transliteration` dependency doesn't leak into every file that imports a
 * string helper -- only the inline editors and their tests pull it in.
 *
 * @param {*} str
 * @return {string}
 */
export const slugifyName = (str) => slugify(transliterate(typeof str === 'string' ? str : ''));

export default slugifyName;

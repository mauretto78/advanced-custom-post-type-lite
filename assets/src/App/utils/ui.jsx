import {mbStrLength} from "./strings.jsx";

/**
 * Character count (multi-byte aware) above which an element name/label is
 * considered "long" and gets ellipsis-truncated in the Canvas builders.
 *
 * @type {number}
 */
export const MAX_WIDTH_CHAR_THRESHOLD = 10;

/**
 * CSS utility classes applied to a name/label node once it exceeds
 * MAX_WIDTH_CHAR_THRESHOLD: clamp the width and cut the overflow with an
 * ellipsis. Single source of truth -- tests assert against this constant too.
 *
 * @type {string}
 */
export const MAX_WIDTH_CLASSNAME = "text-ellipsis max-w-120px";

/**
 * Returns the truncation CSS classes for a given name/label string, or an empty
 * string when it is short enough to render in full.
 *
 * The length check is multi-byte aware (via mbStrLength), so a run of CJK or
 * emoji characters is counted by code point rather than by UTF-16 code unit.
 * Non-string input yields "" -- mbStrLength already maps it to 0 -- so the
 * result is always safe to string-interpolate into a className.
 *
 * @param {string} string - The name or label to evaluate.
 * @returns {string} MAX_WIDTH_CLASSNAME when the string is long, otherwise "".
 */
export const maxWidthClassName = (string) =>
    mbStrLength(string) > MAX_WIDTH_CHAR_THRESHOLD ? MAX_WIDTH_CLASSNAME : "";

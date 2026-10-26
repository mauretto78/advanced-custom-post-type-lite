/**
 * Normalize a caught value (a rejected promise's reason can be anything --
 * a string, an Error, a plain object, undefined, ...) into a display/log-safe string.
 *
 * @param err
 * @param fallback
 * @returns {string}
 */
export const getErrorMessage = (err, fallback = "Unknown error") => {

    if(typeof err === "string"){
        return err;
    }

    if(err && err.message && typeof err.message === "string"){
        return err.message;
    }

    return fallback;
};

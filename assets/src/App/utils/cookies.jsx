import Cookies from "universal-cookie";
import useTranslation from "../hooks/useTranslation";
import {delay} from "./misc";
import {toast} from "react-hot-toast";

export const cookies = {
    SUCCESS: "acpt_success_message",
    DANGER: 'acpt_danger_message',
    WARNING: 'acpt_warning_message',
    INFO: 'acpt_info_message'
};

/**
 *
 * @return {Cookies}
 */
export const cookieClient = () => {
    return new Cookies(null, { path: '/' });
};

/**
 * Sets a cookie message with a specified level indicating the type or category of the message.
 * An existing message for the same level is overwritten.
 *
 * @param {string} message - The message content to be stored in the cookie.
 * @param {string} [level=cookies.SUCCESS] - The level or category associated with the message
 *                                           (e.g., success, error). Defaults to 'cookies.SUCCESS'.
 */
export const setCookieMessage = (message, level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    cookies.set(level, useTranslation(message));
};

/**
 * Retrieves a cookie message for the specified level.
 *
 * This function accesses the cookie client to fetch a message
 * associated with the given cookie level. If no message is found
 * for the specified level, it returns null.
 *
 * @param {string} [level=cookies.SUCCESS] - The level of the cookie message to retrieve. Defaults to `cookies.SUCCESS` if not provided.
 * @returns {string|null} The cookie message for the specified level, or null if no message exists.
 */
export const getCookieMessage = (level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    const message = cookies.get(level);

    return message ? message : null;
};

export const unsetCookieMessage = (level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    cookies.remove(level);
};

/**
 * Processes and displays a toast notification based on a cookie-stored message,
 * then clears the message from the cookie to prevent duplicate notifications.
 *
 * @function
 * @param {string} [level=cookies.SUCCESS] - The level or type of the cookie message to retrieve.
 *                                           Defaults to `cookies.SUCCESS`.
 * @param {number} [timeout=1000] - The delay (in milliseconds) before displaying the notification.
 *                                  Defaults to `1000`.
 * @returns {void}
 */
export const flushCookieMessages = (level = cookies.SUCCESS, timeout = 1000) => {
    const message = getCookieMessage(level);

    if(message){
        // Clear the cookie synchronously, before the delayed toast fires. Callers
        // (e.g. list pages) may invoke this several times on mount within the
        // `timeout` window; clearing now makes the re-entrant calls no-op instead
        // of each scheduling its own duplicate toast.
        unsetCookieMessage(level);

        delay(timeout).then(() => {
            switch (level) {
                default:
                case cookies.INFO:
                case cookies.SUCCESS:
                    toast.success(message);
                    break;

                case cookies.WARNING:
                case cookies.DANGER:
                    toast.error(message);
                    break;
            }
        });
    }
};

/**
 *
 * @param location
 * @return {boolean}
 */
export const dontShowCookieMessage = (location) => {
    const pages = [
        "",
        "blocks",
        "forms",
        "meta",
        "cct",
        "product-data/product",
        "table-groups",
        "taxonomies",
        "settings",
        "view",
        "view_taxonomy",
        "tools/meta-keys-manager",
        "option-pages",
    ];

    let matches = 0;

    pages.map((page) => {
        if(location === "/"+page){
            matches++;
        } else {
            // pagination
            const regx = new RegExp( `^/${page}/[a-z0-9]+$` );

            if(regx.test(location)){
                matches++;
            }
        }
    });

    return matches > 0;
};
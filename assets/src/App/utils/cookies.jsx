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

export const setCookieMessage = (message, level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    cookies.set(level, useTranslation(message));
};

export const getCookieMessage = (level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    const message = cookies.get(level);

    return message ? message : null;
};

export const unsetCookieMessage = (level = cookies.SUCCESS) => {
    const cookies = cookieClient();
    cookies.remove(level);
};

export const flushCookieMessages = (level = cookies.SUCCESS, timeout = 1000) => {
    const message = getCookieMessage(level);

    if(message){
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

            unsetCookieMessage(level);
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
        "forms",
        "meta",
        "product-data/product",
        "taxonomies",
        "tools/dataset",
        "settings",
        "view",
        "view_taxonomy",
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
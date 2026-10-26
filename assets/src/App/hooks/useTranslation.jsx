/**
 * Return a translated string from global document object
 * @param string
 * @returns {*}
 */
import {htmlspecialcharsDecode} from "../utils/strings";

/**
 * Replace every {{key}} placeholder in a string with its arg value.
 * Applied on both the translated and the fallback (untranslated) string, so a
 * locale missing a translation for an interpolated key still renders the real
 * values instead of leaking raw "{{key}}" placeholders to the user.
 * @param string
 * @param args
 * @returns {*}
 */
const replaceArgs = (string, args) => {
    let result = string;

    if(args !== null && typeof args !== 'undefined'){
        for (const key in args) {
            result = result.replace("{{"+key+"}}", args[key]);
        }
    }

    return result;
};

const useTranslation = (string, args) => {

    if(document.globals){

        const settings = document.globals;

        if(typeof settings.globals === 'undefined'){
            return replaceArgs(string, args);
        }

        const translations = settings.globals.translations;

        if(typeof translations === 'undefined'){
            return replaceArgs(string, args);
        }

        if(typeof translations[string] !== 'undefined' && translations[string] !== ''){
            return replaceArgs(htmlspecialcharsDecode(translations[string]), args);
        }

        return replaceArgs(string, args);
    }

    return replaceArgs(string, args);
};

export default useTranslation;

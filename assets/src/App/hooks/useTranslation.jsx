/**
 * Return a translated string from global document object
 * @param string
 * @returns {*}
 */
import {htmlspecialcharsDecode} from "../utils/strings";

const useTranslation = (string, args) => {

    if(document.globals){

        const settings = document.globals;

        if(typeof settings.globals === 'undefined'){
            return string;
        }

        const translations = settings.globals.translations;

        if(typeof translations === 'undefined'){
            return string;
        }

        if(typeof translations[string] !== 'undefined' && translations[string] !== ''){

            let translation = htmlspecialcharsDecode(translations[string]);

            if(args !== null && typeof args !== 'undefined'){
                for (const key in args) {
                    translation = translation.replace("{{"+key+"}}", args[key]);
                }
            }

            return translation;
        }

        return string;
    }

    return string;
};

export default useTranslation;
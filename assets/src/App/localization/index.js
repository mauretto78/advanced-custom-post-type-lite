
/**
 * Translate a string from locale files
 *
 * @param string
 * @return {*}
 */
export const translate = (string, args) => {
    const lang = (global.settings && global.settings.language) ? global.settings.language : 'en';
    const json = require('./locales/'+lang+'.js').translations;
    const strings = string.split(".");
    let translation = getTranslatedString(json, strings);

    if(args !== null && typeof args !== 'undefined'){
        for (const key in args) {
            translation = translation.replace("{{"+key+"}}", args[key]);
        }
    }

    return (typeof translation !== 'undefined') ? translation : string;
};

const getTranslatedString = (json, strings) => {

    let object = json;

    strings.map((s)=>{
        object = object[s];
    });

    return object;
};
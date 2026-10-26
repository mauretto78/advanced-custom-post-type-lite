var $ = jQuery.noConflict();

/**
 *
 * @param selector
 * @param context
 * @return {jQuery|HTMLElement}
 */
export function $$(selector, context){
    return jQuery(selector.replace(/(\[|\])/g, '\\$1'), context)
}

export const dateFields = [
    {selector:".acpt-datepicker", format:"date"},
    {selector:".acpt-datetimepicker", format:"datetime"},
    {selector:".acpt-daterangepicker", format:"daterange"},
    {selector:".acpt-timepicker", format:"time"},
];


/**
 *  ref: http://stackoverflow.com/a/1293163/2343
 * This will parse a delimited string into an array of
 * arrays. The default delimiter is the comma, but this
 * can be overriden in the second argument.
 *
 * @param strData
 *
 * @return {[[]]}
 * @constructor
 */
export const CSVToArray = (strData) => {

    /**
     * Guess the delimiter
     *
     * @param text
     * @param possibleDelimiters
     * @return {*}
     */
    function guessDelimiters (text, possibleDelimiters) {
        return possibleDelimiters.filter(weedOut);

        function weedOut (delimiter) {
            var cache = -1;
            return text.split('\n').every(checkLength);

            function checkLength (line) {
                if (!line) {
                    return true;
                }

                var length = line.split(delimiter).length;
                if (cache < 0) {
                    cache = length;
                }
                return cache === length && length > 1;
            }
        }
    }

    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    const supportedDelimiters = ["," ,";" , "|", "\t"];
    const strDelimiters = guessDelimiters(strData, supportedDelimiters);

    if(strDelimiters.length !== 1){
        throw new Error(`Delimiter was not recognized`);
    }

    const strDelimiter = strDelimiters[0];

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
};

/**
 *
 * @return {Date}
 */
export const today = () => {
    return new Date();
};

/**
 *
 * @param days
 * @return {Date}
 */
export const todayPlusDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date;
};

/**
 *
 * @param date
 * @return {*}
 */
export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

/**
 *
 * @param action
 * @param data
 * @return {Promise<void>}
 */
export async function wpAjaxRequest(action, data)
{
    let formData;
    const baseAjaxUrl = (typeof ajaxurl === 'string') ? ajaxurl : '/wp-admin/admin-ajax.php';

    formData = new FormData();
    formData.append('action', action);
    formData.append('data', JSON.stringify(data));

    return fetch(baseAjaxUrl, {
        method: 'POST',
        body: formData
    });
}

/**
 * Debuonce a function
 *
 * @param func
 * @param timeout
 * @return {function(...[*]=)}
 */
export function debounce(func, timeout = 300){
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/**
 * Converts a string of comma-separated values into an array of numbers.
 *
 * @param {JQuery} el - An object that contains a `val` method returning a string of comma-separated values.
 * @return {number[]} An array of numbers obtained by splitting the input string. If the input is falsy, returns an empty array.
 */
export function stringsToArray(el) {

    if(!el){
        return [];
    }

    return el.val().split(",").map(Number);
}

/**
 *
 * @param string
 * @returns {*}
 */
export function useTranslation(string) {
    if(typeof document.adminjs === 'undefined'){
        return string;
    }

    if(typeof document.adminjs.translations === 'undefined'){
        return string;
    }

    if(typeof document.adminjs.translations.translations === 'undefined'){
        return string;
    }

    const translations = document.adminjs.translations.translations;

    if(typeof translations === 'undefined'){
        return string;
    }

    if(typeof translations[string] !== 'undefined' && translations[string] !== ''){
        return translations[string]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            ;
    }

    return string;
};

/**
 * WP default TinyMCE settings
 */
export function tinyMCEWordpressDefaultSettings(id, rows = 8, toolbar = 'full') {

    let toolbar1;
    let toolbar2;

    if(toolbar === 'full'){
        toolbar1 = "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,dfw";
        toolbar2 = "strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help";
    } else if(toolbar === 'basic'){
        toolbar1 = "bold,italic,underline,blockquote,strikethrough,bullist,numlist,alignleft,aligncenter,alignright,undo,redo,link,fullscreen";
        toolbar2 = "";
    }

    return {
        selector: id,
        theme: "modern",
        skin: "lightgray",
        content_css: [
            `${document.globals.site_url}/wp-includes/css/dashicons.min.css`,
            `${document.globals.site_url}/wp-includes/js/tinymce/skins/wordpress/wp-content.css`,
        ],
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
        browser_spellcheck: true,
        fix_list_elements: true,
        entities: "38,amp,60,lt,62,gt",
        entity_encoding: "raw",
        keep_styles: false,
        cache_suffix: "wp-mce-49110-20201110",
        height: (parseInt(rows)*25),
        rows: rows,
        resize: true,
        branding: false,
        menubar: false,
        statusbar: true,
        plugins: "charmap,colorpicker,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpautoresize,wpeditimage,wpemoji,wpgallery,wplink,wpdialogs,wptextpattern,wpview",
        wpautop: false,
        indent: true,
        toolbar1: toolbar1,
        toolbar2: toolbar2,
        toolbar3: "",
        toolbar4: "",
        tabfocus_elements: ":prev,:next",
        body_class: "content post-type-movie post-status-publish page-template-default locale-it-it",
        wp_autoresize_on: false,
        wp_wordcount: true,
        add_unload_trigger: false,
        setup: function (ed) {
            ed.on('load', function(args) {
                const id = ed.id;
                const height = (parseInt(rows)*25);
                const iframe = document.getElementById(id + '_ifr');
                iframe.style.height = height + 'px';
            });
        }
    };
}

/**
 * ===================================================================
 * COOKIES FUNCTION
 * ===================================================================
 */

/**
 *
 * @param name
 * @param value
 * @param days
 * @param attributes
 * @return {string}
 */
export const setCookie = (name, value, days, attributes) => {
    const cookie = [];
    // Encode the value to escape semicolons, commas, and white-space
    let name_value = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    cookie.push(name_value);
    if (typeof days == "number") {
        let expires = "expires=" + new Date(Date.now() + 864E5 * days).toUTCString();
        cookie.push(expires);
    }
    // Initialize attributes object if not provided or not an object
    if (typeof attributes !== 'object') {
        attributes = {};
    }
    // Set the default path to / if not provided
    if (attributes.path === undefined) {
        attributes.path = "/";
    }
    for (const key in attributes) {
        if (key != "expires" && key != "max-age") {
            let attr = key+"="+attributes[key];
            cookie.push(attr);
        }
    }
    return document.cookie = cookie.join("; ");
};

/**
 *
 * @param name
 * @param attributes
 * @return {string}
 */
export const removeCookie = (name, path, domain) => {
    document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((domain)?";domain="+domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
};

/**
 *
 * @param name
 * @return {{}|*}
 */
export const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    const cookies_list_obj = {};
    cookies.forEach(cookie => {
        let [key, ...values] = cookie.split('=');
        let value = decodeURIComponent(values.join('='));
        key = decodeURIComponent(key);
        cookies_list_obj[key] = value;

        if (name === key) {
            return;
        }
    });

    if (name !== undefined) {
        return cookies_list_obj[name] ? cookies_list_obj[name] : null;
    } else {
        return cookies_list_obj;
    }
};


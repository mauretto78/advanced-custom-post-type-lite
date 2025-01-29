
// A collection of general purpose, reusable functions

/**
 *
 * @param action
 * @param data
 * @return {Promise<void>}
 */
async function wpAjaxRequest(action, data)
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
 *
 * @param string
 * @returns {*}
 */
function useTranslation(string) {
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
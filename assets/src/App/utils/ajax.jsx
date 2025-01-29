/**
 * Make a wordpress AJAX request
 * (data will be sent as JSON string)
 *
 * @param action
 * @param data
 * @returns {Promise<any>}
 */
export const wpAjaxRequest = async (action, data) => {

    let formData;
    formData = (data instanceof FormData) ? data : new FormData();
    formData.append('action', action);
    formData.append('data', JSON.stringify(data));

    const baseAjaxUrl = (typeof ajaxurl === 'string') ? ajaxurl : '/wp-admin/admin-ajax.php';

    let response = await fetch(baseAjaxUrl, {
        method: 'POST',
        body: formData
    });

    if(response.status >= 400){
        throw new Error(response.statusText);
    }

    return await response.json();
};


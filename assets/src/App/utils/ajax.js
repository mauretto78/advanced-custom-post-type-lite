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

    let response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    });

    return await response.json();
};


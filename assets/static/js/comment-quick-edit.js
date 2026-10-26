
window.addEventListener('load', function () {

    const quickEditButtons = document.body.querySelectorAll('.comment-inline');

    quickEditButtons.forEach((quickEditButton) => {
        quickEditButton.addEventListener("click", function(e){

            const commentId = quickEditButton.getAttribute("data-comment-id");
            const acptFields = document.body.querySelectorAll('[data-acpt-column]');

            acptFields.forEach((field) => {

                field.value = '';

                let formData;
                const baseAjaxUrl = (typeof ajaxurl === 'string') ? ajaxurl : '/wp-admin/admin-ajax.php';

                formData = new FormData();
                formData.append('action', 'fetchMetaValueAction');
                formData.append('data', JSON.stringify({
                    fieldName: field.name,
                    objectType: "comment",
                    objectId: commentId
                }));

                fetch(baseAjaxUrl, {
                    method: 'POST',
                    body: formData
                })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if(data.value){
                        field.value = data.value;
                    }
                });
            });
        });
    });
});

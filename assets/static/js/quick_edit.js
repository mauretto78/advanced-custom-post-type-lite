jQuery( function( $ ){

    const wp_inline_edit_function = inlineEditPost.edit;

    // Populate a field element with a fetched value (shared by meta and CCT handlers)
    function populateField($field, value) {
        const tag = $field[0].tagName;

        switch (tag) {

            // Checkbox / Radio
            case "DIV":
                $field.find("input").each(function(){
                    const $input = $(this);
                    const inputVal = $input.val();

                    if(value === null){
                        $input.prop("checked", false);
                    } else if(typeof value === 'object'){
                        $input.prop("checked", value.includes(inputVal));
                    } else if(typeof value === 'string'){
                        $input.prop("checked", inputVal === value);
                    }
                });
                break;

            // Select / Select multiple
            case "SELECT":
                if($field.attr("multiple")){
                    $field.find("option").each(function(){
                        const $option = $(this);
                        const optVal = $option.val();

                        if(value === null){
                            $option.prop("selected", false);
                        } else if(typeof value === 'object'){
                            $option.prop("selected", value.includes(optVal));
                        } else if(typeof value === 'string'){
                            $option.prop("selected", optVal === value);
                        }
                    });
                } else {
                    $field.val(value || "");
                }
                break;

            // Input and everything else
            default:
            case "INPUT":
            case "TEXTAREA":
                $field.val(value || "");
                break;
        }
    }

    // we overwrite the it with our own
    inlineEditPost.edit = function( post_id ) {

        // let's merge arguments of the original function
        wp_inline_edit_function.apply( this, arguments );

        // get the post ID from the argument
        if ( typeof( post_id ) == 'object' ) { // if it is object, get the ID number
            post_id = parseInt( this.getId( post_id ) );
        }

        if(typeof( post_id ) !== 'number') {
            return;
        }

        const post_row = $( '#edit-' + post_id );
        const baseAjaxUrl = (typeof ajaxurl === 'string') ? ajaxurl : '/wp-admin/admin-ajax.php';

        // Populate standard meta fields
        post_row.find('*[data-acpt-column]').each(function() {

            const $field = $(this);
            const $fieldName = $field.data("acpt-column").replace("column-", "");

            $.ajax({
                type: 'POST',
                url: baseAjaxUrl,
                data: {
                    "action": "fetchMetaValueAction",
                    "data": JSON.stringify({
                        "fieldName": $fieldName,
                        "objectType": "customPostType",
                        "objectId": post_id,
                    }),
                },
                success: function(data) {
                    populateField($field, data.value);
                },
                dataType: 'json'
            });
        });

        // Populate CCT column fields
        post_row.find('*[data-acpt-cct-column]').each(function() {

            const $field    = $(this);
            const cctAttr   = $field.data("acpt-cct-column"); // "tableName::columnName"
            const separator = cctAttr.indexOf("::");
            if (separator === -1) { return; }

            const tableName  = cctAttr.substring(0, separator);
            const columnName = cctAttr.substring(separator + 2);

            $.ajax({
                type: 'POST',
                url: baseAjaxUrl,
                data: {
                    "action": "fetchCCTColumnValueAction",
                    "data": JSON.stringify({
                        "tableName":  tableName,
                        "columnName": columnName,
                        "postId":     post_id,
                    }),
                },
                success: function(data) {
                    populateField($field, data.value);
                },
                dataType: 'json'
            });
        });
    }
});

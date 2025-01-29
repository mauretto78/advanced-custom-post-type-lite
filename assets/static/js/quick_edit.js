jQuery( function( $ ){

    const wp_inline_edit_function = inlineEditPost.edit;

    // we overwrite the it with our own
    inlineEditPost.edit = function( post_id ) {

        // let's merge arguments of the original function
        wp_inline_edit_function.apply( this, arguments );

        // get the post ID from the argument
        if ( typeof( post_id ) == 'object' ) { // if it is object, get the ID number
            post_id = parseInt( this.getId( post_id ) );
        }

        const post_row = $( '#post-' + post_id );

        // loop al table cells
        post_row.find('td').each(function() {
            const $row = $(this);
            const cssClasses = $row.attr("class").split(/\s+/);
            const columnName = cssClasses[1];

            if(columnName !== 'column-title' && columnName !== 'column-date'){
                const columnValue = $( `.${columnName}`, post_row ).text();
                const acptMetaColumn = $('[data-acpt-column="'+columnName+'"]');

                acptMetaColumn.val( columnValue );
            }
        });
    }
});
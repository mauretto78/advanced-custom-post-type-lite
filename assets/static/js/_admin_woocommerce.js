var $ = jQuery.noConflict();

export const runWooCommerceFixes = () => {

    $('body').on('click', '.woocommerce_variation.wc-metabox > h3', function(e) {
        init();
        const parent = $(this).parent();
        parent.addClass("variation-needs-update");
    });

    // selectize doesn't work properly in variations
    $(document).on('woocommerce_variations_loaded', function(event) {
        const $variation_form = $( '.woocommerce_variations' );
        if ( $variation_form.length > 0 ) {
            $variation_form.find(".acpt-select2").each(function(i, select){
                $(this).removeClass("acpt-select2");
            });
        }
    });
};
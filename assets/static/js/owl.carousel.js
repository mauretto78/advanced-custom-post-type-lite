var $ = jQuery.noConflict();

$(function(){

    const oc = $('.owl-carousel');
    const ocOptions = oc.data('carousel-options');
    const defaults = {
        loop:false,
        margin:20,
        nav:false,
    };
    oc.owlCarousel( $.extend( defaults, ocOptions) );
});

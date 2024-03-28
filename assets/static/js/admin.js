var $ = jQuery.noConflict();

jQuery(function ($) {
    
    /**
     * selectize
     * @see https://selectize.dev/docs/api
     *
     * @param item
     * @param escape
     * @returns {string}
     */
    const formatSelectizeItem = (item, escape) => {

        if(!item.text.includes("<-------->")){
            return `<div>${item.text}</div>`;
        }

        let explode = item.text.split("<-------->");

        return `<div class="selectize-item"><span class='acpt-badge'>${explode[0]}</span> ${explode[1]}</div>`;
    };

    $('.acpt-select2').selectize({
        plugins: ["restore_on_backspace", "clear_button"],
        placeholder: "--Select--",
        render: {
            option: function(option, escape) {
                return formatSelectizeItem(option, escape);
            },
            item: function(item, escape) {
                return formatSelectizeItem(item, escape);
            }
        },
    });

    // color picker
    $('.color-picker').wpColorPicker();

    /*========== TABS, ACCORDIONS ==========*/

    $('.acpt-admin-horizontal-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const target = $this.data('target');

        $(`.acpt-admin-horizontal-panel`).each(function () {
            $(this).removeClass('active');
        });

        $(`.acpt-admin-horizontal-tab`).each(function () {
            $(this).removeClass('active');
        });

        $(`#${target}`).addClass('active');
        $this.addClass('active');
    });

    $('.acpt-admin-vertical-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const target = $this.data('target');

        $(`.acpt-admin-vertical-panel`).each(function () {
            $(this).removeClass('active');
        });

        $(`.acpt-admin-vertical-tab`).each(function () {
            $(this).removeClass('active');
        });

        $(`#${target}`).addClass('active');
        $this.addClass('active');
    });

    $('.acpt-admin-accordion-title').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parent = $this.parent('div');
        const isAlreadyActive = parent.hasClass('active');

        $(`.acpt-admin-accordion-item`).each(function () {
            $(this).removeClass('active');
        });

        if(isAlreadyActive){
            parent.removeClass('active');
        } else {
            parent.addClass('active');
        }
    });
});
var $ = jQuery.noConflict();

/**
 * Main admin JS
 */
jQuery(function ($) {

    /**
     *
     * @param selector
     * @param context
     * @return {jQuery|HTMLElement}
     */
    function $$(selector, context){
        return jQuery(selector.replace(/(\[|\])/g, '\\$1'),
            context)
    }

    /**
     * ===================================================================
     * HELPERS
     * ===================================================================
     */

    /**
     *
     * @param uuid
     * @return {boolean}
     */
    function isUUID ( uuid ) {
        let s = "" + uuid;

        s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        if (s === null) {
            return false;
        }

        return true;
    }

    /**
     * ===================================================================
     * TRANSLATIONS SECTION
     * ===================================================================
     */

    /**
     *
     * @param string
     * @returns {*}
     */
    const useTranslation = (string) => {

        if(typeof document.adminjs === 'undefined'){
            return string;
        }

        const translations = document.adminjs.translations;

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
     * Fetch all translations
     *
     * @returns {Promise<Response>}
     */
    const fetchLanguages = () => {

        const baseAjaxUrl = (typeof ajaxurl === 'string') ? ajaxurl : '/wp-admin/admin-ajax.php';

        let formData;
        formData = new FormData();
        formData.append('action', 'languagesAction');

        return fetch(baseAjaxUrl, {
            method: 'POST',
            body: formData
        });
    };

    fetchLanguages()
        .then((response) => response.json())
        .then((translations) => {
            document.adminjs = {
                translations: translations
            };
        })
        .catch((err) => {
            console.error("Something went wrong!", err);
        });

    /**
     * ===================================================================
     * MISC FUNCTIONS SECTION
     * ===================================================================
     */

    /**
     * Option pages
     */
    $('.acpt-toggle-indicator').on('click', function () {
        const target = $(this).data('target');
        $(`#${target}`).toggleClass('closed');
    });

    /**
     * Input range
     */
    $('.acpt-range').on('change', function () {
        const id = $(this).attr('id');
        const value = $(this).val();

        $(`#${id}_value`).text(value);
    });

    /**
     * Add 'multipart/form-data' type to comment form
     */
    if($('#commentform').length){
        $('#commentform')[0].encoding = 'multipart/form-data';
    }


    /**
     * This is a fix for creating a new term with editor fields associated
     *
     * This fix was taken from: https://github.com/sheabunge/visual-term-description-editor/blob/master/src/php/class-editor.php
     */
    $('#addtag').on('mousedown', '#submit', function () {
        if(typeof tinyMCE !== 'undefined'){
            tinyMCE.triggerSave();

            $(document).bind('ajaxSuccess.vtde_add_term', function () {
                if (tinyMCE.activeEditor) {
                    tinyMCE.activeEditor.setContent('');
                }

                $(document).unbind('ajaxSuccess.vtde_add_term', false);
            });
        }
    });

    /**
     * Toggle input
     */
    $('.wppd-ui-toggle').on( 'change', function () {
        const valId = $(this).attr('id');
        $('#'+valId).val(($(this).is(':checked')) ? 1 : 0 );
    });

    /**
     * Currency selector
     */
    $(".currency-selector").on("change", function () {

        const selected = $(this).find( "option:selected" );
        const amount = $(this).parent('div').prev();
        const symbol = amount.prev();

        symbol.text(selected.data("symbol"));
        amount.prop("placeholder", selected.data("placeholder"));
    });

    /**
     * selectize
     * @see https://selectize.dev/docs/api
     */
    const initSelectize = (id = null) => {
        try {
            if(jQuery().selectize) {

                const formatSelectizeItem = (item, escape) => {

                    const relation_label_separator =  "<-------->";

                    if(!item.text.includes(relation_label_separator)){
                        return `<div>${item.text}</div>`;
                    }

                    let explode = item.text.split(relation_label_separator);
                    const thumbnail = explode[0];
                    const cpt = explode[1];
                    const label = explode[2];
                    const thumbnailDiv = (thumbnail) ? `<div class="selectize-thumbnail"><img src="${thumbnail}" alt="${label}" width="50" /></div>` : `<div class="selectize-thumbnail"><span class="selectize-thumbnail-no-image"></span></div>`;

                    return `<div class="selectize-item">${thumbnailDiv}<div class="selectize-details"><span class='acpt-badge'>${cpt}</span><span>${label}</span></div></div>`;
                };

                let selector = `.acpt-select2`;
                if(id){
                    selector = `#${id}`;
                }

                $$(selector).selectize({
                    plugins: ["restore_on_backspace", "clear_button", "remove_button"],
                    placeholder: '--Select--',
                    onChange: function() {
                        this.$input[0].dispatchEvent(new Event("change")) // dispatch change event on change
                    },
                    render: {
                        option: function(option, escape) {
                            return formatSelectizeItem(option, escape);
                        },
                        item: function(item, escape) {
                            return formatSelectizeItem(item, escape);
                        }
                    },
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    /*========== INIT ==========*/

    /**
     * Init the dependencies
     */
    function init() {
        initSelectize();
    }

    // call init() after click on media manager
    const attachments = $(".attachments-wrapper");

    if(attachments){
        $(attachments).on('click', function (e) {
            init();
        });
    }

    init();

    /*========== TABS, ACCORDIONS ==========*/

    $('.acpt-admin-horizontal-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parentTabs = $this.parent();
        const target = $this.data('target');
        const targetPanels = $(`#${target}`).parent();

        parentTabs.children().removeClass('active');
        targetPanels.children().removeClass('active');

        $(`#${target}`).addClass('active');
        $this.addClass('active');
    });

    $('.acpt-admin-vertical-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parentTabs = $this.parent();
        const target = $this.data('target');
        const targetPanels = $(`#${target}`).parent();

        parentTabs.children().removeClass('active');
        targetPanels.children().removeClass('active');

        $(`#${target}`).addClass('active');
        $this.addClass('active');
    });

    $('.acpt-admin-accordion-title').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parent = $this.parent('div');
        const parentWrapper = parent.parent('div');
        const isAlreadyActive = parent.hasClass('active');

        parentWrapper.children().each(function () {
            $(this).removeClass('active');
        });

        if(isAlreadyActive){
            parent.removeClass('active');
        } else {
            parent.addClass('active');
        }
    });
});
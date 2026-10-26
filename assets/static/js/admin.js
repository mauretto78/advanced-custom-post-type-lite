import {waitForElement, fetchLanguages} from "./_admin_helpers.js";
import {handleDateFieldsEvents, initDateRangePicker} from "./_admin_datepicker.js";
import {runWooCommerceFixes} from "./_admin_woocommerce.js";
import {initSelectize, initTextarea, runMiscFunctions, initEditMetaBoxButtons} from "./_admin_misc.js";

var $ = jQuery.noConflict();

/**
 * Main admin JS
 */
jQuery(function ($) {
    /**
     * ===================================================================
     * FETCH LANGUAGES
     * ===================================================================
     */

    /**
     * Fetch translations
     */
    fetchLanguages()
        .then((response) => response.json())
        .then((translations) => {
            document.adminjs = {
                translations: translations
            };
            document.dispatchEvent(new Event("fetchLanguages"));
        })
        .catch((err) => {
            console.error("Something went wrong!", err);
        });

    /**
     * ===================================================================
     * DATE PICKER
     * ===================================================================
     */

    handleDateFieldsEvents();

    /**
     * ===================================================================
     * MISCELLANEA
     * ===================================================================
     */

    runMiscFunctions();
    runWooCommerceFixes();

    /**
     * ===================================================================
     * INIT
     * ===================================================================
     */

    /**
     * Init the dependencies
     *
     * @param settings
     */
    function init(settings = {}) {
        const selectize = settings && typeof settings.selectize === 'boolean' ? settings.selectize : true;
        const wrapper = settings && settings.wrapper ? settings.wrapper : null;

        initSelectize(null, wrapper, selectize);
        initDateRangePicker("date", null, wrapper);
        initTextarea(null, wrapper);
        initEditMetaBoxButtons();
    }

    init({});

    /**
     * This function waits to attachments-wrapper is populated and then initialize the application.
     *
     * The init() function is triggered ONLY on .compat-attachment-fields fields
     */
    function initTheAppWhenAttachmentsAreLoaded() {
        waitForElement(".attachments-wrapper > ul > li", function(){
            $(".attachments-wrapper > ul > li").on("click", function(){
                const postId = $(this).data("id");

                init({
                    wrapper: ".compat-attachment-fields",
                    postId: postId,
                    selectize: false
                });
            });
        });
    }

    // Init the dependencies on the Media Library page
    if(pagenow === "upload"){
        initTheAppWhenAttachmentsAreLoaded();
    }

    // Init the dependencies if load more button is pressed
    $(".attachments-wrapper button.load-more").on("click", function(){
        initTheAppWhenAttachmentsAreLoaded();
    });

    // Init the dependencies when open the Media upload popup
    if (wp.media) {
        wp.media.view.Modal.prototype.on('open', function(data) {
            initTheAppWhenAttachmentsAreLoaded();
        });
    }

});
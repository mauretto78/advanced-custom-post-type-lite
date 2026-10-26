import {$$, debounce, removeCookie, setCookie} from "./_admin_commons.js";

var $ = jQuery.noConflict();

/**
 * Run misc functions
 */
export const runMiscFunctions = () => {
    // Needed by setCookie
    const domain = window.location.hostname;
    const path = "/";

    /**
     *
     * @param metaBox
     * @return {string}
     */
    const geyMetaBoxVisibilityKey = (metaBox) => {
        let key = '';
        const list = metaBox.classList;
        for (let x of list.values()) {
            if(x !== "closed"){
                key += x+"_";
            }
        }

        return `${key}closed`;
    };

    /**
     * Save meta box status in LS
     */
    $('.acpt-metabox .toggle-indicator').on('click', function(){
        const $this = $(this);

        if($this.closest(".acpt-metabox").length > 0){
            const metaBox = $this.closest(".acpt-metabox")[0];
            const metaBoxKey = geyMetaBoxVisibilityKey(metaBox);

            if(metaBox.classList.contains("closed")){
                removeCookie(metaBoxKey, path, domain);
            } else {
                setCookie(metaBoxKey, "1", 30, {
                    path: path,
                    domain: domain,
                    SameSite: "none",
                    Secure: true
                });
            }
        }
    });

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

        $$(`#${id}_value`).text(value);
    });

    /**
     * Add 'multipart/form-data' type to comment form
     */
    if($('#commentform').length){
        $('#commentform')[0].encoding = 'multipart/form-data';
    }

    /**
     * Reset all extra fields on Add Tag forms
     */
    const resetAddTagFields = () => {
        // blank all preview divs
        const previewDivs = [
            'image-preview',
            'file-preview',
            'preview-file',
            'acpt_map_preview',
            'acpt_map_multi_preview',
            'embed-preview',
        ];

        // extra fields to be blanked
        const extraFields = [
            'attachment_id',
            'city',
            'country',
            'currency',
            'dial',
            'forged_by',
            'label',
            'lat',
            'length',
            'lng',
            'weight',
        ];

        previewDivs.forEach(function(div){
            $(`#addtag .${div}`).html("");
        });

        const inputs = $(`#addtag`).find("input");

        inputs.each(function(){
            const input = $(this);
            const inputName = input.attr("name");

            if(inputName){
                extraFields.forEach(function(extraField){
                    let result = inputName.endsWith(`_${extraField}`);

                    if(result == true){
                        input.val('');
                    }
                });
            }
        });
    };

    /**
     * Reset fields when saving a new tag
     */
    $('#addtag').on('mousedown', '#submit', function () {
        resetAddTagFields();

        //
        // This is a fix for creating a new term with editor fields associated
        //
        // This fix was taken from: https://github.com/sheabunge/visual-term-description-editor/blob/master/src/php/class-editor.php
        //
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

    /*========== TABS, ACCORDIONS ==========*/

    $('.acpt-admin-horizontal-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parentTabs = $this.parent();
        const editLink = parentTabs.next(".acpt-edit-field-group");
        const id = $this.data('id');
        const target = $this.data('target');
        const targetPanels = $(`#${target}`).parent();

        if(editLink.length > 0){
            const oldURL = editLink.attr("href");
            let oldURLArr = oldURL.split("#");

            if(oldURLArr.length === 3){
                oldURLArr[2] = target;
                editLink.attr('href', oldURLArr.join('#'));
            }
        }

        parentTabs.children().removeClass('active');
        targetPanels.children().removeClass('active');

        $(`#${target}`).addClass('active');
        $this.addClass('active');

        // remember the selected tab
        if(id){
            setCookie(id, target, 30, {
                path: path,
                domain: domain,
                SameSite: "none",
                Secure: true
            });
        }
    });

    $('.acpt-admin-vertical-tab').on('click', function (e) {
        e.preventDefault();

        const $this = $(this);
        const parentTabs = $this.parent();
        const editLink = parentTabs.parent().prev(".acpt-admin-vertical-tabs-btn-wrapper").find(".acpt-edit-field-group");
        const id = $this.data('id');
        const target = $this.data('target');
        const targetPanels = $(`#${target}`).parent();

        if(editLink.length > 0){
            const oldURL = editLink.attr("href");
            let oldURLArr = oldURL.split("#");

            if(oldURLArr.length === 3){
                oldURLArr[2] = target;
                editLink.attr('href', oldURLArr.join('#'));
            }
        }

        parentTabs.children().removeClass('active');
        targetPanels.children().removeClass('active');

        $(`#${target}`).addClass('active');
        $this.addClass('active');

        // remember the selected tab
        if(id){
            setCookie(id, target, 30, {
                path: path,
                domain: domain,
                SameSite: "none",
                Secure: true
            });
        }
    });

    $('.acpt-admin-accordion-title').on('click', function (e) {
        if(e.target.classList.contains("acpt-edit-field-group")){
            return;
        }

        e.preventDefault();

        const $this = $(this);
        const parent = $this.parent('div');
        const id = parent.data('id');
        const target = parent.data('target');
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

        // remember the selected tab
        if(id){
            setCookie(id, target, 30, {
                path: path,
                domain: domain,
                SameSite: "none",
                Secure: true
            });
        }
    });
}

/**
 * Init selectize fields
 * @see https://selectize.dev/docs/api
 *
 * @param idSelector
 * @param wrapper
 * @param select2
 */
export const initSelectize = (idSelector = null, wrapper = null, select2 = true) => {
    try {
        if(jQuery().selectize) {
            const formatSelectizeItem = (item, escape) => {
                const relation_label_separator =  "<-------->";

                if(!item.text.includes(relation_label_separator)){
                    if(item.image){
                        return `<div class="selectize-item"><img src="${item.image}" alt="fdfd" width="50" /><div class="selectize-details"><span>${item.text}</span></div></div>`;
                    }

                    return `<div>${item.text}</div>`;
                }

                let explode = item.text.split(relation_label_separator);
                const thumbnail = explode[0];
                const cpt = explode[1];
                const label = explode[2];
                const thumbnailDiv = (thumbnail) ? `<div class="selectize-thumbnail"><img src="${thumbnail}" alt="${label}" width="40" /></div>` : `<div class="selectize-thumbnail"><span class="selectize-thumbnail-no-image"></span></div>`;

                return `<div class="selectize-item">${thumbnailDiv}<div class="selectize-details"><span class='acpt-badge'>${cpt}</span><span>${label}</span></div></div>`;
            };

            let selector = `${wrapper ? wrapper : ""} .acpt-select2`;
            if(idSelector){
                selector = `${wrapper ? wrapper : ""} #${idSelector}`;
            }

            const selectElements = $$(selector).get();

            selectElements.forEach((el) => {
                const element = $(el);

                // if the element is already selectized, skip
                if(element.hasClass("selectized")){
                    return;
                }

                /**
                 * init selectize element
                 */
                const initSelectizeElement = (max = null) => {
                    let options = {
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
                    };

                    if(max){
                        options.maxItems = max;
                    }

                    // Init selectize on element.
                    // Use standard <select> elements for fields in the Media Library popup.
                    if(select2 === true){
                        element.selectize(options);
                    } else {
                        element.show();
                    }

                    element.siblings(".acpt-placeholder").remove();
                };

                // populate the <select> with AJAX
                if(element.hasClass("acpt-select2-ajax")){
                    const fieldType = element.data("field-type");
                    const toType = element.data("to-type");
                    const toValue = element.data("to-value");
                    const postType = element.data("post-type");
                    const postStatus = element.data("post-status");
                    const postTaxonomy = element.data("post-taxonomy");
                    const termTaxonomy = element.data("term-taxonomy");
                    const userRole = element.data("user-role");
                    const defaultValues = element.data("default-values");
                    const layout = element.data("layout");
                    const restrictLoggedUserPosts = element.data("restrict-logged-user-posts");
                    const min = element.data("min");
                    const max = element.data("max");

                    $.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            "action": "generateRelationalFieldOptionsAction",
                            "data": JSON.stringify({
                                "id": idSelector,
                                "fieldType": fieldType,
                                "toType": toType,
                                "toValue": toValue,
                                "postType": postType,
                                "postStatus": postStatus,
                                "postTaxonomy": postTaxonomy,
                                "termTaxonomy": termTaxonomy,
                                "userRole": userRole,
                                "defaultValues": defaultValues,
                                "layout": layout,
                                "restrictLoggedUserPosts": restrictLoggedUserPosts,
                                "format": "data"
                            }),
                        },
                        success: function(data) {
                            data.fields && data.fields.map((item) => {
                                const label = item.label;

                                if(item.value){
                                    element.append($('<option>', {
                                        value: item.value,
                                        text: item.label,
                                        selected: item.selected,
                                    }));
                                } else if(item.options){
                                    const optgroup = $('<optgroup>', {
                                        label: label
                                    });

                                    item.options.map((option) => {
                                        optgroup.append($('<option>', {
                                            value: option.value,
                                            text: option.label,
                                            selected: option.selected,
                                        }));
                                    });

                                    element.append(optgroup);
                                }
                            });

                            initSelectizeElement(max);
                        },
                        dataType: 'json'
                    });
                } else {
                    initSelectizeElement();
                }
            });

        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Init textarea counter
 *
 * @param idSelector
 * @param wrapper
 */
export const initTextarea = (idSelector = null, wrapper = null) => {
    try {
        let selector = `${wrapper ? wrapper : ""} .acpt-textarea`;
        if(idSelector){
            selector = `${wrapper ? wrapper : ""} #${idSelector}`;
        }

        const textareaElement = $$(selector);
        const textareaCounter = textareaElement.next('.acpt-textarea-ch-counter');

        if(textareaElement.length && textareaCounter.length){
            textareaElement.on("keyup", function(e){
                const value = e.target.value.length;
                const count = textareaCounter.find(".count");
                const max = parseInt(textareaCounter.data("max"));
                const min = parseInt(textareaCounter.data("min"));

                if(value < min || value >= max){
                    count.removeClass("warning");
                    count.addClass('danger');
                } else if(value >= max-5){
                    count.removeClass("danger");
                    count.addClass('warning');
                } else {
                    count.removeClass("warning");
                    count.removeClass("danger");
                }

                count.text(value);
            });
        }

    } catch (e) {
        console.error(e);
    }
};

/**
 * Inject "Edit meta box" buttons into meta box headers via DOM manipulation.
 * This avoids putting HTML in the add_meta_box title (which causes Gutenberg
 * to display raw markup in Preferences > Advanced).
 */
export const initEditMetaBoxButtons = () => {
    const placeholders = document.querySelectorAll('.acpt-edit-button-placeholder[data-acpt-edit-url]');

    placeholders.forEach(function(placeholder) {
        const url = placeholder.getAttribute('data-acpt-edit-url');
        const label = placeholder.getAttribute('data-acpt-edit-label') || 'Edit meta box';

        // Find the closest postbox container
        const postbox = placeholder.closest('.postbox, .acpt-metabox');

        if (!postbox) {
            return;
        }

        // Find the header area where the button should be placed
        const header = postbox.querySelector('.postbox-header') || postbox.querySelector('.acpt-admin-accordion-title');

        if (!header) {
            return;
        }

        // Avoid duplicates
        if (header.querySelector('.acpt-edit-field-group')) {
            return;
        }

        const h2 = header.querySelector("h2");

        if(!h2){
            return;
        }

        const button = document.createElement('a');
        button.className = 'acpt-edit-field-group';
        button.target = '_blank';
        button.href = url;
        button.textContent = label;

        h2.after(button);
    });
};

window.addEventListener('load', function () {

    /**
     * ===================================================================
     * HELPERS
     * ===================================================================
     */

    function isNumeric(str) {
        if (typeof str != "string") return false;

        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    function debounce(func, timeout = 300){
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    function escapeIdSelector(selector) {
        let escaped = selector.replaceAll("[", "\\[");
        escaped = escaped.replaceAll("]", "\\]");

        return escaped;
    }

    /**
     *
     * @return {Date}
     */
    const today = () => {
        return new Date();
    };

    /**
     *
     * @param days
     * @return {Date}
     */
    const todayPlusDays = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);

        return date;
    };

    /**
     *
     * @param action
     * @param data
     * @return {Promise<Response>}
     */
    const makeAjaxCall = (action, data) => {
        let url = document.location.origin+document.globals.ajax_url;

        const _data = {
            "action": action,
            "data": JSON.stringify(data)
        };

        return fetch(url, {
            method: 'POST',
            body: (new URLSearchParams(_data)).toString(),
            headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        })
    };

    /**
     * ===================================================================
     * FORM SUBMISSION
     * ===================================================================
     */

    const handleFormSubmissions = () => {
        const forms = document.querySelectorAll("[data-acpt-sync-form]");

        for (let i = 0; i < forms.length; i++) {
            const form = forms.item(i);
            const formId = form.dataset.id;
            const formSubmitButton = form.querySelector("[type=submit]");
            const formSpinner = form.querySelector(".acpt-form-spinner");
            const formMessages = form.previousSibling;
            const timeoutMessages = 4000;

            const clearAlerts = () => {
                formMessages.innerHTML = "";
            };

            const applyFieldError = (id, message) => {
                const field = document.getElementById(id);

                if(field){
                    const input = field.querySelector(".acpt-form-control");
                    const errors = field.querySelector(".acpt-error-list");

                    if(input && errors){
                        const error = document.createElement("li");
                        error.innerHTML = message;
                        errors.append(error);
                        input.classList.add("has-errors");
                    }
                }
            };

            /**
             * Show an general form alert dismissable after 4 seconds
             * @param message
             * @param level
             */
            const showAlert = (message, level) => {
                const alert = document.createElement("div");
                alert.classList.add("acpt-message");
                alert.classList.add(`acpt-${level}-message`);
                alert.innerHTML = message;

                formMessages.appendChild(alert);
                alert.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                setTimeout(() => alert.remove(), timeoutMessages);
            };

            const safeRedirectTo = (url) => {

                // Blank, null, undefined → reload same page
                if (!url || typeof url !== "string" || url.trim() === "") {
                    window.location.reload();
                    return;
                }

                try {
                    const targetUrl = new URL(url, window.location.href);
                    window.location.href = targetUrl.href;
                } catch (e) {
                    showAlert("Cannot redirect to the provided URL: " + e.message(), "error");
                }
            };

            form.addEventListener("submit", function(e){
                e.preventDefault();

                formSpinner.classList.add("visible");
                formSpinner.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                formSubmitButton.disabled = true;
                clearAlerts();
                const id = e.target.id;
                let url = document.globals.rest_url+"acpt/v1/form/submission/"+id;
                let formData = new FormData(e.target);

                fetch(url, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'X-WP-Nonce': document.globals.rest_nonce
                    },
                })
                .then(res => res.json())
                .then(res => {

                    const {outcome, errors, redirectTo, redirectTimeout} = res;

                    if(errors.length === 0){
                        form.reset();
                        showAlert(outcome, "success");
                        formSpinner.classList.remove("visible");
                        setTimeout(() => safeRedirectTo(redirectTo), typeof redirectTimeout === "number" ? redirectTimeout*1000 : timeoutMessages);
                    } else {
                        errors.map((error)=> {

                            formSpinner.classList.remove("visible");

                            // general form errors
                            if(error.id === id || error.id === formId){
                                showAlert(error.message, "error");
                            }

                            applyFieldError(error.id, error.message);
                        });

                        formSubmitButton.disabled = false;
                    }
                })
                .catch(e => {
                    console.error(e);
                });
            });
        }
    };

    handleFormSubmissions();

    /**
     * ===================================================================
     * BUTTON EVENTS
     * ===================================================================
     */

    /**
     *
     * @param step
     * @param steplistElements
     * @param stepContentElements
     */
    const goToStep = (step, steplistElements, stepContentElements) => {

        const activeTheTab = (el, index) => {
            if(step === index){
                el.classList.add("active");
                el.classList.remove("undone");
                el.classList.remove("done");
            } else {

                if(step > index){
                    el.classList.add("done");
                } else {
                    el.classList.add("undone");
                }

                el.classList.remove("active");
            }
        };

        steplistElements.map(activeTheTab);
        stepContentElements.map(activeTheTab);
    };

    /**
     *
     * @param form
     * @return {boolean}
     */
    const isStepFormValid = (form) => {

        let m = 0;

        const errors = form.querySelectorAll(".acpt-error-list");
        for (let i = 0; i < errors.length; i++) {
            const error = errors.item(i);
            m = m + error.children.length;
        }

        return m === 0;
    };

    const handleButtonEvents = () => {
        const buttons = document.body.querySelectorAll('[data-acpt-button]');

        if(buttons.length > 0) {
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons.item(i);

                button.addEventListener("click", function(e){
                    e.preventDefault();

                    const action = button.dataset.acptAction;
                    const form = button.closest("form");
                    const stepWrapper = button.closest(".acpt-steps-wrapper");
                    const steplist = stepWrapper.querySelector(".steplist");
                    const steplistElements = Array.from(steplist.querySelectorAll("li"));
                    const stepContentElements = Array.from(stepWrapper.querySelectorAll(".acpt-accordion-step-content"));
                    const activeStep = stepContentElements.findIndex((step)=>{
                        return step.classList.contains("active");
                    });

                    switch (action) {
                        case "goToNextStep":
                            let nextStep = activeStep+1;

                            if(nextStep > stepContentElements.lenght){
                                nextStep = stepContentElements.lenght;
                            }

                            setTimeout(function() {
                                if(isStepFormValid(form)){
                                    goToStep(nextStep, steplistElements, stepContentElements);
                                }
                            }, 100);

                            break;

                        case "goToPrevStep":

                            let prevStep = activeStep-1;

                            if(prevStep < 0){
                                prevStep = 0;
                            }

                            goToStep(prevStep, steplistElements, stepContentElements);
                            break;
                    }
                });
            }
        }
    };

    handleButtonEvents();

    /**
     * ===================================================================
     * FIELDS
     * ===================================================================
     */

    // Tab fields
    const handleTabFields = () => {
        const tabs = document.getElementsByClassName("acpt-tabs-wrapper");

        if(tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs.item(i);
                const links = tab.getElementsByClassName("acpt-accordion-tab");
                const contents = tab.getElementsByClassName("acpt-accordion-tab-content");

                if(links.length > 0){
                    for (let k = 0; k < links.length; k++) {
                        const link = links.item(k);
                        const content = contents.item(k);

                        link.addEventListener("click", function(e){
                            e.preventDefault();
                            const tabIndex = link.dataset.tabIndex;

                            for (let c = 0; c < links.length; c++) {
                                const l = links.item(c);
                                const d = contents.item(c);

                                l.classList.remove("active");
                                d.classList.remove("active");
                            }

                            link.classList.add("active");
                            content.classList.add("active");
                        });
                    }
                }
            }
        }
    };

    handleTabFields();

    // ID fields
    const handleIDs = () => {
        const ids = document.getElementsByClassName("acpt-id-value");

        if(ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                const el = ids.item(i);

                if(el){
                    const target = el;
                    const targetId = target.id;
                    const generateButton = document.querySelector(".acpt-id-generate[data-target-id=" + "\'" + targetId + "\'" + "]");
                    const strategy = generateButton.dataset.idStrategy;
                    const index = generateButton.dataset.index;

                    const generateId = () => {
                        makeAjaxCall("generateIdAction", {
                            "strategy": strategy,
                            "index": index,
                        })
                            .then(response => {
                                return response.text();
                            })
                            .then(response => {
                                const data = JSON.parse(response);

                                if(data.id){
                                    target.value = data.id;
                                }
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    };

                    generateButton.addEventListener("click", function(e){
                        e.preventDefault();
                        e.stopPropagation();

                        generateId();
                    });
                }
            }
        }
    };

    handleIDs();

    // Date fields
    const handleDateFields = (pickerFormat) => {

        const allowedFormats = [
            'date',
            'datetime',
            'daterange',
            'time',
        ];

        if(!allowedFormats.includes(pickerFormat)){
            return;
        }

        if(typeof moment !== "function"){
            return;
        }

        let selector;

        switch (pickerFormat) {
            case 'date':
                selector = 'acpt-datepicker';
                break;

            case 'datetime':
                selector = 'acpt-datetimepicker';
                break;

            case 'daterange':
                selector = 'acpt-daterangepicker';
                break;

            case 'time':
                selector = 'acpt-timepicker';
                break;
        }

        const dateFields = document.getElementsByClassName(selector);

        if(dateFields.length > 0){
            for (let i = 0; i < dateFields.length; i++) {
                const dateElement = dateFields.item(i);

                const value = dateElement.value;
                const maxDate = dateElement.dataset.maxDate;
                const minDate = dateElement.dataset.minDate;
                const format = dateElement.dataset.format ?? 'YYYY-MM-DD';
                const clearBtn = dateElement.nextElementSibling;

                clearBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    dateElement.value = "";
                });

                /**
                 * Get picker settings
                 * @return {{drops: string, timePicker: boolean, singleDatePicker: boolean, showDropdowns: boolean, locale: {format: *}}|{drops: string, endDate, singleDatePicker: boolean, showDropdowns: boolean, locale: {format: *}, startDate}|{drops: string, singleDatePicker: boolean, showDropdowns: boolean, locale: {format: *}}}
                 */
                const settings = () => {

                    // daterange
                    if(pickerFormat === 'daterange'){

                        const startDate = value ? value.split(" - ")[0] : moment(today()).format(format);
                        const endDate = value ? value.split(" - ")[1] : moment(todayPlusDays(7)).format(format);

                        let s = {
                            drops: 'up',
                            startDate: startDate,
                            endDate: endDate,
                            showDropdowns: true,
                            singleDatePicker: false,
                            locale: {
                                format: format
                            }
                        };

                        if(typeof maxDate !== "undefined"){
                            s.maxDate = maxDate;
                        }

                        if(typeof minDate !== "undefined"){
                            s.minDate = minDate;
                        }

                        return s;
                    }

                    // datetime
                    if(pickerFormat === 'datetime'){
                        return {
                            drops: 'up',
                            showDropdowns: true,
                            timePicker: true,
                            singleDatePicker: true,
                            locale: {
                                format: format
                            }
                        };
                    }

                    // time
                    if(pickerFormat === 'time'){
                        return {
                            drops: 'up',
                            showDropdowns: true,
                            datePicker: false,
                            timePicker: true,
                            singleDatePicker: true,
                            locale: {
                                format: format
                            }
                        };
                    }

                    return {
                        drops: 'up',
                        showDropdowns: true,
                        singleDatePicker: true,
                        locale: {
                            format: format
                        }
                    };
                };

                jQuery(dateElement).daterangepicker(settings()).on('show.daterangepicker', function (ev, picker) {
                    if(pickerFormat === 'time'){
                        picker.container.find(".calendar-table").hide();
                    }
                });
            }
        }
    };

    handleDateFields("daterange");
    handleDateFields("date");
    handleDateFields("datetime");
    handleDateFields("time");

    // Country fields
    const handleCountryFields = () => {
        const countryFields = document.getElementsByClassName("acpt-country");

        if(countryFields.length > 0){
            for (let i = 0; i < countryFields.length; i++) {
                const countryElement = countryFields.item(i);
                const jCountryElement = jQuery(countryElement);
                const isoCodeElement = document.getElementById(`${countryElement.id}_country`);

                jCountryElement.countrySelect({
                    defaultCountry: isoCodeElement.value,
                    preferredCountries: [],
                });

                jCountryElement.on("change",(e) => {
                    const countryData = jCountryElement.countrySelect("getSelectedCountryData");
                    isoCodeElement.value = countryData.iso2;
                });
            }
        }
    };

    handleCountryFields();

    // Phone fields
    const handlePhoneFields = () => {
        const phoneFields = document.getElementsByClassName("acpt-phone");

        if(phoneFields.length > 0){
            for (let i = 0; i < phoneFields.length; i++) {
                const phoneElement = phoneFields.item(i);
                const country = document.getElementById(`${phoneElement.id}_country`);
                const dialCode = document.getElementById(`${phoneElement.id}_dial`);
                const utilsPath = document.getElementById(`${phoneElement.id}_utils`);

                const iti = intlTelInput(phoneElement, {
                    initialCountry: country.value,
                    separateDialCode: true,
                    geoIpLookup: callback => {
                        fetch("https://ipapi.co/json")
                            .then(res => res.json())
                            .then(data => callback(data.country_code))
                            .catch(() => callback("us"));
                    },
                    loadUtils: () => import(utilsPath.value),
                });

                // on change country
                phoneElement.addEventListener("countrychange", function(e) {
                    const countryData = iti.getSelectedCountryData();

                    if(countryData.iso2 && countryData.dialCode){
                        country.value = countryData.iso2;
                        dialCode.value = countryData.dialCode;
                    }
                });
            }
        }
    };

    handlePhoneFields();

    // Character counter
    const handleTextareaCharacterCounter = () => {
        const textAreas = document.getElementsByClassName("acpt-textarea");

        if(textAreas.length > 0){
            for (let i = 0; i < textAreas.length; i++) {
                const textArea = textAreas.item(i);
                const textareaCounter = textArea.nextElementSibling;

                // Only textareas configured with a character counter have a sibling
                // `.acpt-textarea-counter` element holding a `.count` node — a plain
                // textarea's nextElementSibling is its error list (or nothing), so
                // guard before wiring the keyup handler.
                const count = textareaCounter ? textareaCounter.querySelector(".count") : null;

                if (!count) {
                    continue;
                }

                textArea.addEventListener("keyup", function (e) {

                    const value = e.target.value.length;
                    const max = parseInt(textareaCounter.dataset.max);
                    const min = parseInt(textareaCounter.dataset.min);

                    if(value < min || value >= max){
                        count.classList.remove("warning");
                        count.classList.add('danger');
                    } else if(value >= max-5){
                        count.classList.remove("danger");
                        count.classList.add('warning');
                    } else {
                        count.classList.remove("warning");
                        count.classList.remove("danger");
                    }

                    count.textContent = value;
                });
            }
        }
    };

    handleTextareaCharacterCounter();

    // File fields
    const handleFileFieldsDefaultValue = () => {

        const deleteLinks = document.getElementsByClassName("acpt-delete-file");
        const uploadFields = document.getElementsByClassName("acpt-file");

        if(deleteLinks.length > 0){
            for (let i = 0; i < deleteLinks.length; i++) {
                const link = deleteLinks.item(i);
                const target = link.dataset.target;
                const value = link.dataset.value;
                const attachmentId = link.dataset.attachmentId;

                link.addEventListener("click", function (e) {
                    e.preventDefault();

                    const targetEl = document.getElementById(target);

                    let parsed;
                    try { parsed = JSON.parse(targetEl.value); } catch (_) { parsed = null; }

                    if (Array.isArray(parsed)) {
                        targetEl.value = JSON.stringify(
                            parsed.filter(item => {
                                if (typeof item === 'object') {
                                    if (attachmentId && item.attachment_id) {
                                        return String(item.attachment_id) !== String(attachmentId);
                                    }
                                    return item.url !== value;
                                }
                                return item !== value;
                            })
                        );
                    } else if (parsed && typeof parsed === 'object') {
                        const isMatch = (attachmentId && parsed.attachment_id)
                            ? String(parsed.attachment_id) === String(attachmentId)
                            : parsed.url === value;

                        if(isMatch){
                            targetEl.value = "";
                        }
                    } else {
                        targetEl.value = targetEl.value.split(",").filter(v => v !== value).join(",");
                    }

                    link.parentElement.remove();
                });
            }
        }

        if(uploadFields.length > 0){
            for (let i = 0; i < uploadFields.length; i++) {
                const field = uploadFields.item(i);
                const target = field.dataset.targetId;

                field.addEventListener("change", function (e) {
                    document.getElementById(target).value = '';
                });
            }
        }
    };

    handleFileFieldsDefaultValue();

    // Color picker
    const handleColorPicker = () => {
        const colorPickerInputs = document.getElementsByClassName("acpt-color-picker");

        if(colorPickerInputs.length > 0) {
            for (let i = 0; i < colorPickerInputs.length; i++) {
                const el = colorPickerInputs.item(i);
                const input = el.querySelector("input");
                const label = el.querySelector(".color_val");

                if(input){
                    input.addEventListener("change", function(e){
                        label.innerHTML = e.target.value;
                    });
                }
            }
        }
    };

    handleColorPicker();

    const handleChoices = () => {
        const choicesInputs = document.getElementsByClassName("acpt-select2");

        if(typeof TomSelect === 'function' && choicesInputs.length > 0) {
            for (let i = 0; i < choicesInputs.length; i++) {
                const el = choicesInputs.item(i);

                if(el){
                    new TomSelect(el, {
                        plugins: ['remove_button', 'clear_button'],
                        placeholder: "Select item(s)",
                        persist: false,
                        create: false,
                        render: {
                            item: function (data, escape) {
                                return '<div class="item acpt-item">' + escape(data.text) + '</div>';
                            },
                        }
                    });
                }
            }
        }
    };

    handleChoices();

    // Icon picker
    const handleIconPicker = () => {
        if(typeof IconPicker === 'function'){

            const iconPickerInputs = document.getElementsByClassName("acpt-iconpicker");

            if(iconPickerInputs.length > 0) {
                for (let i = 0; i < iconPickerInputs.length; i++) {

                    const target = iconPickerInputs.item(i).dataset.target;
                    const iconPickerInput = new IconPicker(iconPickerInputs.item(i), {
                        theme: 'bootstrap-5',
                        iconSource: [
                            'Iconoir',
                            'FontAwesome Solid 6',
                        ],
                        closeOnSelect: true
                    });

                    const iconElementInput = document.getElementById(target+"_target");
                    const iconElementValue = document.getElementById(target+"_svg");

                    iconPickerInput.on('select', (icon) => {

                        if (iconElementInput.innerHTML !== '') {
                            iconElementInput.innerHTML = '';
                        }

                        iconElementInput.className = `acpt-selected-icon ${icon.name}`;
                        iconElementInput.innerHTML = icon.svg;
                        iconElementValue.value = icon.svg;
                    });
                }
            }
        }
    };

    handleIconPicker();

    // CodeMirror
    const handleCodeMirror = () => {
        if(typeof CodeMirror === 'function'){
            const codeMirrors = document.getElementsByClassName("acpt-codemirror");

            // check if CodeMirror is already instantiated
            if(codeMirrors.length > 0){
                for (let i = 0; i < codeMirrors.length; i++) {

                    const el = codeMirrors.item(i);

                    if(!el.nextElementSibling.classList.contains("CodeMirror")){
                        const editor = CodeMirror.fromTextArea(el, {
                            lint: false,
                            lineWrapping: true,
                            lineNumbers: true,
                            indentWithTabs: true,
                            indentUnit: 2,
                            tabSize: 2,
                            matchBrackets: true,
                            mode: "application/x-httpd-php",
                        });

                        // evaluate code
                        const evaluateButton = document.querySelector(`.acpt-evaluate-code[data-target-id="${el.id}"]`);

                        evaluateButton.addEventListener("click", function(e){
                            e.preventDefault();

                            makeAjaxCall("evaluateCodeAction", {
                                "code": editor.getValue()
                            })
                                .then(response => {
                                    return response.text();
                                })
                                .then(response => {
                                    const data = JSON.parse(response);
                                    const CodeMirrorEl = el.nextElementSibling;
                                    const outcomeEl = e.target.nextElementSibling;

                                    if(data.errors && typeof data.errors.message === "string"){

                                        let codeMirrorClassName;
                                        let className;
                                        let level;

                                        switch (data.errors.code) {
                                            case 0:
                                                level = "ERROR";
                                                className = 'failure';
                                                codeMirrorClassName = 'is-invalid';
                                                break;

                                            case 1:
                                                level = "WARNING";
                                                className = 'warning';
                                                codeMirrorClassName = 'is-warning';
                                                break;

                                            default:
                                                level = "NOTICE";
                                                className = 'info';
                                                codeMirrorClassName = 'is-notice';
                                                break;
                                        }

                                        //CodeMirrorEl.classList.add(codeMirrorClassName);
                                        outcomeEl.innerHTML = `
                                            <span class='${className}'>
                                                ${level}: ${data.errors.message} on line ${data.errors.line}
                                            </span>
                                        `;
                                    } else {
                                        //CodeMirrorEl.classList.add("is-valid");
                                        outcomeEl.innerHTML = "<span class='success'>OK</span>";
                                    }

                                })
                                .catch(e => {
                                    console.error(e);
                                });
                        });
                    }
                }
            }
        }
    };

    handleCodeMirror();

    // Barcode
    const handleBarcodeGenerator = () => {
        if(typeof JsBarcode === "function"){
            const barCodes = document.getElementsByClassName("acpt-barcode-wrapper");

            if(barCodes.length > 0){
                for (let i = 0; i < barCodes.length; i++) {
                    const el = barCodes.item(i);

                    const value = el.querySelector(".value");
                    const format = el.querySelector(".format");
                    const color = el.querySelector(".color");
                    const bgColor = el.querySelector(".bgColor");
                    const clearButton = el.querySelector(".clear-barcode");
                    const barcodeSvg = el.querySelector(".acpt-barcode-svg");
                    const barcodeErrors = el.querySelector(".acpt-barcode-errors");
                    const barcodeSvgId = barcodeSvg.id;
                    const barcodeSvgElement = document.getElementById(`acpt-barcode-${barcodeSvgId}`);
                    const barcodeValueInput =  document.getElementById(`barcode_value_${barcodeSvgId.replace("acpt-barcode-", "")}`);

                    /**
                     * Clear the UI
                     */
                    const clearUI = () => {
                        barcodeSvg.innerHTML = `<svg class="acpt-barcode" id="${barcodeSvgId}"></svg>`;
                    };

                    const clearErrors = () => {
                        barcodeSvgElement.classList.remove("has-errors");
                        barcodeErrors.innerHTML = ``;
                    };

                    const addError = (err) => {
                        barcodeSvgElement.classList.add("has-errors");
                        barcodeErrors.innerHTML = err;
                    };

                    /**
                     * Clear the form
                     */
                    const clearForm = () => {
                        clearUI();
                        value.value = '';
                        format.value = 'code128';
                        color.value = '#000000';
                        bgColor.value = '#ffffff';
                        barcodeValueInput.value = '';
                    };

                    /**
                     *
                     * @param text
                     * @return {*}
                     */
                    function escapeHtml(text) {
                        var map = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#039;'
                        };

                        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
                    }

                    /**
                     * Generate barcode and populate the form
                     */
                    const generateBarcode = () => {
                        try {
                            clearErrors();

                            JsBarcode(`#${barcodeSvgId}`, value.value, {
                                format: format.value ? format.value : "code128",
                                background: bgColor.value ? bgColor.value : "#ffffff",
                                lineColor: color.value ? color.value : "#000000",
                            });

                            const barcodeValue = {
                                svg: escapeHtml(barcodeSvgElement.outerHTML),
                                format: format.value ? format.value : "code128",
                                bgColor: bgColor.value ? bgColor.value : "#ffffff",
                                color: color.value ? color.value : "#000000",
                            };

                            barcodeValueInput.value = JSON.stringify(barcodeValue);
                        } catch (e) {
                            console.log(e);
                            clearForm();
                            addError(`The value "${value.value}" is not valid for ${format.value} format`);
                        }
                    };

                    // clear the form
                    clearButton.addEventListener("click", function(e){
                        e.preventDefault();
                        clearForm();
                    });

                    value.addEventListener("keyup", debounce((e) => {
                        generateBarcode();
                    }, 1000));

                    format.addEventListener("change", function(e){
                        generateBarcode();
                    });

                    color.addEventListener("change", debounce((e) => {
                        generateBarcode();
                    }, 1000));

                    bgColor.addEventListener("change", debounce((e) => {
                        generateBarcode();
                    }, 1000));
                }
            }
        }
    };

    handleBarcodeGenerator();

    // QR Code
    const handleQRCodeGenerator = () => {
        if(typeof QRCode === "function"){
            const qrCodes = document.getElementsByClassName("acpt-qr-code-wrapper");

            if(qrCodes.length > 0){
                for (let i = 0; i < qrCodes.length; i++) {
                    const el = qrCodes.item(i);
                    const url = el.querySelector(".url");
                    const resolution = el.querySelector(".resolution");
                    const colorDark = el.querySelector(".color-dark");
                    const colorLight = el.querySelector(".color-light");
                    const clearButton = el.querySelector(".clear-qr-code");
                    const QRCodeImage = el.querySelector(".acpt-qr-code");
                    const QRCodeImageId = QRCodeImage.id;
                    const QRCodeValueInput = document.getElementById(`qr_code_value_${QRCodeImageId.replace("acpt-qr-code-", "")}`);

                    /**
                     * Clear the UI
                     */
                    const clearUI = () => {
                        QRCodeImage.innerHTML = "";
                    };

                    /**
                     * Clear the form
                     */
                    const clearForm = () => {
                        clearUI();
                        url.value = '';
                        resolution.value = 100;
                        colorDark.value = '#000000';
                        colorLight.value = '#ffffff';
                        QRCodeValueInput.value = '';
                    };

                    /**
                     *
                     * @return {boolean}
                     */
                    const isURLValid = (urlString) => {
                        try {
                            return Boolean(new URL(urlString));
                        }
                        catch(e){
                            return false;
                        }
                    };

                    /**
                     * Generate QR Code and populate the form
                     */
                    const generateQRCode = () => {
                        if (!isURLValid(url.value)) {
                            clearForm();
                            return;
                        }

                        clearUI();
                        const element = document.getElementById(QRCodeImageId);

                        const qrCode = new QRCode(element, {
                            text: url.value,
                            width: resolution.value,
                            height: resolution.value,
                            colorDark : colorDark.value ? colorDark.value :"#000000",
                            colorLight : colorLight.value ? colorLight.value : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });

                        const QRCodeImageSrc = element.children[0].toDataURL("image/png");

                        const QRCodeValue = {
                            img: QRCodeImageSrc,
                            resolution: resolution.value,
                            colorDark : colorDark.value ? colorDark.value :"#000000",
                            colorLight : colorLight.value ? colorLight.value : "#ffffff"
                        };

                        if(QRCodeValueInput){
                            QRCodeValueInput.value = JSON.stringify(QRCodeValue);
                        }
                    };

                    // clear the form
                    clearButton.addEventListener("click", function(e){
                        e.preventDefault();
                        clearForm();
                    });

                    url.addEventListener("keyup", debounce((e) => {
                        generateQRCode();
                    }, 1000));

                    resolution.addEventListener("change", function(e){
                        generateQRCode();
                    });

                    colorDark.addEventListener("change", debounce((e) => {
                        generateQRCode();
                    }, 1000));

                    colorLight.addEventListener("change", debounce((e) => {
                        generateQRCode();
                    }, 1000));
                }
            }
        }
    };

    handleQRCodeGenerator();

    // Quill
    const handleQuill = () => {
        if(typeof Quill === 'function'){
            const quills = document.getElementsByClassName("acpt-quill");

            if(quills.length > 0){
                for (let i = 0; i < quills.length; i++) {

                    const el = quills.item(i);
                    const input  = document.getElementById(`${el.id}_hidden`);
                    const form = input.closest("form");
                    const button = form.querySelector('[type="submit"]');
                    const textareaCounter = el.nextElementSibling;
                    const errors = textareaCounter.nextElementSibling;
                    const max = parseInt(textareaCounter.dataset.max);
                    const min = parseInt(textareaCounter.dataset.min);
                    const rows = parseInt(el.dataset.rows);
                    const cols = parseInt(el.dataset.cols);

                    // check if Quill is already instantiated
                    if(!el.previousElementSibling.classList.contains("ql-toolbar")){

                        const addMinLengthError = () => {

                            const error = `Min length ${min}`;

                            input.setCustomValidity(error);
                            input.reportValidity();
                            el.classList.add("invalid");

                            if(errors){
                                errors.innerHTML = `<li>${error}</li>`;
                            }

                            if(button){
                                button.disabled = true;
                            }
                        };

                        const removeMinLengthError = () => {
                            input.setCustomValidity("");
                            input.reportValidity();
                            el.classList.remove("invalid");

                            if(errors){
                                errors.innerHTML= '';
                            }

                            if(button){
                                button.disabled = false;
                            }
                        };

                        const quill = new Quill(`#${escapeIdSelector(el.id)}`, {
                            modules: {
                                toolbar: [
                                    ['bold', 'italic'],
                                    ['link', 'blockquote', 'code-block', 'image'],
                                    [
                                        { list: 'ordered' },
                                        { list: 'bullet' }
                                    ],
                                ],
                            },
                            theme: 'snow'
                        });

                        // set editor height
                        const element = document.getElementById(`${escapeIdSelector(el.id)}`);

                        if(element){
                            const qlEditor = element.querySelector(".ql-editor");
                            qlEditor.style.height = `${(rows * 25)}px`;
                        }

                        // min length error handling
                        if(button){
                            button.addEventListener("click", function (e) {
                                const val   = quill.getLength()-1;

                                if (val < min) {
                                    e.preventDefault();
                                    addMinLengthError();
                                }
                            });
                        }

                        // untouched quill elements
                        form.addEventListener("submit", function (e) {

                            const val   = quill.getLength()-1;

                            if (val < min) {
                                e.preventDefault();
                                addMinLengthError();
                            }
                        });

                        // update editor
                        quill.on('text-change', function(delta, oldDelta, source) {

                            const text  = quill.getText();
                            const val   = quill.getLength()-1;
                            const value = quill.container.firstChild.innerHTML;
                            const count = textareaCounter.querySelector(".count");

                            if(input){

                                // MIN
                                if(isNumeric(min)){
                                    if (val < min) {
                                        addMinLengthError();
                                    } else {
                                        removeMinLengthError();
                                    }
                                }

                                // MAX
                                if (isNumeric(max) && val >= max) {
                                    quill.history.undo();
                                }

                                // Char counter CSS classes
                                if(count){
                                    if(val < min || val >= max){
                                        count.classList.remove("warning");
                                        count.classList.add('danger');
                                    } else if(val >= (max-5)){
                                        count.classList.remove("danger");
                                        count.classList.add('warning');
                                    } else {
                                        count.classList.remove("warning");
                                        count.classList.remove("danger");
                                    }

                                    count.textContent = val;
                                }

                                input.value = value;
                            }
                        });
                    }
                }
            }
        }
    };

    handleQuill();

    // List field
    const handleListFields = () => {

        // Add elements to the list
        const addElementsLink = document.getElementsByClassName("list-add-element");

        if(addElementsLink.length > 0){
            for (let i = 0; i < addElementsLink.length; i++) {
                const link = addElementsLink.item(i);

                link.addEventListener("click", function (e) {
                    e.preventDefault();

                    const $targetId = link.dataset.targetId;
                    const $parentName = link.dataset.parentName;
                    const $label = link.dataset.label || '';
                    const $listWrapper = document.getElementById($targetId);
                    const $nextId = $listWrapper.children.length;
                    const $ariaLabel = ($label + ' ' + ($nextId + 1)).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

                    const newElement = document.createElement('div');
                    newElement.classList.add("acpt-form-inline");
                    newElement.id = $parentName+"_"+$nextId;
                    newElement.insertAdjacentHTML('beforeend', `
                        <input
                                id='${$parentName}_${$nextId}'
                                name='${$parentName}[]'
                                type='text'
                                class="acpt-form-control"
                                aria-label="${$ariaLabel}"
                            />
                            <a 
                                class='list-remove-element' 
                                data-target-id='${$parentName}_${$nextId}' 
                                href='#'
                                title='Remove element'
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' 
                                    width='24' 
                                    height='24' 
                                    viewBox='0 0 24 24' 
                                    style='fill: rgba(0, 0, 0, 1);transform: ;msFilter:;'
                                >
                                    <path d='M7 11h10v2H7z'></path>
                                    <path d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z'></path>
                                </svg>
                            </a>
                    `);

                    $listWrapper.append(newElement);

                    handleDeleteElements();
                });
            }
        }

        // Remove list element
        const handleDeleteElements = () => {

            const removeListLinks = document.getElementsByClassName("list-remove-element");

            if(removeListLinks.length > 0){
                for (let i = 0; i < removeListLinks.length; i++) {
                    const link = removeListLinks.item(i);

                    link.addEventListener("click", function (e) {
                        e.preventDefault();

                        const $targetId = link.dataset.targetId;
                        const $target = document.getElementById($targetId);

                        if($target){
                            $target.remove();
                        }
                    });
                }
            }
        };

        handleDeleteElements();
    };

    handleListFields();

    // Repeater field
    const handleRepeaterFields = () => {

        // Add elements to the list
        const addElementsLink = document.getElementsByClassName("add-grouped-element");

        if(addElementsLink.length > 0){
            for (let i = 0; i < addElementsLink.length; i++) {
                const link = addElementsLink.item(i);

                link.addEventListener("click", function (e) {
                    e.preventDefault();

                    const id = link.dataset.groupId;
                    const layout = link.dataset.layout;
                    const mediaType = link.dataset.mediaType;
                    const parentIndex = link.dataset.parentIndex;
                    const parentName = link.dataset.parentName;
                    const formId = link.dataset.formId;

                    const noRecordsMessageDiv = document.querySelectorAll('[data-message-id="'+id+'"]');
                    const list = document.getElementById(id);

                    const data = {
                        "id": id,
                        "mediaType": mediaType,
                        "layout": layout,
                        "index": findIndex(id, layout),
                        "parentName": parentName,
                        "parentIndex": parentIndex,
                        "frontEnd": true,
                        "formId": formId
                    };

                    makeAjaxCall("generateGroupedFieldsAction", data)
                        .then(response => {
                            return response.text();
                        })
                        .then(response => {
                            const fields = JSON.parse(response);

                            if(fields.fields){

                                list.insertAdjacentHTML('beforeend', fields.fields);
                                handleDeleteNestedElements();
                                handleFileFieldsDefaultValue();
                                handleTextareaCharacterCounter();
                                handlePhoneFields();
                                handleCountryFields();
                                handleIconPicker();
                                handleCodeMirror();
                                handleQuill();
                                handleIDs();
                                handleBarcodeGenerator();
                                handleQRCodeGenerator();
                                handleColorPicker();
                                handleChoices();
                                handleDateFields("daterange");
                                handleDateFields("date");
                                handleDateFields("datetime");
                                handleDateFields("time");

                                // dispatch custom event
                                const evt = new CustomEvent('acpt_grouped_element_added', { detail: { 'list': list }});
                                document.dispatchEvent(evt);

                                if(noRecordsMessageDiv){
                                    for (let i = 0; i < noRecordsMessageDiv.length; i++) {
                                        const div = noRecordsMessageDiv.item(i);
                                        div.remove();
                                    }
                                }
                            }

                        })
                        .catch(e => {
                            console.error(e);
                        });
                });
            }
        }

        // calculate element index
        const findIndex = (id, layout) => {
            const list = document.getElementById(id);
            let index = 0;

            if(!list){
                return index;
            }

            if(layout === 'table'){
                index = list.querySelectorAll("tr.sortable-li").length;
            } else {
                index = list.querySelectorAll("li").length;
            }

            return index;
        };

        // Remove repeater element
        const handleDeleteNestedElements = () => {

            const removeListLinks = document.getElementsByClassName("remove-grouped-element");

            if(removeListLinks.length > 0){
                for (let i = 0; i < removeListLinks.length; i++) {
                    const link = removeListLinks.item(i);

                    link.addEventListener("click", function (e) {
                        e.preventDefault();

                        const parentId = link.dataset.parentId;
                        const id = link.dataset.targetId;
                        const layout = link.dataset.layout;
                        const element = link.dataset.element;
                        const elements = link.dataset.elements;
                        const $target = document.getElementById(id);
                        const parentList = $target.parentNode;
                        const parentListId = parentList.id;
                        const minBlocks = parentList.dataset.minBlocks;
                        const maxBlocks = parentList.dataset.maxBlocks;
                        const fieldsCount = layout === 'table' ? parentList.querySelectorAll("tr").length : parentList.querySelectorAll("li").length;
                        const addButton = document.querySelector(`.add-grouped-element[data-group-id="${parentId}"]`);

                        const newBlocksAllowed = () => {
                            if(typeof maxBlocks === 'undefined'){
                                return true;
                            }

                            return fieldsCount < maxBlocks;
                        };

                        const checkButton = () => {
                            if(!newBlocksAllowed()){
                                addButton.setAttribute('disabled', 'disabled');
                            } else {
                                addButton.removeAttribute('disabled')
                            }
                        };

                        $target.remove();
                        checkButton();

                        let parentListElementCount;
                        if(layout === 'table'){
                            parentListElementCount = (parentList.querySelectorAll('tr').length - 1);
                        } else {
                            parentListElementCount = parentList.querySelectorAll('li').length;
                        }

                        if(parentListElementCount === 0){
                            const warningMessage = `No fields saved, generate the first one clicking on "Add ${element}" button`;
                            const warningElement = `<p data-message-id="${parentId}" class="update-nag notice notice-warning inline no-records">${warningMessage}</p>`;
                            parentList.innerHTML = warningElement;
                        }

                        const evt = new CustomEvent('acpt_grouped_element_removed', { detail: { 'list': parentList }});
                        document.dispatchEvent(evt);
                    });
                }
            }
        };

        handleDeleteNestedElements();
    };

    handleRepeaterFields();

    // handle grouped element events
    function handleGroupedElementEvents() {

        const events = [
            "acpt_grouped_element_removed",
            "acpt_grouped_element_added",
        ];

        events.map(event => {
            document.addEventListener(event, (ev) => {

                // regenerate IDs
                const list = ev.detail.list;
                const ids = list.querySelectorAll('.acpt-id-value');

                for (let i = 0; i < ids.length; i++) {
                    const id = ids.item(i);
                    const target = id;
                    const targetId = target.id;
                    const index = i;
                    const generateButton = document.querySelector(".acpt-id-generate[data-target-id=" + "\'" + targetId + "\'" + "]");
                    const strategy = generateButton.dataset.idStrategy;
                    const idx = generateButton.dataset.index;

                    const generateId = () => {
                        makeAjaxCall("generateIdAction", {
                            "strategy": strategy,
                            "index": index,
                        })
                            .then(response => {
                                return response.text();
                            })
                            .then(response => {
                                const data = JSON.parse(response);

                                if(data.id){
                                    target.value = data.id;
                                }
                            })
                            .catch(e => {
                                console.error(e);
                            });
                    };

                    if(
                        (event === "acpt_grouped_element_added" && i === (ids.length-1)) ||
                        strategy === 'auto_inc'
                    ){
                        generateId();
                    }
                }
            });
        });
    }

    handleGroupedElementEvents();
});

import {$$, today, todayPlusDays} from "./_admin_commons.js";

var $ = jQuery.noConflict();

/**
 * Init DateRange picker
 *
 * @param idSelector
 * @param wrapper
 * @param pickerFormat (allowed values: date, datetime, daterange, time)
 */
export const initDateRangePicker = (pickerFormat, idSelector = null, wrapper = null) => {

    if((typeof daterangepicker !== "function")){
        return;
    }

    try {
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
                selector = `${wrapper ? wrapper : ""} .acpt-datepicker`;
                break;

            case 'datetime':
                selector = `${wrapper ? wrapper : ""} .acpt-datetimepicker`;
                break;

            case 'daterange':
                selector = `${wrapper ? wrapper : ""} .acpt-daterangepicker`;
                break;

            case 'time':
                selector = `${wrapper ? wrapper : ""} .acpt-timepicker`;
                break;
        }

        if(idSelector){
            selector = `${wrapper ? wrapper : ""} #${idSelector}`;
        }

        const daterangepickerElements = $$(selector) ;

        daterangepickerElements.each(function(index){

            const daterangepickerElement = $(this);
            const value = daterangepickerElement.attr("value");
            const maxDate = daterangepickerElement.data('max-date');
            const minDate = daterangepickerElement.data('min-date');
            const format = daterangepickerElement.data('format') ?? 'YYYY-MM-DD';
            const isGutenberg = daterangepickerElement.closest('.block-editor-block-list__layout').length > 0;

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
                        autoUpdateInput: false,
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
                        parentEl: isGutenberg ? daterangepickerElement.closest('.acpt-meta-field-wrapper') : 'body',
                        showDropdowns: true,
                        timePicker: true,
                        timePicker24Hour: /H|G/.test(format),
                        singleDatePicker: true,
                        autoUpdateInput: false,
                        locale: {
                            format: format
                        }
                    };
                }

                // time
                if(pickerFormat === 'time'){
                    return {
                        drops: 'up',
                        parentEl: isGutenberg ? daterangepickerElement.closest('.acpt-meta-field-wrapper') : 'body',
                        showDropdowns: true,
                        datePicker: false,
                        timePicker: true,
                        timePicker24Hour: /H|G/.test(format),
                        singleDatePicker: true,
                        autoUpdateInput: false,
                        locale: {
                            format: format
                        }
                    };
                }

                return {
                    drops: 'up',
                    showDropdowns: true,
                    singleDatePicker: true,
                    autoUpdateInput: false,
                    locale: {
                        format: format
                    }
                };
            };

            // update values
            daterangepickerElement.on('apply.daterangepicker', function(ev, picker) {

                let val;
                const startDate = picker.startDate.format(format);
                const endDate = picker.endDate.format(format);

                if(pickerFormat === 'daterange'){
                    val = startDate + ' - ' + endDate;
                } else {
                    val = startDate;
                }

                $(this).val(val);
            });

            daterangepickerElement.daterangepicker(settings()).on('show.daterangepicker', function (ev, picker) {
                if(pickerFormat === 'time'){
                    picker.container.find(".calendar-table").hide();
                }

                // Force position recalculation after the picker is visible in the DOM
                setTimeout(() => {
                    picker.move();
                }, 0);
            });

        });
    } catch (e) {
        console.error(e);
    }
};

export const handleDateFieldsEvents = () => {

    // clear a date field
    $('body').on('click', '.acpt-datepicker-clear', function(e) {
        e.preventDefault();
        const $this = $(this);
        const targetId = $this.data('target-id');
        const target = $('#'+targetId);

        target.val("");
    });
};

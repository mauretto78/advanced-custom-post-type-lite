import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../../hooks/useTranslation";
import {useFormContext} from "react-hook-form";
import Select from "../../../../../components/Forms/Select";
import InputHidden from "../../../../../components/Forms/InputHidden";
import {v4 as uuidv4} from "uuid";
import Label from "../../../../../components/Forms/Label";
import Input from "../../../../../components/Forms/Input";
import {isEmpty} from "../../../../../utils/objects";
import {fieldTypes} from "../../../../../constants/fields";
import SelectMulti from "../../../../../components/Forms/SelectMulti";

const AdvancedTab = ({field, formId: baseFormId}) => {

    const { register, formState: {errors}, setValue, clearErrors } = useFormContext();

    const headlineOptions = [
        {label: useTranslation('On the top'), value: 'top'},
        {label: useTranslation('On the left'), value: 'left'},
        {label: useTranslation('On the right'), value: 'right'},
        {label: useTranslation('No display'), value: 'none'},
    ];

    const yesOrNoOptions = [
        {label: useTranslation("Select"), value: null},
        {label: useTranslation("Yes"), value: "1"},
        {label: useTranslation("No"), value: "0"},
    ];

    /**
     *
     * @return {boolean}
     */
    const isUOMField = () => {
        return (
            field.type === fieldTypes.CURRENCY ||
            field.type === fieldTypes.LENGTH ||
            field.type === fieldTypes.WEIGHT
        );
    };

    /**
     *
     * @return {boolean}
     */
    const isRepeaterField = () => {
        return (
            field.type === fieldTypes.REPEATER
        );
    };

    /**
     *
     * @return {boolean}
     */
    const isFlexibleField = () => {
        return (
            field.type === fieldTypes.FLEXIBLE
        );
    };

    /**
     *
     * @return {boolean}
     */
    const isFileField = () => {
        return (
            field.type === fieldTypes.FILE
        );
    };

    /**
     *
     * @param index
     * @param innerKey
     * @param label
     * @param placeholder
     * @param options
     * @return {*}
     */
    const renderAdvancedField = ({index, innerKey, label, placeholder, options}) => {

        /**
         *
         * @param value
         * @return {string}
         */
        const formId = (value) => {
            return `${baseFormId(`advancedOptions.${index}.${value}`)}`;
        };

        /**
         *
         * @return {null|*}
         */
        const option = () => {
            if(!field.advancedOptions){
                return null;
            }

            const filteredValue = field.advancedOptions[index];

            if(filteredValue){
                return filteredValue;
            }

            return null;
        };

        return (
            <React.Fragment>
                <InputHidden
                    id={formId("id")}
                    value={option() ? option().id : uuidv4()}
                    register={register}
                />
                <InputHidden
                    id={formId("key")}
                    value={option() ? option().key : innerKey}
                    register={register}
                />
                <Label
                    id={formId("value")}
                    label={<span dangerouslySetInnerHTML={{__html: label}}/>}
                />
                {options && options.min && options.max && options.step && (
                    <Input
                        type="number"
                        id={formId("value")}
                        register={register}
                        errors={errors}
                        placeholder={placeholder}
                        min={options.min}
                        max={options.max}
                        step={options.step}
                        defaultValue={option() ? option().value : null}
                        validate={{
                            min: {
                                value: options.min,
                                message: useTranslation("min length is") + " " + options.min
                            },
                            max: {
                                value: options.max,
                                message: useTranslation("max length is") + " " + options.max
                            }
                        }}
                    />
                )}
                {options && options.options && (
                    <React.Fragment>
                        {options.multiple && options.multiple === true ? (
                            <SelectMulti
                                clearErrors={clearErrors}
                                errors={errors}
                                id={formId("value")}
                                register={register}
                                setValue={setValue}
                                values={options.options}
                                defaultValue={option() ? option().value : null}
                            />
                        ) : (
                            <Select
                                register={register}
                                id={formId("value")}
                                errors={errors}
                                placeholder={placeholder}
                                values={options.options}
                                defaultValue={option() ? option().value : null}
                            />
                        )}
                    </React.Fragment>
                )}
                {isEmpty(options) && (
                    <Input
                        id={formId("value")}
                        register={register}
                        errors={errors}
                        placeholder={placeholder}
                        defaultValue={option() ? option().value : null}
                    />
                )}
            </React.Fragment>
        );
    };

    return (
        <div className="flex-column s-24">
            <div className="col-12">
                {renderAdvancedField({
                    index: 18,
                    innerKey: "css",
                    placeholder: useTranslation("These CSS classes will be applied to back-end editor fields"),
                    label: useTranslation("Add CSS classes to back-end editor fields (ex. class-active pulse)"),
                    options: {}
                })}
            </div>
            <div className="container align-end">
                <div className={`col-${isUOMField() ? "4" : "6"}`}>
                    {renderAdvancedField({
                        index: 1,
                        innerKey: "headline",
                        placeholder: useTranslation("Select the headline location (default: on the left)"),
                        label: useTranslation("Headline location"),
                        options: {
                            options: headlineOptions
                        }
                    })}
                </div>
                <div className={`col-${isUOMField() ? "4" : "6"}`}>
                    {renderAdvancedField({
                        index: 2,
                        innerKey: "width",
                        placeholder: useTranslation("Field width in % ([1-100] default value: 100)"),
                        label: useTranslation("Field width"),
                        options: {
                            min: 1,
                            max: 100,
                            step: 1
                        }
                    })}
                </div>
                {isUOMField() && (
                    <div className="col-4">
                        {renderAdvancedField({
                            index: 0,
                            innerKey: "uom_default_value",
                            placeholder: useTranslation("UOM default value"),
                            label: useTranslation("UOM default value"),
                            options: {
                                options: document.globals.globals.uom[field.type.toLowerCase()]
                            }
                        })}
                    </div>
                )}
            </div>
            {isFileField() && (
                <div className="container align-end">
                    <div className="col-8">
                        {renderAdvancedField({
                            index: 14,
                            innerKey: "accepts",
                            placeholder: useTranslation("Input file accepts"),
                            label: useTranslation("Input file accepts"),
                            options: {
                                multiple: true,
                                options: [
                                    { label: "image", value: "image" },
                                    { label: "video", value: "video" },
                                    { label: "document", value: "document" },
                                    { label: "audio", value: "audio" },
                                ]
                            }
                        })}
                    </div>
                    <div className="col-2">
                        {renderAdvancedField({
                            index: 16,
                            innerKey: "max_size",
                            placeholder: useTranslation("Maximum size"),
                            label: `${useTranslation("Maximum size")} (Mb)`,
                            options: {
                                min: 1,
                                max: 9999999999999,
                                step: 1
                            }
                        })}
                    </div>
                    <div className="col-2">
                        {renderAdvancedField({
                            index: 17,
                            innerKey: "min_size",
                            placeholder: useTranslation("Minimum size"),
                            label: `${useTranslation("Minimum size")} (Mb)`,
                            options: {
                                min: 1,
                                max: 9999999999999,
                                step: 1
                            }
                        })}
                    </div>
                </div>
            )}
            <div className="container align-end">
                <div className={`col-${isRepeaterField() ? "4" : isFlexibleField() ? "3" : "6"}`}>
                    {renderAdvancedField({
                        index: 4,
                        innerKey: "hide_blank_radio",
                        placeholder: useTranslation("Hide the blank value"),
                        label: useTranslation("Hide the blank value"),
                        options: {
                            options: yesOrNoOptions
                        }
                    })}
                </div>
                <div className={`col-${isRepeaterField() ? "4" : isFlexibleField() ? "3" : "6"}`}>
                    {renderAdvancedField({
                        index: 5,
                        innerKey: "hide_url_label",
                        placeholder: useTranslation("Hide the label"),
                        label: useTranslation("Hide the label"),
                        options: {
                            options: yesOrNoOptions
                        }
                    })}
                </div>
                {isRepeaterField() && (
                    <div className={`col-4`}>
                        {renderAdvancedField({
                            index: 3,
                            innerKey: "columns",
                            placeholder: useTranslation("Field columns ([1-6] only for repeater field)"),
                            label: useTranslation("Field columns"),
                            options: {
                                min: 1,
                                max: 6,
                                step: 1
                            }
                        })}
                    </div>
                )}
                {isFlexibleField() && (
                    <React.Fragment>
                        <div className={`col-3`}>
                            {renderAdvancedField({
                                index: 12,
                                innerKey: "minimum_blocks",
                                placeholder: useTranslation("The limit on how many blocks are required ([1-100] only for flexible field)"),
                                label: useTranslation("Maximum blocks allowed"),
                                options: {
                                    min: 1,
                                    max: 100,
                                    step: 1
                                }
                            })}
                        </div>
                        <div className={`col-3`}>
                            {renderAdvancedField({
                                index: 13,
                                innerKey: "maximum_blocks",
                                placeholder: useTranslation("The limit on how many blocks are required ([1-100] only for flexible field)"),
                                label: useTranslation("Minimum blocks allowed"),
                                options: {
                                    min: 1,
                                    max: 100,
                                    step: 1
                                }
                            })}
                        </div>
                    </React.Fragment>
                )}
            </div>
            <div className="container align-end">
                <div className="col-6">
                    {renderAdvancedField({
                        index: 6,
                        innerKey: "before",
                        placeholder: useTranslation("This text will appear before input"),
                        label: useTranslation("Text before. HTML is allowed (ex. &lt;small&gt;)"),
                        options: {}
                    })}
                </div>
                <div className="col-6">
                    {renderAdvancedField({
                        index: 7,
                        innerKey: "after",
                        placeholder: useTranslation("This text will appear after input"),
                        label: useTranslation("Text after. HTML is allowed (ex. &lt;small&gt;)"),
                        options: {}
                    })}
                </div>
            </div>
            <div className="container align-end">
                <div className="col-4">
                    {renderAdvancedField({
                        index: 8,
                        innerKey: "min",
                        placeholder: useTranslation("The minimum value (used only by numeric and textual fields)"),
                        label: useTranslation("Min value (used only by numeric and textual fields)"),
                        options: {
                            min: 1,
                            max: 100,
                            step: 1
                        }
                    })}
                </div>
                <div className="col-4">
                    {renderAdvancedField({
                        index: 9,
                        innerKey: "max",
                        placeholder: useTranslation("The maximum value (used only by numeric and textual fields)"),
                        label: useTranslation("Max value (used only by numeric and textual fields)"),
                        options: {
                            min: 1,
                            max: 100,
                            step: 1
                        }
                    })}
                </div>
                <div className="col-4">
                    {renderAdvancedField({
                        index: 10,
                        innerKey: "step",
                        placeholder: useTranslation("Step value (used only by numeric fields)"),
                        label: useTranslation("Step value (used only by numeric fields)"),
                        options: {
                            min: 0.01,
                            max: 100,
                            step: 0.01
                        }
                    })}
                </div>
            </div>
            <div>
                {renderAdvancedField({
                    index: 11,
                    innerKey: "pattern",
                    placeholder: useTranslation("Pattern value (used only by numeric and textual fields)"),
                    label: useTranslation("Pattern value (used only by textual fields)"),
                    options: {}
                })}
            </div>
        </div>
    );
};

AdvancedTab.propTypes = {
    formId: PropTypes.func.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default AdvancedTab;
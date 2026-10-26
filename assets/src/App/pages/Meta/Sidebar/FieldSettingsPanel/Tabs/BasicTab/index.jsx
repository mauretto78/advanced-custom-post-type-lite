import React, {useState} from "react";
import PropTypes from 'prop-types';
import Input from "../../../../../../components/Forms/Input";
import Label from "../../../../../../components/Forms/Label";
import useTranslation from "../../../../../../hooks/useTranslation";
import {alphanumericallyValid} from "../../../../../../utils/validation";
import { fieldHasOptions, fieldIsRelational, fieldsList } from "../../../../../../constants/fields";
import {useFormContext, useWatch} from "react-hook-form";
import MetaOptionList from "./MetaOptionList";
import Select from "../../../../../../components/Forms/Select";
import {fieldNestingLevel} from "../../../../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {slugify, transliterate} from "transliteration";
import {debounce} from "../../../../../../utils/debounce";
import WYSIWYGEditor from "../../../../../../components/Forms/WYSIWYGEditor";
import MetaFieldDefaultValue from "./MetaFieldDefaultValue";
import useFieldTypeChange from "../../../../../../hooks/useFieldTypeChange";
import useMetaFieldNameValidator from "../../../../../../hooks/useMetaFieldNameValidator";

import {metaFieldProps} from "../../../../../../props/metaProps.js";

const BasicTab = ({formId, boxIndex, fieldIndex, boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);
    const dispatch = useDispatch();

    // mange local state
    // Starts ON for a brand-new/untouched field, but stays OFF for a name
    // already customized away from what auto-slug would generate -- so
    // reopening an existing field to tweak its label can't silently wipe an
    // intentional custom slug.
    const [autoSlug, setAutoSlug] = useState(() => !field.name || field.name === slugify(transliterate(field.label ?? '')));

    // manage form state
    const { register, control, formState: {errors}, resetField, reset, setValue, setError, clearErrors } = useFormContext();
    const watchedType = useWatch({
        control,
        name: formId("type")
    });

    // calculate nesting levels
    const nestingLevel = fieldNestingLevel(group.boxes, boxId, field.id);

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    // handle field type change (update redux state) — shared with the inline canvas type editor
    const handleFieldTypeChange = useFieldTypeChange({boxId, field, formId});

    // prevents duplicate field names within the same box — shared with the inline canvas rename editor
    const checkIfNameIsValid = useMetaFieldNameValidator({boxIndex, fieldIndex, field});

    /**
     *
     * @param label
     * @return {Promise<void>}
     */
    const onChangeLabel = async(label) => {
        if(autoSlug){
            const slugified = slugify(transliterate(label));
            setValue(formId("name"), slugified);

            if(await checkIfNameIsValid(slugified)){
                setError(
                    formId("name"),
                    {message: useTranslation("No Meta field duplicate names are allowed")}
                );
            } else {
                clearErrors(formId("name"));
            }
        }
    };

    return (
        (<React.Fragment>
            <div className="p-24 font-sm flex-column s-12">
                <div>
                    <Label
                        size="xs"
                        isRequired={false}
                        id={formId("label")}
                        label={
                            <div className="flex-between">
                                <span>{useTranslation("Field label")}</span>
                                <button
                                    type="button"
                                    className="btn-reset"
                                    style={{fontWeight: "normal"}}
                                    onClick={e => {
                                        e.preventDefault();
                                        setAutoSlug(!autoSlug);
                                    }}
                                >
                                    {useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                                </button>
                            </div>
                        }
                    />
                    <Input
                        size="xs"
                        id={formId("label")}
                        register={register}
                        errors={errors}
                        defaultValue={field.label}
                        placeholder={useTranslation("The field label, non latin characters are allowed")}
                        onChangeCapture={debounce(e => {
                            onChangeLabel(e.target.value);
                        }, 300)}
                        onClick={e => {
                            if(e.target.value === 'meta box field'){
                                resetField(formId("label"));
                            }
                        }}
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
                <div>
                    <Label
                        size="xs"
                        isRequired={true}
                        id={formId("name")}
                        label={useTranslation("Field slug")}
                    />
                    <Input
                        size="xs"
                        id={formId("name")}
                        register={register}
                        errors={errors}
                        placeholder={useTranslation("Field slug (Ex. gallery or text_1)")}
                        defaultValue={field.name}
                        onChangeCapture={e => {
                            setValue(formId("name"), slugify(transliterate(e.target.value)));
                            // A direct edit to the slug is a deliberate customization --
                            // stop auto-syncing it from the label for the rest of this session.
                            setAutoSlug(false);
                        }}
                        onClick={e => {
                            if(e.target.value === 'meta_box_field'){
                                resetField(formId("name"));
                            }
                        }}
                        validate={{
                            validate: {
                                alphanumericallyValid,
                                checkIfNameIsValid
                            },
                            required: useTranslation("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
                <div>
                    <Label
                        size="xs"
                        isRequired={true}
                        id={formId("type")}
                        label={useTranslation("Choose the field type")}
                    />
                    <Select
                        size="xs"
                        register={register}
                        id={formId("type")}
                        errors={errors}
                        defaultValue={field.type}
                        values={fieldsList(nestingLevel)}
                        onChangeCapture={e => {
                            handleFieldTypeChange(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <Label
                        size="xs"
                        id={formId("description")}
                        label={useTranslation("The description of this field (showed only on admin panel)")}
                    />
                    <WYSIWYGEditor
                        compact
                        id={formId("description")}
                        ariaLabel={useTranslation("The description of this field (showed only on admin panel)")}
                        register={register}
                        setValue={setValue}
                        defaultValue={field.description}
                        placeholder={useTranslation("A brief description")}
                    />
                </div>
                <MetaFieldDefaultValue
                    field={field}
                    formId={formId}
                />
                {fieldHasOptions(fieldType()) && (
                    <MetaOptionList
                        boxId={boxId}
                        fieldId={field.id}
                        boxIndex={boxIndex}
                        fieldIndex={fieldIndex}
                        parentFieldId={field.parentId ? field.parentId : null}
                        options={field.options ? field.options : []}
                        isMulti={false}
                    />
                )}
                {fieldIsRelational(fieldType()) && (
                    null
                )}
            </div>
        </React.Fragment>)
    );
};

BasicTab.propTypes = {
    formId: PropTypes.func.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.shape(metaFieldProps).isRequired,
};

export default BasicTab;
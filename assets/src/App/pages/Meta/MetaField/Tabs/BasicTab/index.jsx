import React, {useState} from "react";
import PropTypes from 'prop-types';
import Input from "../../../../../components/Forms/Input";
import Label from "../../../../../components/Forms/Label";
import useTranslation from "../../../../../hooks/useTranslation";
import {alphanumericallyValid} from "../../../../../utils/validation";
import {fieldHasOptions, fieldsList} from "../../../../../constants/fields";
import {useFormContext, useWatch} from "react-hook-form";
import MetaOptionList from "./MetaOptionList";
import Select from "../../../../../components/Forms/Select";
import {fieldNestingLevel} from "../../../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {updateField} from "../../../../../redux/reducers/metaStateSlice";
import {slugify, transliterate} from "transliteration";
import {wpAjaxRequest} from "../../../../../utils/ajax";
import {debounce} from "../../../../../utils/debounce";
import Textarea from "../../../../../components/Forms/Textarea";
import MetaFieldDefaultValue from "./MetaFieldDefaultValue";

const BasicTab = ({formId, boxIndex, fieldIndex, boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);
    const dispatch = useDispatch();

    // mange local state
    const [autoSlug, setAutoSlug] = useState(true);

    // manage form state
    const { register, unregister, control, formState: {errors}, resetField, reset, setValue, setError, clearErrors } = useFormContext();
    const watchedType = useWatch({
        control,
        name: formId("type")
    });
    const watchedFields = useWatch({
        control,
        name: `boxes.${boxIndex}.fields`
    });
    const watchedBoxName = useWatch({
        control,
        name: `boxes.${boxIndex}.name`
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

    // handle field type change (update redux state)
    const handleFieldTypeChange = (type) => {
        if(fieldType() !== type){
            const updatedField = {...field};
            updatedField.type = type;
            dispatch(updateField({field: updatedField, boxId}));
        }
    };

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
                    {message: useTranslation("Name is already taken")}
                );
            } else {
                clearErrors(formId("name"));
            }
        }
    };

    /**
     * This function avoid any field name collision
     * @param name
     * @return {string}
     */
    const checkIfNameIsValid = async(name) => {

        const slugified = slugify(transliterate(name));

        // check for other box names
        let otherFieldNames = [];

        watchedFields && watchedFields.map((field, i) => {
            if(i !== fieldIndex){
                otherFieldNames.push(field.name);
            }
        });

        if(otherFieldNames.includes(slugified)){
            return useTranslation("Name is already taken");
        }

        // check if the name already exists
        if(field.name !== slugified){

            const res = await wpAjaxRequest("checkMetaBoxFieldNameAction", {
                boxName: watchedBoxName ? watchedBoxName : field.boxName,
                fieldName: slugified
            });

            if(res.exists === true){
                return useTranslation("Name is already taken");
            }
        }
    };

    return (
        <React.Fragment>
            <div className="flex-column s-24">
                <div className="container align-end">
                    <div className="col-4">
                        <Label
                            isRequired={false}
                            id={formId("label")}
                            label={
                                <div className="flex-between">
                                    <span>{useTranslation("Field label")}</span>
                                    <a
                                        href="#"
                                        style={{fontWeight: "normal"}}
                                        onClick={e => {
                                            e.preventDefault();
                                            setAutoSlug(!autoSlug);
                                        }}
                                    >
                                        {useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                                    </a>
                                </div>
                            }
                        />
                        <Input
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
                    <div className="col-4">
                        <Label
                            isRequired={true}
                            id={formId("name")}
                            label={useTranslation("Field slug")}
                        />
                        <Input
                            id={formId("name")}
                            register={register}
                            errors={errors}
                            placeholder={useTranslation("Field slug (Ex. gallery or text_1)")}
                            defaultValue={field.name}
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
                    <div className="col-4">
                        <Label
                            isRequired={true}
                            id={formId("type")}
                            label={useTranslation("Choose the field type")}
                        />
                        <Select
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
                </div>
                <div className="container align-end">
                    <div className="col-12">
                        <Label
                            id={formId("description")}
                            label={useTranslation("The description of this field (showed only on admin panel)")}
                        />
                        <Textarea
                            id={formId("description")}
                            register={register}
                            defaultValue={field.description}
                            errors={errors}
                            placeholder={useTranslation("A brief description")}
                            characterLimit={255}
                            rows={4}
                            validate={{
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                </div>
                <MetaFieldDefaultValue
                    field={field}
                    formId={formId}
                />
            </div>
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
        </React.Fragment>
    );
};

BasicTab.propTypes = {
    formId: PropTypes.func.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
};

export default BasicTab;
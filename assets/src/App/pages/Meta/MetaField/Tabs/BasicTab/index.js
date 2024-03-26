import React, {useState} from "react";
import PropTypes from 'prop-types';
import Input from "../../../../../components/Forms/Input";
import Label from "../../../../../components/Forms/Label";
import useTranslation from "../../../../../hooks/useTranslation";
import {alphanumericallyValid} from "../../../../../utils/validation";
import {
    fieldHasOptions,
    fieldIsFlexible,
    fieldIsRelational,
    fieldIsRepeater,
    fieldsList,
    fieldTypes
} from "../../../../../constants/fields";
import {useFormContext, useWatch} from "react-hook-form";
import MetaOptionList from "./MetaOptionList";
import Select from "../../../../../components/Forms/Select";
import ChildrenFieldsList from "./ChildrenFieldsList";
import {canFieldHaveValidationAndLogicRules, fieldNestingLevel} from "../../../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import BlockList from "./BlockList";
import {updateField} from "../../../../../redux/reducers/metaStateSlice";
import {slugify, transliterate} from "transliteration";
import RelationalField from "./RelationalField";
import {wpAjaxRequest} from "../../../../../utils/ajax";
import InputDebounced from "../../../../../components/Forms/InputDebounced";

const BasicTab = ({view, formId, boxIndex, fieldIndex, boxId, field}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);
    const dispatch = useDispatch();

    // mange local state
    const [autoSlug, setAutoSlug] = useState(true);

    // manage form state
    const { register, unregister, control, formState: {errors}, resetField, reset, setValue, clearErrors } = useFormContext();
    const watchedType = useWatch({
        control,
        name: formId("type")
    });
    const watchedName = useWatch({
        control,
        name: formId("name")
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

            if(type !== fieldTypes.REPEATER){
                updatedField.children = [];
            }

            if(type !== fieldTypes.FLEXIBLE){
                updatedField.blocks = [];
            }

            if(type !== fieldTypes.POST){
                updatedField.relations = [];
            }

            if(!canFieldHaveValidationAndLogicRules(type)){
                unregister(formId("relations"));
                unregister(formId("visibilityConditions"));
                unregister(formId("validationRules"));
                updatedField.visibilityConditions = [];
                updatedField.validationRules = [];
                updatedField.relations = [];
            }

            unregister(formId("relations"));
            unregister(formId("blocks"));
            unregister(formId("children"));

            dispatch(updateField({field: updatedField, boxId}));
        }
    };

    /**
     * This function avoid any box name collision
     * @param name
     * @return {string}
     */
    const checkIfNameIsValid = async(name) => {

        const slugified = slugify(transliterate(name));

        // check for other box names
        let otherFieldNames = [];

        watchedFields.map((field, i) => {
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

        return true;
    };

    const onChangeLabel = (value) => {
        if(autoSlug){
            const slugified = slugify(transliterate(value));

            if(checkIfNameIsValid(slugified)){
                clearErrors(formId("name"));
                setValue(formId("name"), slugified);
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
                        <InputDebounced
                            control={control}
                            id={formId("label")}
                            placeholder={useTranslation("The field label, non latin characters are allowed")}
                            onChangeCapture={onChangeLabel}
                            defaultValue={field.label}
                            validate={{
                                validate: checkIfNameIsValid,
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
                    <div className="col-6">
                        <Label
                            id={formId("defaultValue")}
                            label={useTranslation("The default value for this field")}
                        />
                        <Input
                            id={formId("defaultValue")}
                            register={register}
                            errors={errors}
                            placeholder={useTranslation("Default value")}
                            defaultValue={field.defaultValue}
                            validate={{
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                    <div className="col-6">
                        <Label
                            id={formId("description")}
                            label={useTranslation("The description of this field (showed only on admin panel)")}
                        />
                        <Input
                            id={formId("description")}
                            register={register}
                            errors={errors}
                            placeholder={useTranslation("A brief description")}
                            defaultValue={field.description}
                            validate={{
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {fieldHasOptions(fieldType()) && (
                <MetaOptionList
                    boxId={boxId}
                    fieldId={field.id}
                    boxIndex={boxIndex}
                    fieldIndex={fieldIndex}
                    parentFieldId={field.parentId ? field.parentId : null}
                    options={field.options ? field.options : []}
                    isMulti={field.type === fieldTypes.SELECT_MULTI || field.type === fieldTypes.CHECKBOX}
                />
            )}
            {fieldIsRepeater(fieldType()) && (
                <ChildrenFieldsList
                    nestingLevel={nestingLevel}
                    view={view}
                    boxId={boxId}
                    parentFieldId={field.id}
                    boxIndex={boxIndex}
                    parentFieldIndex={fieldIndex}
                    childrenFields={field.children}
                />
            )}
            {fieldIsFlexible(fieldType()) && (
                <BlockList
                    nestingLevel={nestingLevel}
                    view={view}
                    boxId={boxId}
                    parentFieldId={field.id}
                    boxIndex={boxIndex}
                    parentFieldIndex={fieldIndex}
                    blocks={field.blocks}
                />
            )}
            {fieldIsRelational(fieldType()) && (
                <RelationalField
                    formId={formId}
                    field={field}
                />
            )}
        </React.Fragment>
    );
};

BasicTab.propTypes = {
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    formId: PropTypes.func.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
};

export default BasicTab;
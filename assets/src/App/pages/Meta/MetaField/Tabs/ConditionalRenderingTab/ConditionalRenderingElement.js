import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import InputHidden from "../../../../../components/Forms/InputHidden";
import DeleteConditionalRenderingElementModal from "../../../Modal/DeleteConditionalRenderingElementModal";
import {useFormContext, useWatch} from "react-hook-form";
import Select from "../../../../../components/Forms/Select";
import useTranslation from "../../../../../hooks/useTranslation";
import {fieldTypes} from "../../../../../constants/fields";
import {metaTypes} from "../../../../../constants/metaTypes";
import {wpAjaxRequest} from "../../../../../utils/ajax";
import Input from "../../../../../components/Forms/Input";
import SelectMulti from "../../../../../components/Forms/SelectMulti";
import {escapedJsonToObject, objectToEscapedJson} from "../../../../../utils/objects";
import ButtonSwitch from "../../../../../components/Forms/ButtonSwitch";
import Tooltip from "../../../../../components/Tooltip";

const ConditionalRenderingElement = ({elementIndex, boxIndex, fieldIndex, boxId, fieldId, element, parentFieldIndex, parentFieldId, isLast}) => {

    // manage form state
    const formId = (value) => {
        return `boxes.${boxIndex}.fields.${fieldIndex}.visibilityConditions.${elementIndex}.${value}`;
    };

    const { register, formState: {errors}, control, setValue, clearErrors } = useFormContext();
    const watchedBelongs = useWatch({
        control,
        name: `belongs`
    });
    const watchedBoxes = useWatch({
        control,
        name: `boxes`
    });
    const watchedFieldType = useWatch({
        control,
        name: `boxes.${boxIndex}.fields.${fieldIndex}.type`
    });

    const watchedType = useWatch({
        control,
        name: formId("type")
    });
    const watchedOperator = useWatch({
        control,
        name: formId("operator")
    });
    const watchedValue = useWatch({
        control,
        name: formId("value")
    });
    const watchedLogic = useWatch({
        control,
        name: formId("logic")
    });
    const watchedFrontEnd = useWatch({
        control,
        name: formId("frontEnd")
    });
    const watchedBackEnd = useWatch({
        control,
        name: formId("backEnd")
    });

    // manage local state
    const [taxonomies, setTaxonomies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [terms, setTerms] = useState([]);

    // update taxonomies, posts, terms
    useEffect(() => {
        watchedBelongs && watchedBelongs.map((belong) => {
            if(belong.belong === metaTypes.CUSTOM_POST_TYPE){
                wpAjaxRequest("fetchPostTypeTaxonomiesAction", {postType: belong.find}).then(res => setTaxonomies([...taxonomies, ...res]));
                wpAjaxRequest( "fetchPostTypePostsAction", {postType: belong.find} ).then( res => setPosts([...posts, ...res]));
            }

            if(belong.belong === metaTypes.TAXONOMY){
                wpAjaxRequest( "fetchTermsAction", {taxonomy: belong.find, format: "short"} ).then( res => setTerms([...terms, ...res]));
            }
        });
    }, [watchedBelongs]);

    /**
     * Get the available types
     *
     * @return object
     */
    const getAvailableTypes = () => {

        const allowedValueTypes = [
            fieldTypes.NUMBER,
            fieldTypes.TEXT,
            fieldTypes.TEXTAREA,
            fieldTypes.SELECT,
            fieldTypes.SELECT_MULTI,
            fieldTypes.DATE,
            fieldTypes.TIME,
            fieldTypes.URL,
            fieldTypes.PHONE,
            fieldTypes.EMAIL,
            fieldTypes.COLOR,
            fieldTypes.CURRENCY,
            fieldTypes.WEIGHT,
            fieldTypes.LENGTH,
            fieldTypes.TOGGLE,
            fieldTypes.POST_OBJECT,
            fieldTypes.POST_OBJECT_MULTI,
            fieldTypes.TERM_OBJECT,
            fieldTypes.TERM_OBJECT_MULTI,
            fieldTypes.USER,
            fieldTypes.USER_MULTI,
        ];

        let options = [];
        let otherFields = [];
        let availableTypes = [
            {value: null, label: useTranslation("Select")}
        ];

        watchedBoxes.map((box)=>{
            typeof box.fields !== 'undefined' && box.fields.map((field)=>{
                if(allowedValueTypes.includes(field.type) && field.id !== fieldId){

                    /**
                     *
                     * @return {string}
                     */
                    const fieldUiName = () => {
                        let uiName = '';
                        uiName += `[${box.label ? box.label : box.name}] `;
                        uiName += field.label ? field.label : field.name;

                        return uiName;
                    };

                    otherFields.push({label: fieldUiName(), value: objectToEscapedJson({type: "OTHER_FIELDS", value: field.id})});
                }
            });
        });

        if(allowedValueTypes.includes(watchedFieldType)) {
            options.push({value: objectToEscapedJson({type: "VALUE", value: "VALUE"}), label: useTranslation("Value")});
        }

        watchedBelongs && watchedBelongs.map((belong) => {
            if(belong.belong === metaTypes.CUSTOM_POST_TYPE){
                options.push({value: objectToEscapedJson({type: "POST_ID", value: "POST_ID"}), label: useTranslation("Post")});
            }

            if(belong.belong === metaTypes.TAXONOMY){
                options.push({value: objectToEscapedJson({type: "TERM_ID", value: "TERM_ID"}), label: useTranslation("Term")});
            }
        });

        if(options.length > 0){
            if(allowedValueTypes.includes(watchedFieldType)) {
                availableTypes.push({
                    label: useTranslation("This field"),
                    options: options,
                });
            }
        }

        if(taxonomies.length > 0){
            let taxonomyObject = {
                label: useTranslation("Related taxonomies"),
                options: []
            };

            taxonomies.map((taxonomy) => {
                taxonomyObject.options.push({value: objectToEscapedJson({type: "TAXONOMY", value: taxonomy.label}), label: taxonomy.label});
            });

            availableTypes.push(taxonomyObject);
        }

        if(otherFields.length > 0){
            availableTypes.push({
                label: useTranslation("Other fields"),
                options: otherFields
            });
        }

        return availableTypes;
    };

    /**
     *
     * @return {boolean|*}
     */
    const operatorIsDisabled = () => {
        return typeof watchedType === 'undefined' || element.type;
    };

    /**
     * Get the operators
     *
     * @param fieldType
     * @return array
     */
    const operatorChoices = (fieldType) => {

        if(!watchedType || typeof watchedType === 'undefined'){
            return [
                {value: null, label: useTranslation("Select")},
            ];
        }

        const type = (typeof watchedType === 'object') ? watchedType : escapedJsonToObject(watchedType);
        const typeEnum = type.type;
        const typeValue = type.value;

        if ( typeEnum === 'VALUE' ) {

            if(fieldType === fieldTypes.SELECT_MULTI){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"IN", label: useTranslation("is included in")},
                    {value:"NOT_IN", label: useTranslation("is not included in")},
                    {value:"BLANK", label: useTranslation("is empty")},
                    {value:"NOT_BLANK", label: useTranslation("is not empty")}
                ];
            }

            if(
                fieldType === fieldTypes.NUMBER ||
                fieldType === fieldTypes.CURRENCY ||
                fieldType === fieldTypes.WEIGHT ||
                fieldType === fieldTypes.LENGTH ||
                fieldType === fieldTypes.DATE ||
                fieldType === fieldTypes.TIME
            ){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"=", label: useTranslation("is equal to")},
                    {value:"!=", label: useTranslation("is not equal to")},
                    {value:"<", label: useTranslation("is less than")},
                    {value:">", label: useTranslation("is greater than")},
                    {value:"<=", label: useTranslation("is less than or equal to")},
                    {value:">=", label: useTranslation("is greater than or equal to")},
                    {value:"BLANK", label: useTranslation("is empty")},
                    {value:"NOT_BLANK", label: useTranslation("is not empty")}
                ];
            }

            if(fieldType === fieldTypes.TOGGLE){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"CHECKED", label: useTranslation("is checked")},
                    {value:"NOT_CHECKED", label: useTranslation("is not checked")},
                ];
            }

            return [
                {value: null, label: useTranslation("Select")},
                {value:"=", label: useTranslation("is equal to")},
                {value:"!=", label: useTranslation("is not equal to")},
                {value:"LIKE", label: useTranslation("is like to")},
                {value:"NOT_LIKE", label: useTranslation("is not like")},
                {value:"BLANK", label: useTranslation("is empty")},
                {value:"NOT_BLANK", label: useTranslation("is not empty")}
            ];
        }

        // other fields
        if ( typeEnum === 'OTHER_FIELDS' ) {

            if(fieldType === fieldTypes.SELECT_MULTI){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"IN", label: useTranslation("is included in")},
                    {value:"NOT_IN", label: useTranslation("is not included in")},
                    {value:"BLANK", label: useTranslation("is empty")},
                    {value:"NOT_BLANK", label: useTranslation("is not empty")}
                ];
            }

            if(
                fieldType === fieldTypes.NUMBER ||
                fieldType === fieldTypes.CURRENCY ||
                fieldType === fieldTypes.WEIGHT ||
                fieldType === fieldTypes.LENGTH ||
                fieldType === fieldTypes.DATE ||
                fieldType === fieldTypes.TIME
            ){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"=", label: useTranslation("is equal to")},
                    {value:"!=", label: useTranslation("is not equal to")},
                    {value:"<", label: useTranslation("is less than")},
                    {value:">", label: useTranslation("is greater than")},
                    {value:"<=", label: useTranslation("is less than or equal to")},
                    {value:">=", label: useTranslation("is greater than or equal to")},
                    {value:"BLANK", label: useTranslation("is empty")},
                    {value:"NOT_BLANK", label: useTranslation("is not empty")}
                ];
            }

            if(fieldType === fieldTypes.TOGGLE){
                return [
                    {value: null, label: useTranslation("Select")},
                    {value:"CHECKED", label: useTranslation("is checked")},
                    {value:"NOT_CHECKED", label: useTranslation("is not checked")},
                ];
            }

            return [
                {value: null, label: useTranslation("Select")},
                {value:"=", label: useTranslation("is equal to")},
                {value:"!=", label: useTranslation("is not equal to")},
                {value:"LIKE", label: useTranslation("is like to")},
                {value:"NOT_LIKE", label: useTranslation("is not like")},
                {value:"BLANK", label: useTranslation("is empty")},
                {value:"NOT_BLANK", label: useTranslation("is not empty")}
            ];
        }

        if ( typeEnum === 'POST_ID' || typeEnum === 'TERM_ID' ) {
            return [
                {value: null, label: useTranslation("Select")},
                {value:"=", label: useTranslation("is equal to")},
                {value:"!=", label: useTranslation("is not equal to")},
                {value:"IN", label: useTranslation("is included in")},
                {value:"NOT_IN", label: useTranslation("is not included in")},
            ];
        }

        if ( typeEnum === 'TAXONOMY' ) {
            return [
                {value: null, label: useTranslation("Select")},
                {value:"IN", label: useTranslation("is included in")},
                {value:"NOT_IN", label: useTranslation("is not included in")},
                {value:"BLANK", label: useTranslation("is empty")},
                {value:"NOT_BLANK", label: useTranslation("is not empty")}
            ];
        }

        return [
            {value: null, label: useTranslation("Select")},
            {value:"=", label: useTranslation("is equal to")},
            {value:"!=", label: useTranslation("is not equal to")},
            {value:"IN", label: useTranslation("is included in")},
            {value:"NOT_IN", label: useTranslation("is not included in")},
            {value:"BLANK", label: useTranslation("is empty")},
            {value:"NOT_BLANK", label: useTranslation("is not empty")}
        ];
    };

    /**
     *
     * @return {boolean|boolean}
     */
    const valueHasToBeRendered = () => {
        return (
            watchedType &&
            watchedOperator &&
            watchedOperator !== "BLANK" &&
            watchedOperator !== "NOT_BLANK" &&
            watchedOperator !== "CHECKED" &&
            watchedOperator !== "NOT_CHECKED"
        );
    };

    /**
     * Render the value input. It must wait for getDefaultValue() ends fetching
     *
     * @return {*}
     */
    const renderValueInput = () => {

        const type = (typeof watchedType === 'object') ? watchedType : escapedJsonToObject(watchedType);
        const typeEnum = type.type;
        const typeValue = type.value;
        const isInNotInOperator = watchedOperator === 'IN' || watchedOperator === 'NOT_IN';
        const checkedOtNotOperator = watchedOperator === 'CHECKED' || watchedOperator === 'NOT_CHECKED';
        const nullOption = {value: null, label: useTranslation("Select")};

        if(typeEnum === 'TAXONOMY') {
            if(taxonomies.length > 0){

                const options = taxonomies.filter((taxonomy)=> taxonomy.label === typeValue);

                if(options.length === 1){

                    if ( isInNotInOperator ) {
                        return (
                            <React.Fragment>
                                <SelectMulti
                                    id={formId("value")}
                                    defaultValue={watchedValue ? watchedValue : element.value}
                                    placeholder={useTranslation("Select taxonomies")}
                                    errors={errors}
                                    register={register}
                                    values={options[0].options}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    validate={{
                                        required: useTranslation("This field is mandatory"),
                                    }}
                                />
                            </React.Fragment>
                        );
                    }

                    return (
                        <React.Fragment>
                            <Select
                                id={formId("value")}
                                defaultValue={watchedValue ? watchedValue : element.value}
                                placeholder={useTranslation("Select taxonomy")}
                                errors={errors}
                                register={register}
                                values={[...nullOption, ...options[0].options]}
                                validate={{
                                    required: useTranslation("This field is mandatory"),
                                }}
                            />
                        </React.Fragment>
                    );
                }
            }

            return (
                <React.Fragment>
                    <Input
                        id={formId("value")}
                        errors={errors}
                        register={register}
                        defaultValue={watchedValue ? watchedValue : element.value}
                        placeholder={useTranslation('value')}
                         validate={{
                            required: useTranslation("This field is mandatory"),
                        }}
                    />
                </React.Fragment>
            );
        }

        if(typeEnum === 'POST_ID') {
            if ( isInNotInOperator ) {
                return (
                    <React.Fragment>
                        <SelectMulti
                            id={formId("value")}
                            defaultValue={watchedValue ? watchedValue : element.value}
                            placeholder={useTranslation("Select posts")}
                            values={posts}
                            errors={errors}
                            register={register}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            validate={{
                                required: useTranslation("This field is mandatory"),
                            }}
                        />
                    </React.Fragment>
                );
            }

            return (
                <React.Fragment>
                    <Select
                        id={formId("value")}
                        defaultValue={watchedValue ? watchedValue : element.value}
                        placeholder={useTranslation("Select posts")}
                        values={[...nullOption, ...posts]}
                        errors={errors}
                        register={register}
                         validate={{
                            required: useTranslation("This field is mandatory"),
                        }}
                    />
                </React.Fragment>
            );
        }

        if(typeEnum === 'TERM_ID'){
            if ( isInNotInOperator ) {
                return (
                    <React.Fragment>
                        <SelectMulti
                            id={formId("value")}
                            defaultValue={watchedValue ? watchedValue : element.value}
                            placeholder={useTranslation("Select taxonomies")}
                            errors={errors}
                            register={register}
                            values={terms}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            validate={{
                                required: useTranslation("This field is mandatory"),
                            }}
                        />
                    </React.Fragment>
                );
            }

            return (
                <React.Fragment>
                    <Select
                        id={formId("value")}
                        defaultValue={watchedValue ? watchedValue : element.value}
                        placeholder={useTranslation("Select taxonomies")}
                        errors={errors}
                        register={register}
                        values={[...nullOption, ...terms]}
                        validate={{
                            required: useTranslation("This field is mandatory"),
                        }}
                    />
                </React.Fragment>
            );
        }

        if(checkedOtNotOperator){
            return (
                <React.Fragment>
                    <Input
                        id={formId("value")}
                        disabled={true}
                        register={register}
                        errors={errors}
                        placeholder={`${isInNotInOperator ? useTranslation('Insert values separated by comma. Ex: 12, 54, foo') : useTranslation('value')}`}
                        defaultValue={watchedValue ? watchedValue : element.value}
                    />
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Input
                    id={formId("value")}
                    register={register}
                    errors={errors}
                    placeholder={`${isInNotInOperator ? useTranslation('Insert values separated by comma. Ex: 12, 54, foo') : useTranslation('value')}`}
                    defaultValue={watchedValue ? watchedValue : element.value}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                    }}
                />
            </React.Fragment>
        );
    };

    return (
        <div className="i-flex-center s-8 w-100">
            <InputHidden
                id={formId("id")}
                value={element.id}
                register={register}
            />
            <div className="w-100">
                <Select
                    id={formId("type")}
                    placeholder={useTranslation("Select option")}
                    register={register}
                    values={getAvailableTypes()}
                    errors={errors}
                    defaultValue={watchedType ? watchedType : objectToEscapedJson(element.type)}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                    }}
                />
            </div>
            <div className="w-40">
                <Select
                    id={formId("operator")}
                    muted={true}
                    placeholder={useTranslation("Select option")}
                    register={register}
                    disabled={operatorIsDisabled()}
                    values={operatorChoices(watchedFieldType)}
                    errors={errors}
                    defaultValue={watchedType ? watchedType : element.operator}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                    }}
                />
            </div>
            <div className="w-40">
                {valueHasToBeRendered() ? (
                    renderValueInput()
                ) : (
                    <Input
                        id={formId("value")}
                        placeholder={useTranslation("")}
                        register={register}
                        errors={errors}
                        value=""
                        defaultValue={watchedValue ? watchedValue : element.value}
                        disabled={true}
                    />
                )}
            </div>
            <div className="w-40">
                {!isLast && (
                    <React.Fragment>
                        <Select
                            muted={true}
                            id={formId("logic")}
                            placeholder={useTranslation("Select option")}
                            register={register}
                            values={[
                                {label:useTranslation("AND"), value:"AND"},
                                {label:useTranslation("OR"), value:"OR"},
                            ]}
                            errors={errors}
                            defaultValue={watchedLogic ? watchedLogic : element.logic}
                            validate={{
                                required: useTranslation("This field is mandatory"),
                            }}
                        />
                    </React.Fragment>
                )}
            </div>
            <div className="i-flex-center s-8">
                <Tooltip
                    label={
                        <ButtonSwitch
                            id={formId("frontEnd")}
                            control={control}
                            defaultValue={typeof watchedFrontEnd === "boolean" ? watchedFrontEnd : element.frontEnd}
                            errors={errors}
                            icon="bx:devices"
                            disabled={!valueHasToBeRendered()}
                        />
                    }
                    tip={useTranslation("Show in Front-End")}
                    icon={false}
                />
                <Tooltip
                    label={
                        <ButtonSwitch
                            id={formId("backEnd")}
                            control={control}
                            defaultValue={typeof watchedBackEnd === "boolean" ? watchedBackEnd : element.backEnd}
                            errors={errors}
                            icon="bx:cog"
                            disabled={!valueHasToBeRendered()}
                        />
                    }
                    tip={useTranslation("Show in Back-End")}
                    icon={false}
                />
            </div>
            <DeleteConditionalRenderingElementModal
                boxId={boxId}
                fieldId={fieldId}
                elementId={element.id}
                parentFieldId={parentFieldId}
                elementIndex={elementIndex}
            />
        </div>
    );
};

ConditionalRenderingElement.propTypes = {
    elementIndex: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
};

export default ConditionalRenderingElement;
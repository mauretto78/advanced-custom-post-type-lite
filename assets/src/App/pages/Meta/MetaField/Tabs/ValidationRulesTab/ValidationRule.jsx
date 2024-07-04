import React, {memo, useState} from "react";
import PropTypes from 'prop-types';
import InputHidden from "../../../../../components/Forms/InputHidden";
import {useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../../../hooks/useTranslation";
import Input from "../../../../../components/Forms/Input";
import DeleteValidationRuleModal from "../../../Modal/DeleteValidationRuleModal";
import Select from "../../../../../components/Forms/Select";

const ValidationRule = memo(({ruleIndex, boxIndex, fieldIndex, boxId, fieldId, rule, formId: baseFormId, parentFieldIndex, parentFieldId}) => {

    // manage form state
    const formId = (value) => {
        return `${baseFormId(`validationRules.${ruleIndex}.${value}`)}`;
    };

    const { register, formState: {errors}, control, setValue } = useFormContext();

    const watchedCondition = useWatch({
        control,
        name: formId("condition")
    });
    const watchedValue = useWatch({
        control,
        name: formId("value")
    });
    const watchedMessage = useWatch({
        control,
        name: formId("message")
    });

    /**
     *
     * @return {any}
     */
    const getDefaultCondition = () => {
        return watchedCondition ? watchedCondition : rule.condition;
    };

    /**
     *
     * @return {string}
     */
    const getDefaultMessage = () => {

        if(watchedMessage){
            return watchedMessage
        }

        if(rule.message){
            return rule.message;
        }

        return getDefaultMessageForCondition(getDefaultCondition());
    };

    /**
     *
     * @param condition
     * @return {string}
     */
    const getDefaultMessageForCondition = (condition) => {

        let message;

        switch (condition) {
            case 'blank':
                message = 'Value is not blank';
                break;

            case 'not_blank':
                message = 'Value is blank';
                break;

            case '=':
                message = 'Value is not equal to {{v}}';
                break;

                case '!=':
                message = 'Value is equals to {{v}}';
                break;

            case '>':
                message = 'Value is lower or equals than {{v}}';
                break;

            case '>=':
                message = 'Value is lower than {{v}}';
                break;

            case '<':
                message = 'Value is greatest or equals than {{v}}';
                break;

            case '<=':
                message = 'Value is greatest than {{v}}';
                break;

            case 'max':
                message = 'The maximum length is {{v}}';
                break;

            case 'min':
                message = 'The minimum length is {{v}}';
                break;

            case 'regex':
                message = 'Regex value is not matching {{v}}';
                break;
        }

        return useTranslation(message);
    };

    /**
     *
     * @param condition
     * @return {boolean}
     */
    const conditionDoesNotRequireValue = (condition) => {
        return condition === 'blank' || condition === 'not_blank';
    };

    /**
     *
     * @param value
     */
    const handleConditionChange = (value) => {
        setDefaultMessage(getDefaultMessageForCondition(value));
        setValue(formId("message"), getDefaultMessageForCondition(value));

        isValueDisabled(conditionDoesNotRequireValue(value));
        if(conditionDoesNotRequireValue(value)){
            setValue(formId("value"), null);
        }
    };

    // manage local state
    const [defaultMessage, setDefaultMessage] = useState(getDefaultMessage());
    const [valueDisabled, isValueDisabled] = useState(conditionDoesNotRequireValue(watchedCondition ? watchedCondition : rule.condition));

    const conditionOptions = [
        { value: "blank", label: useTranslation('is empty') },
        { value: "not_blank", label: useTranslation('is not empty') },
        { value: "=", label: useTranslation('is equal to') },
        { value: "!=", label: useTranslation('is not equal to') },
        { value: ">", label: useTranslation('is greater than') },
        { value: ">=", label: useTranslation('is greater than or equal to') },
        { value: "<", label: useTranslation('is less than') },
        { value: "<=", label: useTranslation('is less than or equal to') },
        { value: "max", label: useTranslation('max length is') },
        { value: "min", label: useTranslation('min length is') },
        { value: "regex", label: useTranslation('regular expression') },
    ];

    return (
        <div className="i-flex-center s-24 w-100">
            <InputHidden
                id={formId("id")}
                value={rule.id}
                register={register}
            />
            <div className="w-40">
                <Select
                    id={formId("condition")}
                    muted={true}
                    register={register}
                    defaultValue={getDefaultCondition()}
                    values={conditionOptions}
                    errors={errors}
                    onChangeCapture={e => handleConditionChange(e.target.value)}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                    }}
                />
            </div>
            {!valueDisabled && (
                <div className="w-100">
                    <Input
                        id={formId("value")}
                        register={register}
                        errors={errors}
                        defaultValue={watchedValue ? watchedValue : rule.value}
                        validate={{
                            required: useTranslation("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </div>
            )}
            <div className="w-100">
                <Input
                    id={formId("message")}
                    register={register}
                    errors={errors}
                    defaultValue={defaultMessage}
                    validate={{
                        required: useTranslation("This field is mandatory"),
                        maxLength: {
                            value: 255,
                            message: "max length is 255"
                        }
                    }}
                />
            </div>
            <DeleteValidationRuleModal
                boxId={boxId}
                fieldId={fieldId}
                ruleId={rule.id}
                parentFieldId={parentFieldId}
                ruleIndex={ruleIndex}
            />
        </div>
    );
});

ValidationRule.propTypes = {
    formId: PropTypes.func.isRequired,
    ruleIndex: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    rule: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
};

export default ValidationRule;
import React, {useState} from "react";
import PropTypes from 'prop-types';
import {productFieldOptionProps} from "../../../../../../props/wooCommerceProps.js";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {useDispatch} from "react-redux";
import InputHidden from "../../../../../../components/Forms/InputHidden";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import Input from "../../../../../../components/Forms/Input";
import useTranslation from "../../../../../../hooks/useTranslation";
import {dangerColor, grayColor} from "../../../../../../utils/colors";
import Tooltip from "../../../../../../components/Tooltip";
import ButtonSwitch from "../../../../../../components/Forms/ButtonSwitch";
import {deleteOption} from "../../../../../../redux/reducers/productDataFieldsStateSlice";

const ProductDataFieldOption = ({fieldId, fieldIndex, optionIndex, option, handleIsDefault}) => {

    const dispatch = useDispatch();

    // manage form state
    const formId = (value) => `fields.${fieldIndex}.options.${optionIndex}.${value}`;

    const {register, formState: {errors}, control, setValue, resetField} = useFormContext();

    const {remove} = useFieldArray({
        control,
        name: `fields.${fieldIndex}.options`,
    });

    const watchedValue     = useWatch({control, name: formId("value")});
    const watchedLabel     = useWatch({control, name: formId("label")});
    const watchedIsDefault = useWatch({control, name: formId("isDefault")});

    // DND-kit — use option.id (UUID) so SortableList.items can match by id
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: option.id});
    const style = {transform: CSS.Translate.toString(transform)};

    // Link label↔value by default for new options
    const defaultLinkedOptionsState = () => {
        if (option.label === 'label' && option.value === 'value') return true;
        return option.label === option.value;
    };
    const [linkedOption, setLinkedOption] = useState(defaultLinkedOptionsState());

    const value = () => {
        if (watchedValue) return watchedValue;
        if (option.value) return option.value;
        return null;
    };

    const label = () => {
        if (watchedLabel) return watchedLabel;
        if (option.label) return option.label;
        return null;
    };

    return (
        <div
            style={style}
            ref={setNodeRef}
            className="i-flex-center s-8"
        >
            <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                <Icon icon="bx:dots-vertical-rounded" color={grayColor()} width={18} />
            </span>
            <InputHidden
                id={formId("id")}
                register={register}
                value={option.id}
            />
            <Input
                size="xs"
                id={formId("label")}
                register={register}
                errors={errors}
                defaultValue={watchedLabel ?? option.label}
                onChangeCapture={e => {
                    if (linkedOption) setValue(formId("value"), e.target.value);
                }}
                onClick={e => {
                    if (option.label && e.target.value === 'label') resetField(formId("label"));
                }}
                validate={{
                    required:  useTranslation("This field is mandatory"),
                    maxLength: {value: 255, message: "max length is 255"},
                }}
            />
            <Input
                size="xs"
                id={formId("value")}
                register={register}
                errors={errors}
                defaultValue={watchedValue ?? option.value}
                onChangeCapture={e => {
                    if (linkedOption) setValue(formId("label"), e.target.value);
                }}
                onClick={e => {
                    if (option.value && e.target.value === 'value') resetField(formId("value"));
                }}
                validate={{
                    required:  useTranslation("This field is mandatory"),
                    maxLength: {value: 255, message: "max length is 255"},
                }}
            />
            <div className="i-flex-center s-8">
                <Tooltip
                    label={
                        <button
                            type="button"
                            className={`acpt-btn-switch ${linkedOption ? 'active' : ''}`}
                            aria-label={useTranslation("Link label and value")}
                            aria-pressed={linkedOption}
                            onClick={e => {
                                e.preventDefault();
                                setLinkedOption(!linkedOption);
                            }}
                        >
                            <Icon icon="bx:bx-link" width={14} />
                        </button>
                    }
                    tip={useTranslation(linkedOption ? "Label and value are linked" : "Label and value are unlinked")}
                    icon={false}
                />
                <Tooltip
                    label={
                        <ButtonSwitch
                            control={control}
                            defaultValue={
                                typeof watchedIsDefault === "boolean"
                                    ? watchedIsDefault
                                    : (option.isDefault ?? false)
                            }
                            errors={errors}
                            icon="bx:check"
                            id={formId("isDefault")}
                            ariaLabel={useTranslation("Default value")}
                            externalOnChange={handleIsDefault}
                        />
                    }
                    tip={useTranslation("Default value")}
                    icon={false}
                />
            </div>
            <button
                type="button"
                className="btn-reset"
                aria-label={useTranslation("Delete")}
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(deleteOption({fieldIndex, optionIndex}));
                    remove(optionIndex);
                }}
            >
                <Icon icon="bx:trash" width={14} color={dangerColor()} />
            </button>
        </div>
    );
};

ProductDataFieldOption.propTypes = {
    fieldId:         PropTypes.string.isRequired,
    fieldIndex:      PropTypes.number.isRequired,
    optionIndex:     PropTypes.number.isRequired,
    option:          PropTypes.shape(productFieldOptionProps).isRequired,
    handleIsDefault: PropTypes.func,
};

export default ProductDataFieldOption;

import React, {memo, useState} from 'react';
import PropTypes from "prop-types";
import {useFormContext, useWatch} from "react-hook-form";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import InputHidden from "../../../../../components/Forms/InputHidden";
import {Icon} from "@iconify/react";
import Input from "../../../../../components/Forms/Input";
import useTranslation from "../../../../../hooks/useTranslation";
import DeleteProductDataFieldOptionModal from "../../Modal/DeleteProductDataFieldOptionModal";

const ProductDataFieldOption = memo(({index, fieldIndex, fieldId, option}) => {

    // manage form state
    const formId = (value) => {
        return `fields.${fieldIndex}.options.${index}.${value}`;
    };

    const { register, formState: {errors}, control, setValue } = useFormContext();
    const watchedValue = useWatch({
        control,
        name: formId("value")
    });
    const watchedLabel = useWatch({
        control,
        name: formId("label")
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: option.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage local state
    const [linkedOption, setLinkedOption] = useState(option.label === option.value);

    /**
     *
     * @return {string|*}
     */
    const value = () => {
        if(watchedValue){
            return watchedValue;
        }

        if(option.value){
            return option.value;
        }

        return null;
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {
        if(watchedLabel){
            return watchedLabel;
        }

        if(option.label){
            return option.label;
        }

        return null;
    };

    return (
        <div className="i-flex-center s-8" style={style} ref={setNodeRef}>
            <InputHidden
                id={formId("id")}
                value={option.id}
                register={register}
            />
            <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
            </span>
            <span className="i-flex-center s-24 w-100">
                <span className="w-100">
                    <Input
                        id={formId("label")}
                        register={register}
                        errors={errors}
                        defaultValue={label()}
                        onChangeCapture={e => {
                            if(linkedOption){
                                setValue(formId("value"), e.target.value);
                            }
                        }}
                        onClick={e => {
                            if(option.label && e.target.value === 'option'){
                                setValue(formId("label"), null);
                            }
                        }}
                        validate={{
                            required: useTranslation("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </span>
                <span>
                    <button
                        type="button"
                        className={`acpt-btn-switch ${linkedOption ? 'active' : ''}`}
                        onClick={e => {
                            e.preventDefault();
                            setLinkedOption(!linkedOption);
                        }}
                    >
                        <Icon icon="bx:bx-link" width="18px"/>
                    </button>
                </span>
                <span className="w-100">
                    <Input
                        id={formId("value")}
                        register={register}
                        errors={errors}
                        defaultValue={value()}
                        onChangeCapture={e => {
                            if(linkedOption){
                                setValue(formId("label"), e.target.value);
                            }
                        }}
                        onClick={e => {
                            if(option.value && e.target.value === 'option'){
                                setValue(formId("value"), null);
                            }
                        }}
                        validate={{
                            required: useTranslation("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }}
                    />
                </span>
                <DeleteProductDataFieldOptionModal
                    fieldIndex={fieldIndex}
                    optionIndex={index}
                />
            </span>
        </div>
    );
});

ProductDataFieldOption.propTypes = {
    fieldId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    option: PropTypes.object.isRequired,
};

export default ProductDataFieldOption;
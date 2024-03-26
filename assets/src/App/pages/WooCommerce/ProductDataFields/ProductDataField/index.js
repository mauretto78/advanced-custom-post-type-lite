import React from 'react';
import PropTypes from "prop-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useFormContext, useWatch} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import InputHidden from "../../../../components/Forms/InputHidden";
import Label from "../../../../components/Forms/Label";
import useTranslation from "../../../../hooks/useTranslation";
import Input from "../../../../components/Forms/Input";
import ProductDataFieldHeader from "./ProductDataFieldHeader";
import Select from "../../../../components/Forms/Select";
import {CHECKBOX, RADIO, SELECT, WooCommerceFieldsList} from "../../../../constants/woocommerce_fields";
import ProductDataFieldOptionsList from "./ProductDataFieldOptionsList";
import LazyElement from "../../../../components/LazyElement";

const ProductDataField = ({field, index, view}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.productDataFieldsState);

    // manage form state
    const { register, formState: {errors}, control, setValue } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `fields.${index}.${value}`;
    };

    const watchedType = useWatch({
        control,
        name: formId("type")
    });

    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    const fieldHasOptions = (fieldType) => {
        return (
            fieldType === SELECT ||
            fieldType === RADIO
        );
    };

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        return filter.length === 1;
    };

    return (
        <LazyElement
            id={field.id}
            element={
                <div id={field.id} className={`bg-white b-rounded ${view === 'list' ? "p-24" : ""}`} ref={view === 'list' ? setNodeRef : null} style={view === 'list' ? style : null}>
                    <InputHidden
                        id={formId("id")}
                        value={field.id}
                        register={register}
                    />
                    <div className={(view === 'tabular' || (!isClosed() && view === 'list')) ? 'mb-24' : ''}>
                        <ProductDataFieldHeader
                            index={index}
                            formId={formId}
                            view={view}
                            field={field}
                            attributes={attributes}
                            listeners={listeners}
                        />
                    </div>
                    <div className={`${isClosed() ? 'hidden' : ''}`}>
                        <div className="flex-column s-24">
                            <div className="container align-end">
                                <div className="col-6">
                                    <Label
                                        isRequired={true}
                                        id={formId("name")}
                                        label={useTranslation("Name")}
                                    />
                                    <Input
                                        id={formId("name")}
                                        register={register}
                                        errors={errors}
                                        placeholder={useTranslation("Name")}
                                        defaultValue={field.name}
                                        onClick={e => {
                                            if(field.name && e.target.value === 'field'){
                                                setValue(formId("name"), null);
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
                                </div>
                                <div className="col-6">
                                    <Label
                                        isRequired={true}
                                        id={formId("type")}
                                        label={useTranslation("Field type")}
                                    />
                                    <Select
                                        register={register}
                                        errors={errors}
                                        id={formId("type")}
                                        values={WooCommerceFieldsList}
                                    />
                                </div>
                            </div>
                            <div className="container align-end">
                                <div className="col-6">
                                    <Label
                                        isRequired={false}
                                        id={formId("defaultValue")}
                                        label={useTranslation("Default value")}
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
                                        isRequired={false}
                                        id={formId("description")}
                                        label={useTranslation("A brief description")}
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
                            {fieldHasOptions(fieldType()) && (
                                <ProductDataFieldOptionsList
                                    fieldId={field.id}
                                    fieldIndex={index}
                                    options={field.options ? field.options : []}
                                />
                            )}
                        </div>
                    </div>
                </div>
            }
        />
    );
};

ProductDataField.propTypes = {
    view: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default ProductDataField;
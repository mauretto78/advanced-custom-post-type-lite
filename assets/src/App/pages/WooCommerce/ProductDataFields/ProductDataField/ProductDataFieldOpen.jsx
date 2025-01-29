import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDispatch, useSelector} from "react-redux";
import {get, useFormContext, useWatch} from "react-hook-form";
import {SELECT, WooCommerceFieldsList} from "../../../../constants/woocommerce_fields";
import InputHidden from "../../../../components/Forms/InputHidden";
import Label from "../../../../components/Forms/Label";
import Select from "../../../../components/Forms/Select";
import Input from "../../../../components/Forms/Input";
import ProductDataFieldOptionsList from "./ProductDataFieldOptionsList";
import useTranslation from "../../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import ElementSelector from "../../BulkActions/ElementSelector";
import MetaFieldType from "../../../../components/MetaFieldType";
import Tooltip from "../../../../components/Tooltip";
import ButtonSwitch from "../../../../components/Forms/ButtonSwitch";
import ProductDataFieldActions from "./Commons/ProductDataFieldActions";

const ProductDataFieldOpen = ({field, index}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: field.id});
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

    const watchedName = useWatch({
        control,
        name: formId("name")
    });

    const watchedType = useWatch({
        control,
        name: formId("type")
    });

    const watchedIsRequired = useWatch({
        control,
        name: formId("isRequired")
    });

    /**
     *
     * @return {string|*}
     */
    const name = () => {
        const id = formId("name");
        const error = get(errors, id);

        if(error){
            return (
                <span className="invalid-feedback">
                    {useTranslation(error.message)}
                </span>
            );
        }

        return watchedName ? watchedName : field.name;
    };

    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    const fieldHasOptions = (fieldType) => {
        return (
            fieldType === SELECT
        );
    };

    return (
        <tr
            id={field.id}
            ref={setNodeRef}
            style={style}
            className={`bg-white ${isDragging ? "b-rounded z-100 with-drop-shadow" : ""}`}
        >
            <td
                style={{background: "#eff6fc3b"}}
                className="with-active-border"
                colSpan={4}
            >
                <InputHidden
                    id={formId("id")}
                    value={field.id}
                    register={register}
                />
                <div className="mb-24">
                    <div className="flex-between s-8 for-xs">
                            <span className="i-flex-center s-8">
                               <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                                    <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                                </span>
                                <ElementSelector
                                    element={{
                                        id: field.id,
                                    }}
                                />
                                <h3>
                                    {name()}
                                </h3>
                                <span className="color-gray">
                                    <MetaFieldType fieldType={fieldType()} css="top-2" />
                                </span>
                                 <span className="i-flex-center s-8">
                                     <Tooltip
                                         label={
                                             <React.Fragment>
                                                 <ButtonSwitch
                                                     control={control}
                                                     defaultValue={typeof watchedIsRequired  === "boolean" ? watchedIsRequired : field.isRequired}
                                                     errors={errors}
                                                     icon="foundation:asterisk"
                                                     id={formId("isRequired")}
                                                 />
                                             </React.Fragment>
                                         }
                                         tip={useTranslation("Field required")}
                                         icon={false}
                                     />
                                 </span>
                            </span>
                        <ProductDataFieldActions
                            field={field}
                            index={index}
                        />
                    </div>
                </div>
                <div className="bg-white with-border b-rounded p-24">
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
            </td>
        </tr>
    );
};

ProductDataFieldOpen.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default ProductDataFieldOpen;
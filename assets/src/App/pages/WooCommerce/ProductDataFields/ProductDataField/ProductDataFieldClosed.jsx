import React, {useRef, useState} from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useDispatch, useSelector} from "react-redux";
import {get, useFormContext, useWatch} from "react-hook-form";
import ProductDataFieldActions from "./Commons/ProductDataFieldActions";
import {Icon} from "@iconify/react";
import ElementSelector from "../../BulkActions/ElementSelector";
import useTranslation from "../../../../hooks/useTranslation";
import Select from "../../../../components/Forms/Select";
import MetaFieldType from "../../../../components/MetaFieldType";
import {WooCommerceFieldsList} from "../../../../constants/woocommerce_fields";
import {useOutsideClick} from "../../../../hooks/useOutsideClick";
import Input from "../../../../components/Forms/Input";

const ProductDataFieldClosed = ({field, index}) => {

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

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    // manage local state
    const [editName, setEditName] = useState(false);
    const [editType, setEditType] = useState(false);

    const editTypeNode = useRef();
    const editNameNode = useRef();

    useOutsideClick([editTypeNode], () => {
        setEditType(false);
    });

    useOutsideClick([editNameNode], () => {
        setEditName(false);
    });

    return (
        <React.Fragment>
            <tr
                id={field.id}
                ref={setNodeRef}
                style={style}
                className={`bg-white b-rounded ${isDragging ? "z-100 with-drop-shadow" : ""}`}
            >
                <td>
                    <span className="i-flex-center s-8">
                        <span className="cursor-move handle top-2" {...attributes} {...listeners}>
                            <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                        </span>
                        <ElementSelector
                            element={{
                                id: field.id,
                            }}
                        />
                    </span>
                </td>
                <td>
                    {editName ?
                        <div
                            ref={editNameNode}
                            style={{maxWidth: "200px"}}
                        >
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
                        :
                        <div
                            className="i-flex-center s-8 cursor-pointer"
                            onClick={() => {
                                if(window.innerWidth >= 960){
                                    setEditName(!editName);
                                }
                            }}
                        >
                            {name()}
                        </div>
                    }
                </td>
                <td>
                    {editType ?
                        <div
                            ref={editTypeNode}
                            style={{maxWidth: "200px"}}
                        >
                            <Select
                                register={register}
                                id={formId("type")}
                                errors={errors}
                                defaultValue={field.type}
                                values={WooCommerceFieldsList}
                            />
                        </div>
                        :
                        <div
                            className="i-flex-center s-8 cursor-pointer"
                            onClick={() => {
                                if(window.innerWidth >= 960){
                                    setEditType(!editType);
                                }
                            }}
                        >
                            <MetaFieldType
                                fieldType={fieldType()}
                                css="with-border b-rounded p-8"
                            />
                        </div>
                    }
                </td>
                <td>
                    <ProductDataFieldActions
                        field={field}
                        index={index}
                    />
                </td>
            </tr>
        </React.Fragment>
    );
};

ProductDataFieldClosed.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
};

export default ProductDataFieldClosed;
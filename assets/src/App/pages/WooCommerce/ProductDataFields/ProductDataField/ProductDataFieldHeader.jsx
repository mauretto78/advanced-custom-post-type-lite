import React from 'react';
import PropTypes from "prop-types";
import {get, useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {Icon} from "@iconify/react";
import useTranslation from "../../../../hooks/useTranslation";
import Tooltip from "../../../../components/Tooltip";
import {saveIsClosed} from "../../../../utils/localStorage";
import {addField, hideElement, showElement} from "../../../../redux/reducers/productDataFieldsStateSlice";
import {useDispatch, useSelector} from "react-redux";
import MetaFieldType from "../../../../components/MetaFieldType";
import ButtonSwitch from "../../../../components/Forms/ButtonSwitch";
import DeleteProductDataFieldModal from "../Modal/DeleteProductDataFieldModal";
import {cloneWCField} from "../../../../utils/cloners";
import {delay} from "../../../../utils/misc";
import {scrollToId} from "../../../../utils/scroll";
import ElementSelector from "../../BulkActions/ElementSelector";

const ProductDataFieldHeader = ({field, view, listeners, attributes, index, formId}) => {

    // manage form state
    const { formState: {errors}, control } = useFormContext();
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

    const { append } = useFieldArray({
        control,
        name: "fields"
    });

    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.productDataFieldsState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === page.id);

        return filter.length === 1;
    };

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

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(field.id);

        if((isClosed())){
            dispatch(showElement({id: field.id}));
        } else {
            dispatch(hideElement({id: field.id}));
        }
    };

    return (
        <div className="flex-between s-8 for-xs">
            <span className="i-flex-center s-8">
                {view === 'list' && (
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                )}
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
            <span className="i-flex-center s-8">
                <Tooltip
                    label={
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                const duplicatedField = cloneWCField(field);
                                dispatch(addField({field: duplicatedField}));
                                append(duplicatedField);

                                delay(1).then(()=>{
                                    scrollToId(duplicatedField.id);
                                });
                            }}
                        >
                            <Icon icon="bx:duplicate" width={18} />
                        </a>
                    }
                    tip={useTranslation("Duplicate this meta field")}
                    icon={false}
                />
                <Tooltip
                    label={
                        <DeleteProductDataFieldModal
                            index={index}
                            field={field}
                        />
                    }
                    tip={useTranslation("Delete this meta field")}
                    icon={false}
                />
                {view === 'list' && (
                    <Tooltip
                        label={
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    handleToggleClose();
                                }}
                            >
                                <Icon icon="bx:expand-alt" width={18} />
                            </a>
                        }
                        tip={useTranslation("Hide/show this meta field")}
                        icon={false}
                    />
                )}
            </span>
        </div>
    );
};

ProductDataFieldHeader.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired,
    listeners: PropTypes.func,
    attributes: PropTypes.func,
    formId: PropTypes.func.isRequired,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
};

export default ProductDataFieldHeader;
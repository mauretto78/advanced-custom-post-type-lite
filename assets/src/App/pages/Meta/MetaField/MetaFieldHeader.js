import React, {memo} from "react";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import useTranslation from "../../../hooks/useTranslation";
import {get, useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import MetaFieldType from "../../../components/MetaFieldType";
import Tooltip from "../../../components/Tooltip";
import {saveIsClosed} from "../../../utils/localStorage";
import DeleteMetaFieldModal from "../Modal/DeleteMetaFieldModal";
import {addField, hideElement, showElement} from "../../../redux/reducers/metaStateSlice";
import {useDispatch, useSelector} from "react-redux";
import ButtonSwitch from "../../../components/Forms/ButtonSwitch";
import {cloneField} from "../../../utils/cloners";
import {delay} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import MetaFieldShortCodeModal from "../Modal/MetaFieldShortCodeModal";
import {fieldTypes} from "../../../constants/fields";
import CopyMetaFieldModal from "../Modal/CopyMetaFieldModal";
import {getFormId} from "../../../utils/fields";
import ElementSelector from "../BulkActions/ElementSelector";

const MetaFieldHeader = memo(({boxId, field, view, listeners, attributes, formId, boxIndex, fieldIndex, parentFieldId, parentBlockId, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group, closedElements, selectedElementsType} = useSelector(state => state.metaState);

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
    const watchedField = useWatch({
        control,
        name: `boxes.${boxIndex}.fields.${fieldIndex}`
    });
    const watchedShowInArchive = useWatch({
        control,
        name: formId("showInArchive")
    });
    const watchedFilterableInAdmin = useWatch({
        control,
        name: formId("filterableInAdmin")
    });
    const watchedQuickEdit = useWatch({
        control,
        name: formId("quickEdit")
    });
    const watchedIsRequired = useWatch({
        control,
        name: formId("isRequired")
    });
    const { append } = useFieldArray({
        control,
        name: getFormId(group.boxes, boxId, field.id, false),
    });

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

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
     *
     * @return {boolean|boolean}
     */
    const showTheShortcode = () => {
        return fieldType() !== fieldTypes.REPEATER && fieldType() !== fieldTypes.FLEXIBLE;
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

    /**
     *
     * @return {boolean}
     */
    const canCopyTheField = () => {

        if(typeof field.isSaved !== 'undefined' && field.isSaved === false){
            return false
        }

        return true;
    };

    return (
        <div className="flex-between s-8 for-xs">
            <span className="i-flex-center s-8">
                {view === 'list' && (
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                )}
                {selectedElementsType !== 'box' && selectedElementsType !== 'block' && canCopyTheField() && (
                    <ElementSelector
                        elementType="field"
                        element={{
                            id: field.id,
                            boxId: boxId,
                            parentFieldId: parentFieldId,
                            parentBlockId: parentBlockId
                        }}
                    />
                )}
                <h3>
                    {name()}
                </h3>
                <span className="color-gray">
                    <MetaFieldType fieldType={fieldType()} css="top-2" />
                </span>
                <span className="i-flex-center s-8">
                    <Tooltip
                        label={
                            <ButtonSwitch
                                id={formId("showInArchive")}
                                control={control}
                                defaultValue={typeof watchedShowInArchive === "boolean" ? watchedShowInArchive : field.showInArchive}
                                errors={errors}
                                icon="bxl:wordpress"
                             />
                        }
                        tip={useTranslation("Show in Wordpress admin post lists page")}
                        icon={false}
                    />
                    <Tooltip
                        label={
                            <ButtonSwitch
                                control={control}
                                defaultValue={typeof watchedFilterableInAdmin  === "boolean" ? watchedFilterableInAdmin : field.filterableInAdmin}
                                errors={errors}
                                icon="bx:filter"
                                id={formId("filterableInAdmin")}
                            />
                        }
                        tip={useTranslation("Filterable in Wordpress admin post lists page")}
                        icon={false}
                    />
                    <Tooltip
                        label={
                            <ButtonSwitch
                                control={control}
                                defaultValue={typeof watchedQuickEdit  === "boolean" ? watchedQuickEdit : field.quickEdit}
                                errors={errors}
                                icon="bx:pencil"
                                id={formId("quickEdit")}
                            />
                        }
                        tip={useTranslation("Quick edit in Wordpress admin post lists page")}
                        icon={false}
                    />
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
                {showTheShortcode() && (
                    <Tooltip
                        label={
                            <MetaFieldShortCodeModal
                                boxId={boxId}
                                field={field}
                                parentFieldId={parentFieldId}
                                parentBlockId={parentBlockId}
                            />
                        }
                        tip={useTranslation("Show the shortcode")}
                        icon={false}
                    />
                )}
                <Tooltip
                    label={
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                const duplicatedField = cloneField(boxId, watchedField);
                                dispatch(addField({boxId, field: duplicatedField}));
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
                {canCopyTheField() && (
                    <Tooltip
                        label={
                            <CopyMetaFieldModal field={field} />
                        }
                        tip={useTranslation("Copy this meta field")}
                        icon={false}
                    />
                )}
                <Tooltip
                    label={
                            <DeleteMetaFieldModal
                                setActiveTab={setActiveTab}
                                boxId={boxId}
                                fieldId={field.id}
                                fieldIndex={fieldIndex}
                                parentFieldId={parentFieldId}
                                parentBlockId={parentBlockId}
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
});

MetaFieldHeader.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    formId: PropTypes.func.isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    field: PropTypes.object.isRequired,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    attributes: PropTypes.object,
    listeners: PropTypes.object,
    setActiveTab: PropTypes.func,
};

export default MetaFieldHeader;


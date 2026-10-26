import React, {useState} from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import InputHidden from "../../../../../../../components/Forms/InputHidden";
import {useFormContext, useWatch} from "react-hook-form";
import Input from "../../../../../../../components/Forms/Input";
import useTranslation from "../../../../../../../hooks/useTranslation";
import {useSelector} from "react-redux";
import DeleteMetaOptionModal from "../../../../../Modal/DeleteMetaOptionModal";
import {getFormId} from "../../../../../../../utils/fields";
import {dangerColor, grayColor} from "../../../../../../../utils/colors";
import Tooltip from "../../../../../../../components/Tooltip";
import ButtonSwitch from "../../../../../../../components/Forms/ButtonSwitch";
import {optionProps} from "../../../../../../../props/metaProps.js";

const MetaOption = ({index, boxIndex, fieldIndex, boxId, fieldId, parentFieldId, option, handleIsDefault}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const formId = (value) => {

        if(parentFieldId){
            return `${getFormId(group.boxes, boxId, fieldId)}.options.${index}.${value}`;
        }

        return `boxes.${boxIndex}.fields.${fieldIndex}.options.${index}.${value}`;
    };

    const { register, formState: {errors}, control, setValue, resetField } = useFormContext();
    const watchedValue = useWatch({
        control,
        name: formId("value")
    });
    const watchedLabel = useWatch({
        control,
        name: formId("label")
    });
    const watchedIsDefault = useWatch({
        control,
        name: formId("isDefault")
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: option.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage local state
    const defaultLinkedOptionsState = () => {
        if(option.label === 'label' && option.value === 'value'){
            return true;
        }

        return option.label === option.value;
    };

    const [linkedOption, setLinkedOption] = useState(defaultLinkedOptionsState());

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
        <React.Fragment>
            <div
                style={style}
                ref={setNodeRef}
                className={`i-flex-center s-8`}
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
                        if(linkedOption){
                            setValue(formId("value"), e.target.value);
                        }
                    }}
                    onClick={e => {
                        if(option.label && e.target.value === 'label'){
                            resetField(formId("label"));
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
                <Input
                    size="xs"
                    id={formId("value")}
                    register={register}
                    errors={errors}
                    defaultValue={watchedValue ?? option.value}
                    onChangeCapture={e => {
                        if(linkedOption){
                            setValue(formId("label"), e.target.value);
                        }
                    }}
                    onClick={e => {
                        if(option.value && e.target.value === 'value'){
                            resetField(formId("value"));
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
                                defaultValue={typeof watchedIsDefault  === "boolean" ? watchedIsDefault :  option.isDefault}
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
                {/* BUG FIX: this used to be a hand-rolled button that dispatched
                    deleteOption() straight to Redux with no confirmation and, crucially,
                    no RHF useFieldArray `remove()` call -- so the form's `options` array
                    (submitted on save) stayed out of sync with Redux after every delete,
                    leaving a stale/orphaned option in the payload. DeleteMetaOptionModal
                    already existed fully wired to do both (see its onConfirm) and mirrors
                    DeleteMetaFieldModal/DeleteMetaBoxModal's confirm-then-dual-dispatch
                    pattern, it just was never rendered here -- dead import. */}
                <DeleteMetaOptionModal
                    boxId={boxId}
                    fieldId={fieldId}
                    parentFieldId={parentFieldId}
                    optionId={option.id}
                    optionIndex={index}
                    trigger={
                        <button
                            type="button"
                            className="btn-reset"
                            aria-label={useTranslation("Delete")}
                        >
                            <Icon icon="bx-trash" width={14} color={dangerColor()} />
                        </button>
                    }
                />
            </div>
        </React.Fragment>
    );
};

MetaOption.propTypes = {
    index: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    option: PropTypes.shape(optionProps).isRequired,
    handleIsDefault: PropTypes.func
};

export default MetaOption;
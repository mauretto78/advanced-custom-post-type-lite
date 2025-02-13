import React, {useState} from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import InputHidden from "../../../../../../components/Forms/InputHidden";
import {useFormContext, useWatch} from "react-hook-form";
import Input from "../../../../../../components/Forms/Input";
import useTranslation from "../../../../../../hooks/useTranslation";
import {useSelector} from "react-redux";
import DeleteMetaOptionModal from "../../../../Modal/DeleteMetaOptionModal";
import {getFormId} from "../../../../../../utils/fields";
import Tooltip from "../../../../../../components/Tooltip";
import ButtonSwitch from "../../../../../../components/Forms/ButtonSwitch";

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
            <InputHidden
                id={formId("id")}
                value={option.id}
                register={register}
            />
            <tr
                style={style}
                ref={setNodeRef}
                className={`bg-white ${isDragging ? "b-rounded z-100 with-drop-shadow" : ""}`}
            >
                <td>
                     <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
                    <span className="i-flex-center s-8">
                         <Tooltip
                             label={
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
                                     externalOnChange={handleIsDefault}
                                 />
                             }
                             tip={useTranslation("Default value")}
                             icon={false}
                         />
                    </span>
                </td>
                <td>
                    <DeleteMetaOptionModal
                        boxId={boxId}
                        fieldId={fieldId}
                        optionId={option.id}
                        parentFieldId={parentFieldId}
                        optionIndex={index}
                    />
                </td>
            </tr>
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
    option: PropTypes.object.isRequired,
    handleIsDefault: PropTypes.func
};

export default MetaOption;
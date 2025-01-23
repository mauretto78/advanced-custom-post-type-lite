import React from "react";
import Tabs from "../../../components/Tabs";
import Tab from "../../../components/Tabs/Tab";
import {Icon} from "@iconify/react";
import useTranslation from "../../../hooks/useTranslation";
import BasicTab from "./Tabs/BasicTab";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {get, useFormContext, useWatch} from "react-hook-form";
import {canCopyTheField, formatFieldForSelection, isTextualField, metaFieldFormId} from "../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import ElementSelector from "../BulkActions/ElementSelector";
import MetaFieldActions from "./Commons/MetaFieldActions";
import MetaFieldSwitches from "./Commons/MetaFieldSwitches";
import MetaFieldIds from "./Commons/MetaFieldIds";
import MetaFieldType from "../../../components/MetaFieldType";
import Tooltip from "../../../components/Tooltip";

const MetaFieldOpen = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const dispatch = useDispatch();
    const {group, selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, control } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return metaFieldFormId(group.boxes, boxId, field.id,value);
    };

    const watchedName = useWatch({
        control,
        name: metaFieldFormId(group.boxes, boxId, field.id,"name")
    });
    const watchedLabel = useWatch({
        control,
        name: metaFieldFormId(group.boxes, boxId, field.id,"label")
    });
    const watchedType = useWatch({
        control,
        name: metaFieldFormId(group.boxes, boxId, field.id,"type")
    });

    /**
     *
     * @return {string|*}
     */
    const name = () => {
        const id = metaFieldFormId(group.boxes, boxId, field.id, "name");
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
     * @return {null|*}
     */
    const label = () => {
        return (typeof watchedLabel === 'string') ? watchedLabel : field.label;
    };

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    return (
        <React.Fragment>
            <MetaFieldIds
                boxId={boxId}
                field={field}
                parentFieldId={parentFieldId}
                parentBlockId={parentBlockId}
            />
            <tr
                id={field.id}
                ref={setNodeRef}
                style={style}
                className={`bg-white ${isDragging ? "b-rounded z-100 with-drop-shadow" : ""}`}
            >
                <td
                    style={{background: "#eff6fc3b"}}
                    className="with-active-border"
                    colSpan={7}
                >
                    <div>
                        <div className="flex-between s-8 mb-24 for-xs">
                            <span className="i-flex-center s-8">
                                {(parentFieldId || parentBlockId) && (
                                    <Tooltip
                                        label={<Icon icon="tabler:arrow-guide" color="#02C39A" width={18} />}
                                        tip={useTranslation(`Child field`)}
                                        icon={false}
                                    />
                                )}
                                <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                                    <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                                </span>
                                {selectedElementsType !== 'box' && selectedElementsType !== 'block' && canCopyTheField(field.isSaved) && (
                                    <ElementSelector
                                        elementType="field"
                                        element={formatFieldForSelection(field, boxId, parentFieldId, parentBlockId)}
                                    />
                                )}
                                <div className="i-flex-center s-8 text-ellipsis">
                                    <h3>
                                        {name()}
                                    </h3>
                                    <span className="color-gray">
                                        {label()}
                                    </span>
                               </div>
                                <MetaFieldSwitches
                                    boxId={boxId}
                                    field={field}
                                />
                                 <MetaFieldType
                                     fieldType={fieldType()}
                                     css="with-border b-rounded p-8"
                                 />
                            </span>
                            <MetaFieldActions
                                boxIndex={boxIndex}
                                field={field}
                                boxId={boxId}
                                fieldIndex={fieldIndex}
                                parentFieldIndex={parentFieldIndex}
                                parentFieldId={parentFieldId}
                                parentBlockId={parentBlockId}
                            />
                        </div>
                        <div>
                            <BasicTab
                                boxIndex={boxIndex}
                                fieldIndex={fieldIndex}
                                formId={formId}
                                boxId={boxId}
                                field={field}
                            />
                        </div>
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );
};

export default MetaFieldOpen;
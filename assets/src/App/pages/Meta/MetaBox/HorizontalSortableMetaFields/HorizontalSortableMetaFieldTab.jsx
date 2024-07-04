import React from "react";
import PropTypes from 'prop-types';
import MetaFieldType from "../../../../components/MetaFieldType";
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {getFormId} from "../../../../utils/fields";
import {useSelector} from "react-redux";
import ElementSelector from "../../BulkActions/ElementSelector";

const HorizontalSortableMetaFieldTab = ({isActive, onClick, boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId}) => {

    // manage global state
    const {group, selectedElementsType} = useSelector(state => state.metaState);

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, field.id)}.${value}`;
    };

    // manage form state
    const { control } = useFormContext();
    const watchedFieldName = useWatch({
        control,
        name: formId("name")
    });
    const watchedFieldType = useWatch({
        control,
        name: formId("type")
    });
    const watchedIsRequired = useWatch({
        control,
        name: formId("isRequired")
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
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
        <React.Fragment>
            <div
                className={`acpt-btn-switch ${isActive ? 'active' : ''}`}
                ref={setNodeRef}
                style={style}
                onClick={() => {
                    onClick(fieldIndex);
                }}
            >
                <div className="i-flex-center s-8">
                    <span
                        className="cursor-move top-2 handle" {...attributes} {...listeners}
                        onMouseDownCapture={() => {
                            onClick(fieldIndex);
                        }}
                    >
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
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
                    <span
                        className="text-ellipsis"
                        style={{
                            maxWidth: "200px"
                        }}
                    >
                        {watchedFieldName ? watchedFieldName : field.name}
                        {watchedIsRequired && watchedIsRequired === true && <span>*</span>}
                    </span>
                    <MetaFieldType fieldType={watchedFieldType ? watchedFieldType : field.type} css="top-2" />
                </div>
            </div>
        </React.Fragment>
    );
};

HorizontalSortableMetaFieldTab.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    fieldIndex: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default HorizontalSortableMetaFieldTab;


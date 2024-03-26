import React from "react";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {useFormContext, useWatch} from "react-hook-form";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Icon} from "@iconify/react";
import {getFormId} from "../../../../../../utils/fields";
import Badge from "../../../../../../components/Badge";
import {styleVariants} from "../../../../../../constants/styles";
import ElementSelector from "../../../../BulkActions/ElementSelector";

const HorizontalSortableMetaBlockTab = ({isActive, onClick, boxIndex, blockIndex, boxId, block, parentFieldIndex, parentFieldId}) => {

    // manage global state
    const {group, selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, block.id)}.${value}`;
    };

    const watchedBlockName = useWatch({
        control,
        name: formId("name")
    });

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: block.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    /**
     *
     * @return {boolean}
     */
    const canCopyTheBlock = () => {

        if(typeof block.isSaved !== 'undefined' && block.isSaved === false){
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
                    onClick(blockIndex);
                }}
            >
                <div className="i-flex-center s-8">
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                    {selectedElementsType !== 'box' && selectedElementsType !== 'field' && canCopyTheBlock() && (
                        <ElementSelector
                            elementType="block"
                            element={{
                                id: block.id,
                                boxId: boxId,
                                parentFieldId: parentFieldId
                            }}
                        />
                    )}
                    <span
                        className="text-ellipsis"
                        style={{
                            maxWidth: "200px"
                        }}
                    >
                        {watchedBlockName ? watchedBlockName : block.name}
                    </span>
                    <Badge style={isActive ? styleVariants.SECONDARY : styleVariants.DISABLED}>
                        {block.fields ? block.fields.length : 0}
                    </Badge>
                </div>
            </div>
        </React.Fragment>
    );
};

HorizontalSortableMetaBlockTab.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    blockIndex: PropTypes.string.isRequired,
    block: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default HorizontalSortableMetaBlockTab;
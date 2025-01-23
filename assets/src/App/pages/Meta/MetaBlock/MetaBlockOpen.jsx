import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useSelector} from "react-redux";
import {getFormId} from "../../../utils/fields";
import MetaBlockHeader from "./MetaBlockHeader";
import VerticalSortableMetaFields from "../MetaBox/VerticalSortableMetaFields";
import {fieldSettings} from "../../../constants/fields";

const MetaBlockOpen = ({blockIndex, block, boxIndex, boxId, parentFieldIndex, parentFieldId, isMainView}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: block.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const {group, closedElements} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === block.id);

        return filter.length === 1;
    };

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, block.id)}.${value}`;
    };

    const flexibleFieldsNestingLevel = 0;
    const addFieldEnabled = flexibleFieldsNestingLevel < fieldSettings.MAX_NESTING;

    /**
     *
     * @return {string}
     */
    const sortableWrapperClassName = () => {
        if(isClosed()){
            return 'hidden';
        }

        return 'mt-24';
    };

    const bg = {background: "#eff6fc3b"};

    if(isMainView){
        return (
            <tr
                id={block.id}
                className={`bg-white ${isDragging ? "b-rounded z-100 with-drop-shadow" : ""}`}
                ref={setNodeRef}
                style={style}
            >
                <td
                    style={bg}
                    className="with-active-border"
                    colSpan={7}
                >
                    <MetaBlockHeader
                        formId={formId}
                        boxIndex={boxIndex}
                        attributes={attributes }
                        listeners={listeners }
                        boxId={boxId}
                        block={block}
                        blockIndex={blockIndex}
                        parentFieldId={parentFieldId}
                    />
                    <div className={sortableWrapperClassName()}>
                        <VerticalSortableMetaFields
                            addFieldEnabled={addFieldEnabled}
                            boxIndex={boxIndex}
                            boxId={boxId}
                            parentFieldIndex={parentFieldIndex}
                            parentFieldId={parentFieldId}
                            parentBlockId={block.id}
                            fields={block.fields}
                        />
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div
            id={block.id}
            className={`bg-white b-rounded with-active-border p-24 ${isDragging ? "z-100 with-drop-shadow" : "with-shadow"}`}
            ref={setNodeRef}
            style={{...style, ...bg}}
        >
            <MetaBlockHeader
                formId={formId}
                boxIndex={boxIndex}
                attributes={attributes }
                listeners={listeners }
                boxId={boxId}
                block={block}
                blockIndex={blockIndex}
                parentFieldId={parentFieldId}
            />
            <div className={sortableWrapperClassName()}>
                <VerticalSortableMetaFields
                    addFieldEnabled={addFieldEnabled}
                    boxIndex={boxIndex}
                    boxId={boxId}
                    parentFieldIndex={parentFieldIndex}
                    parentFieldId={parentFieldId}
                    parentBlockId={block.id}
                    fields={block.fields}
                />
            </div>
        </div>
    );
};

MetaBlockOpen.propTypes = {
    isMainView: PropTypes.bool,
    blockIndex: PropTypes.number.isRequired,
    block: PropTypes.object.isRequired,
    boxId: PropTypes.string.isRequired,
    boxIndex: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string.isRequired
};

export default MetaBlockOpen;
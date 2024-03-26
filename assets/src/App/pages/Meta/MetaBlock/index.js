import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useSelector} from "react-redux";
import {getFormId} from "../../../utils/fields";
import MetaBlockHeader from "./MetaBlockHeader";
import VerticalSortableMetaFields from "../MetaBox/VerticalSortableMetaFields";
import HorizontalSortableMetaFields from "../MetaBox/HorizontalSortableMetaFields";
import {fieldSettings} from "../../../constants/fields";

const MetaBlock = ({setActiveTab, blockIndex, block, view, boxIndex, boxId, parentFieldIndex, parentFieldId}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: block.id});
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

    const flexibleFieldsNestingLevel = 0; // @TODO
    const addFieldEnabled = flexibleFieldsNestingLevel < fieldSettings.MAX_NESTING;

    return (
        <div id={block.id} className={`bg-white b-rounded ${view === 'list' ? 'p-24 with-shadow' : ''}`} ref={view === 'list' ? setNodeRef : null} style={view === 'list' ? style : null}>
            <MetaBlockHeader
                formId={formId}
                boxIndex={boxIndex}
                setActiveTab={setActiveTab}
                attributes={view === 'list' ? attributes : null}
                listeners={view === 'list' ? listeners : null}
                view={view}
                boxId={boxId}
                block={block}
                blockIndex={blockIndex}
                parentFieldId={parentFieldId}
            />
            {view === 'list' ? (
                <div className={`${isClosed() ? 'hidden' : 'mt-24'}`}>
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
            ) : (
                <div className="mt-24">
                    <HorizontalSortableMetaFields
                        addFieldEnabled={addFieldEnabled}
                        boxIndex={boxIndex}
                        boxId={boxId}
                        parentFieldIndex={parentFieldIndex}
                        parentFieldId={parentFieldId}
                        parentBlockId={block.id}
                        fields={block.fields}
                    />
                </div>
            )}
        </div>
    );
};

MetaBlock.propTypes = {
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    blockIndex: PropTypes.number.isRequired,
    block: PropTypes.object.isRequired,
    boxId: PropTypes.string.isRequired,
    boxIndex: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func,
};

export default MetaBlock;
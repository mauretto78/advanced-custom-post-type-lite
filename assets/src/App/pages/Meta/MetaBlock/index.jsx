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

    /**
     * @return {string}
     */
    const blockClassName = () => {
        let css = 'bg-white b-rounded';

        if(view === 'list'){
            css = css + ' with-shadow p-24';
        }

        if(view === 'tabular'){
            css = css + ' p-24';
        }

        if(view === 'accordion'){
            css = css + ' b-bottom-1';
        }

        return css;
    };

    /**
     *
     * @return {string}
     */
    const sortableWrapperClassName = () => {
        if(isClosed()){
            return 'hidden';
        }

        if(view === 'list'){
            return 'mt-24';
        }

        return '';
    };

    return (
        <div
            id={block.id}
            className={blockClassName()}
            ref={(view === 'list' || view === 'accordion') ? setNodeRef : null}
            style={(view === 'list' || view === 'accordion') ? style : null}
        >
            <MetaBlockHeader
                formId={formId}
                boxIndex={boxIndex}
                setActiveTab={setActiveTab}
                attributes={(view === 'list' || view === 'accordion') ? attributes : null}
                listeners={(view === 'list' || view === 'accordion') ? listeners : null}
                view={view}
                boxId={boxId}
                block={block}
                blockIndex={blockIndex}
                parentFieldId={parentFieldId}
            />
            {(view === 'list' || view === 'accordion') ? (
                <div className={sortableWrapperClassName()}>
                    <VerticalSortableMetaFields
                        addFieldEnabled={addFieldEnabled}
                        boxIndex={boxIndex}
                        boxId={boxId}
                        parentFieldIndex={parentFieldIndex}
                        parentFieldId={parentFieldId}
                        parentBlockId={block.id}
                        fields={block.fields}
                        view={view}
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
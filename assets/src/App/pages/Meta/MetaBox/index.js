import React from "react";
import PropTypes from 'prop-types';
import MetaBoxHeader from "./MetaBoxHeader";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import VerticalSortableMetaFields from "./VerticalSortableMetaFields";
import HorizontalSortableMetaFields from "./HorizontalSortableMetaFields";
import {useSelector} from "react-redux";

const MetaBox = ({index, box, view, setActiveTab}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: box.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const {closedElements} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === box.id);

        return filter.length === 1;
    };

    return (
        <div id={box.id} className={view === 'list' ? 'bg-white b-rounded with-shadow p-24' : ''} ref={view === 'list' ? setNodeRef : null} style={view === 'list' ? style : null}>
            <div className={(view === 'tabular' || (!isClosed() && view === 'list')) ? 'mb-24' : ''}>
                <MetaBoxHeader
                    index={index}
                    setActiveTab={setActiveTab}
                    attributes={view === 'list' ? attributes : null}
                    listeners={view === 'list' ? listeners : null}
                    box={box}
                    view={view}
                />
            </div>
            {view === 'list' ? (
                <div className={`${isClosed() ? 'hidden' : ''}`}>
                    <VerticalSortableMetaFields
                        boxIndex={index}
                        boxId={box.id}
                        fields={box.fields}
                    />
                </div>
            ) : (
                <div>
                    <HorizontalSortableMetaFields
                        boxIndex={index}
                        boxId={box.id}
                        fields={box.fields}
                    />
                </div>
            )}
        </div>
    );
};

MetaBox.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
};

export default MetaBox;
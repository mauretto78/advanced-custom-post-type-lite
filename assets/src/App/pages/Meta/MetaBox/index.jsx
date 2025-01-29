import React from "react";
import PropTypes from 'prop-types';
import MetaBoxHeader from "./MetaBoxHeader";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import VerticalSortableMetaFields from "./VerticalSortableMetaFields";
import {useSelector} from "react-redux";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const MetaBox = ({index, box, setActiveTab}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: box.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const {closedElements} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === box.id);

        return filter.length === 1;
    };

    return (
        <div
            id={box.id}
            className={`bg-white b-rounded ${isDragging ? "z-100 with-drop-shadow" : "with-shadow"}`}
            ref={setNodeRef}
            style={style}
        >
            <MetaBoxHeader
                index={index}
                setActiveTab={setActiveTab}
                attributes={attributes }
                listeners={listeners}
                box={box}
            />
            <div ref={parent}>
                {!isClosed() && (
                    <VerticalSortableMetaFields
                        boxIndex={index}
                        boxId={box.id}
                        fields={box.fields}
                    />
                )}
            </div>
        </div>
    );
};

MetaBox.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func,
};

export default MetaBox;
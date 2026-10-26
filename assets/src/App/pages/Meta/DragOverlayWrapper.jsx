import React, {useState} from 'react';
import {DragOverlay, useDndMonitor} from "@dnd-kit/core";
import {useSelector} from "react-redux";
import TypedBadge from "../../components/TypedBadge/index.jsx";
import CanvasPreviewElement from "./Canvas/CanvasPreviewElement.jsx";
import DraggingMetaBox from "./Canvas/DraggingMetaBox.jsx";
import DraggingBlock from "./Canvas/DraggingBlock.jsx";

const DragOverlayWrapper = () => {

    const {group} = useSelector(state => state.metaState);
    const [draggedItem, setDraggedItem] = useState(null);

    useDndMonitor({
        onDragStart:  (event) => setDraggedItem(event.active),
        onDragCancel: ()      => setDraggedItem(null),
        onDragEnd:    ()      => setDraggedItem(null),
    });

    if (!draggedItem) return null;

    const isSidebarElement = draggedItem.data.current?.fromSidebar;
    const isCanvasElement  = draggedItem.data.current?.fromCanvas;
    const isBlock          = draggedItem.data.current?.isBlock;
    const isBox            = draggedItem.data.current?.fromCanvasBox;

    let node = null;

    if (isSidebarElement) {
        node = (
            <TypedBadge
                item={draggedItem.data.current.column}
                mode="overlay"
            />
        );
    } else if (isBlock) {
        const block = draggedItem.data.current?.block;
        if (block) {
            node = <DraggingBlock block={block} />;
        }
    } else if (isCanvasElement) {
        const field = draggedItem.data.current?.field;
        if (field) {
            node = (
                <CanvasPreviewElement
                    field={field}
                    boxId={draggedItem.data.current?.boxId}
                    isActive={false}
                    hasErrors={false}
                />
            );
        }
    } else if (isBox) {
        const box = draggedItem.data.current?.box;
        if (box) {
            node = <DraggingMetaBox box={box} />;
        }
    }

    if (!node) return null;

    return (
        <DragOverlay zIndex={100002} className="acpt-dnd-overlay">
            {node}
        </DragOverlay>
    );
};

export default DragOverlayWrapper;

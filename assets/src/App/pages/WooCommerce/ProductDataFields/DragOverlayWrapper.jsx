import React, {useState} from 'react';
import {DragOverlay, useDndMonitor} from "@dnd-kit/core";
import TypedBadge from "../../../components/TypedBadge/index.jsx";
import DraggedCanvasElement from "./Canvas/DraggedCanvasElement.jsx";

/**
 * Ghost shown while dragging either a sidebar field-type badge or a canvas field card.
 * Uses only static data from the drag event — no RHF watches needed.
 */
const DragOverlayWrapper = () => {

    const [draggedItem, setDraggedItem] = useState(null);

    useDndMonitor({
        onDragStart:  (event) => setDraggedItem(event.active),
        onDragCancel: ()      => setDraggedItem(null),
        onDragEnd:    ()      => setDraggedItem(null),
    });

    if (!draggedItem) return null;

    const isSidebarElement = draggedItem.data.current?.fromSidebar;
    const isCanvasElement  = draggedItem.data.current?.fromCanvas;

    let node = null;

    if (isSidebarElement) {
        node = (
            <TypedBadge
                item={draggedItem.data.current.column}
                mode="overlay"
            />
        );
    } else if (isCanvasElement) {
        const field = draggedItem.data.current?.field;
        if (field) {
            // Ghost card — field already carries the live-value snapshot
            // captured at drag-start by CanvasElement (name/type merged).
            node = <DraggedCanvasElement field={field} />;
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

import React from 'react';
import PropTypes from 'prop-types';
import {closestCenter, DndContext} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import useDndSensors from "../../hooks/useDndSensors.jsx";
import {dndAnnouncementsShape} from "../../constants/propShapes.jsx";

const SortableList = ({items, onDragEnd, mode = 'vertical', announcements, children}) => {

    const sensors = useDndSensors({withPointerSensor: true, coordinateGetter: sortableKeyboardCoordinates});

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={mode === 'vertical' ? [restrictToVerticalAxis] : []}
            onDragEnd={onDragEnd}
            accessibility={{announcements, container: document.body}}
        >
            <SortableContext
                items={items}
                strategy={mode === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}
            >
                {children}
            </SortableContext>
        </DndContext>
    );
};

SortableList.propTypes = {
    items: PropTypes.array.isRequired,
    mode: PropTypes.oneOf([
        'vertical',
        'horizontal',
    ]),
    onDragEnd: PropTypes.func.isRequired,
    announcements: dndAnnouncementsShape,
};

export default SortableList;
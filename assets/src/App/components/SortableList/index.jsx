import React from 'react';
import PropTypes from 'prop-types';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";

const SortableList = ({items, onDragEnd, mode = 'vertical', children}) => {

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(MouseSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={mode === 'vertical' ? [restrictToVerticalAxis] : []}
            onDragEnd={onDragEnd}
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
};

export default SortableList;
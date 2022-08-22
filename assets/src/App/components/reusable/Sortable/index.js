import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";
import React from "react";
import {Icon} from "@iconify/react";

const DragHandle = SortableHandle(() => (
    <span className="acpt-sortable-hand">
        <Icon icon="bx:bx-dots-vertical-rounded" color="#7e9ebd" width="18px" />
    </span>
));

const SortableItem = SortableElement(({value}) => (
    <li className="acpt-sortable-li">
        {
            React.cloneElement(
                value,
            {dragHandle: <DragHandle />}
            )
        }
    </li>
));

export const SortableList = SortableContainer(({items}) => {
    return (
        <ul className="acpt-sortable-list">
            {items.map((value, index) => {
                return (
                    <SortableItem
                        key={`item-${value.props.position}`}
                        index={index}
                        value={value}
                    />
                )
            })}
        </ul>
    );
});
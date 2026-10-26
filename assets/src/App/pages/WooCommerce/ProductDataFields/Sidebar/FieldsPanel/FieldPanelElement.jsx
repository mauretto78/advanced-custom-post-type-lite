import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {useDraggable} from "@dnd-kit/core";
import TypedBadge from "../../../../../components/TypedBadge/index.jsx";
import {addField} from "../../../../../redux/reducers/productDataFieldsStateSlice";
import {createField} from "../../createField.js";

const FieldPanelElement = ({field}) => {

    const dispatch = useDispatch();

    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
        id: `sidebar-field-${field.value}`,
        data: {
            column: {
                type:  field.value,
                label: field.label,
            },
            fromSidebar: true
        }
    });

    const handleClick = () => {
        dispatch(addField({field: createField(field.value)}));
    };

    return (
        <div
            data-testid={`field-type-${field.value}`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            onKeyDown={e => {
                if(e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
            role="button"
            tabIndex={0}
        >
            <TypedBadge
                item={{type: field.value, label: field.label}}
                isDragging={isDragging}
            />
        </div>
    );
};

FieldPanelElement.propTypes = {
    field: PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired
};

export default FieldPanelElement;

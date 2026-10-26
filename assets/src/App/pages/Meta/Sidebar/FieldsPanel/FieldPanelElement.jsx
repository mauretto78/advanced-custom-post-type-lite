import React from 'react';
import PropTypes from 'prop-types';
import {useDraggable} from "@dnd-kit/core";
import {useDispatch, useSelector} from "react-redux";
import TypedBadge from "../../../../components/TypedBadge/index.jsx";
import {addBox, addField, setActiveElement} from "../../../../redux/reducers/metaStateSlice.jsx";
import {createBox, createField} from "../../../../utils/fields.jsx";

const FieldPanelElement = ({field}) => {

    const dispatch = useDispatch();
    const {group, activeBox} = useSelector(state => state.metaState);

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
        let boxes = group.boxes ?? [];
        let targetBoxId;
        let targetBox;

        if (boxes.length === 0) {
            const newBox = createBox(0);
            dispatch(addBox(newBox));
            targetBoxId = newBox.id;
            targetBox   = newBox;
        } else if (activeBox?.id) {
            targetBoxId = activeBox.id;
            targetBox   = boxes.find(b => b.id === targetBoxId);
        } else {
            targetBox   = boxes[boxes.length - 1];
            targetBoxId = targetBox.id;
        }

        const newField = createField(field.value, targetBoxId);
        dispatch(addField({boxId: targetBoxId, parentFieldId: null, parentBlockId: null, field: newField}));

        const boxIndex = boxes.findIndex(b => b.id === targetBoxId);
        const rootFieldCount = (targetBox?.fields ?? []).filter(f => !f.parentId && !f.blockId).length;

        dispatch(setActiveElement({
            id: newField.id,
            boxId: targetBoxId,
            boxIndex: boxIndex === -1 ? boxes.length : boxIndex,
            fieldIndex: rootFieldCount,
            parentFieldId: null,
            parentFieldIndex: null,
            parentBlockId: null,
        }));
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

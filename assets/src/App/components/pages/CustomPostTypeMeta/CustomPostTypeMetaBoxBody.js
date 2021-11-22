import React from 'react';
import arrayMove from "array-move";
import {SortableList} from "../../reusable/Sortable";
import {useDispatch, useSelector} from "react-redux";
import {setFields} from "../../../redux/actions/metaStateActions";

const CustomPostTypeMetaBoxBody = ({id}) => {

    // manage global state
    const dispatch = useDispatch();
    const {fields} = useSelector(state => state.metaStateReducer);
    const fieldsBlocks = fields.filter((field) => {
        return (field.props.boxId === id);
    });

    // sortable
    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(setFields(id, arrayMove(fieldsBlocks, oldIndex, newIndex)));
    };

    return (
        <div className="acpt-card__body">
            <div className="acpt-card__inner">
                {fieldsBlocks && fieldsBlocks.length > 0
                    ? (
                        <SortableList
                            items={fieldsBlocks}
                            onSortEnd={onSortEnd}
                            useDragHandle
                            lockAxis="y"
                            helperClass="dragging-helper-class"
                            disableAutoscroll={false}
                            useWindowAsScrollContainer={true}
                        />
                    )
                    : (
                        <div className="mb-0">
                            No fields already created. Create the first one now by clicking the button "Add field"!
                        </div>
                    )
                }
            </div>
        </div>
    )
};

export default CustomPostTypeMetaBoxBody;
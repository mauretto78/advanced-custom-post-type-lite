import React from 'react';
import PropTypes from 'prop-types';
import {useDroppable} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDispatch, useSelector} from "react-redux";
import CanvasBox from "./CanvasBox.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import {addBox, unsetActiveBox, unsetActiveElement} from "../../../redux/reducers/metaStateSlice.jsx";
import {styleVariants} from "../../../constants/styles.jsx";
import Button from "../../../components/Button/index.jsx";
import {createBox} from "../../../utils/fields.jsx";

const Canvas = ({groupId}) => {

    // manage global state
    const dispatch = useDispatch();

    const {group} = useSelector(state => state.metaState);
    const boxes   = group.boxes ?? [];

    const {setNodeRef, isOver} = useDroppable({
        id: 'canvas-drop-area',
        data: {isCanvas: true}
    });

    const handleAddBox = () => {
        dispatch(addBox(createBox(group.boxes ? group.boxes.length : 0)));
    };

    const handleCanvasClick = () => {
        dispatch(unsetActiveElement());
        dispatch(unsetActiveBox());
    };

    return (
        <div
            ref={setNodeRef}
            role="presentation"
            style={{position: 'relative', height: 'calc(100% - 92px)'}}
            className={`p-24 ${isOver ? 'canvas-hover' : ''}`}
            onClick={handleCanvasClick}
        >
            <div className="canvas-container flex-column s-24" data-testid="meta-canvas-container">
                {boxes.length === 0 && !isOver && (
                    <div className="flex-absolute-center py-48">
                        <div className="flex-column s-12">
                            <h4>{useTranslation("Add a meta box to get started")}</h4>
                            <Button
                                key="add-box"
                                type="button"
                                style={styleVariants.OUTLINED_PRIMARY}
                                size="sm"
                                icon="bx:plus"
                                onClick={e => { e.preventDefault(); handleAddBox(); }}
                            >
                                {useTranslation("Add meta box")}
                            </Button>
                        </div>
                    </div>
                )}
                <SortableContext items={boxes.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    {boxes.map((box, index) => (
                        <CanvasBox key={box.id} box={box} boxIndex={index} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

Canvas.propTypes = {
    groupId: PropTypes.string.isRequired,
};

export default Canvas;

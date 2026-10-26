import React from 'react';
import {useDroppable} from "@dnd-kit/core";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import CanvasElement from "./CanvasElement.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";

const Canvas = ({id}) => {

    const {fields} = useSelector(state => state.productDataFieldsState);

    const {setNodeRef, isOver} = useDroppable({
        id: 'canvas-drop-area',
        data: {isCanvas: true}
    });

    const placeholder = (
        <div className="flex-absolute-center">
            <h4>{useTranslation(isOver ? "Release" : "Drop fields here")}</h4>
        </div>
    );

    return (
        <div
            ref={setNodeRef}
            className={`p-24 ${fields.length === 0 && isOver ? 'canvas-hover' : ''}`}
            style={fields.length === 0 ? {position: "relative", height: "calc(100% - 92px)"} : {}}
        >
            {fields.length === 0 && placeholder}
            <div className="canvas-container flex-column p-12" data-testid="product-data-fields-canvas-container">
                {fields.length === 0 && !isOver && (
                    <div className="flex-absolute-center py-48">
                        <h4 className="color-gray">{useTranslation("Drag a field type from the sidebar to get started")}</h4>
                    </div>
                )}
                {fields.map((field, index) => (
                    <CanvasElement key={field.id} field={field} fieldIndex={index} />
                ))}
            </div>
        </div>
    );
};

Canvas.propTypes = {
    id: PropTypes.string,
};

export default Canvas;

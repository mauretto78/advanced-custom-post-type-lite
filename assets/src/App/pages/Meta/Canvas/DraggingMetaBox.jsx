import React from 'react';
import {Icon} from "@iconify/react";
import {grayColor} from "../../../utils/colors.jsx";
import CanvasPreviewElement from "./CanvasPreviewElement.jsx";
import useCanvasFieldWidth from "../../../hooks/useCanvasFieldWidth.jsx";
import PropTypes from 'prop-types';
import {metaBoxProps, metaFieldProps} from "../../../props/metaProps.js";
import {maxWidthClassName} from "../../../utils/ui.jsx";
import {savedIsClosed} from "../../../utils/localStorage.jsx";

// Own component (not inlined in the .map() below) so useCanvasFieldWidth --
// which itself calls other hooks -- is called once per field from its own
// component body, per the Rules of Hooks.
const DraggingMetaBoxField = ({field, boxId}) => {

    const width = useCanvasFieldWidth(field, boxId);

    return (
        // minWidth: 0 overrides the flex default of min-width: auto (= content
        // min-content size), which would otherwise stop this wrapper from ever
        // shrinking below its card content's width regardless of the % set here.
        // The real canvas gets this from .canvas-element's scoped SCSS rule, but
        // DragOverlay content renders outside that DOM subtree, so it must be inline.
        //
        // The visual gap between adjacent fields must NOT be a margin/gap on this
        // outer wrapper -- that counts toward the flex item's own footprint on the
        // row, so e.g. 33%+66%+margins can overflow and wrap. CanvasElement.jsx
        // gets its gap from p-12 *padding* on a child div one level in (wrapping
        // CanvasPreviewElement, not the width-styled element itself) -- padding on
        // a full-width block child shrinks the visible card without changing the
        // outer flex item's own width. Mirror that here.
        <div style={{width: `${width}%`, minWidth: 0}}>
            <div className="p-12">
                <CanvasPreviewElement
                    field={field}
                    boxId={boxId}
                    isActive={false}
                    hasErrors={false}
                />
            </div>
        </div>
    );
};

DraggingMetaBoxField.propTypes = {
    field: PropTypes.shape(metaFieldProps).isRequired,
    boxId: PropTypes.string.isRequired,
};

const DraggingMetaBox = ({box}) => {
    const rootFields = (box.fields ?? []).filter(f => !f.parentId && !f.blockId);
    const isExpanded = !savedIsClosed(box.id);

    return (
        <div className="canvas-box bg-white b-rounded with-shadow">
            <div className="canvas-box-header flex-between p-12 b-bottom-1 s-8">
                <div className="i-flex-center s-8">
                    <Icon icon="bx:dots-vertical-rounded" color={grayColor()} width={18} />
                    <strong className={`${maxWidthClassName(box.label)} text-bold color-black`}>{box.label}</strong>
                    <span className={`${maxWidthClassName(box.name)} color-medium-gray font-size-sm`}>{box.name}</span>
                </div>
            </div>
            {isExpanded ? (
                <div className="canvas-box-fields p-12 flex" style={{flexWrap: "wrap", minHeight: "80px"}}>
                    {rootFields.map((field) => (
                        <DraggingMetaBoxField key={field.id} field={field} boxId={box.id} />
                    ))}
                </div>
            ) : (
                <div className="p-24">
                    {rootFields.length} fields inside this box
                </div>
            )}
        </div>
    );
};

DraggingMetaBox.propTypes = {
    box: PropTypes.shape(metaBoxProps).isRequired,
};

export default DraggingMetaBox;
import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from "react-redux";
import {CSS} from "@dnd-kit/utilities";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {Icon} from "@iconify/react";
import {setActiveElement, unsetActiveElement} from "../../../redux/reducers/metaStateSlice.jsx";
import CanvasPreviewElement from "./CanvasPreviewElement.jsx";
import {useFormContext, useWatch} from "react-hook-form";
import {metaFieldFormId} from "../../../utils/fields.jsx";
import useWatchedFieldValue from "../../../hooks/useWatchedFieldValue.jsx";
import useCanvasFieldWidth from "../../../hooks/useCanvasFieldWidth.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import {metaFieldProps} from "../../../props/metaProps.js";
import MetaFieldActions from "../Sidebar/FieldSettingsPanel/Commons/MetaFieldActions.jsx";
import useCanvasElementSelection from "../../../hooks/useCanvasElementSelection.jsx";

const CanvasElement = ({field, boxId, boxIndex, fieldIndex, parentFieldId, parentFieldIndex, parentBlockId}) => {

    const dispatch = useDispatch();
    const {group, activeElement} = useSelector(state => state.metaState);
    const {formState: {errors}, control} = useFormContext();

    const fp = (key) => boxId ? metaFieldFormId(group?.boxes ?? [], boxId, field.id, key) : '_noop_';

    const name = useWatchedFieldValue(fp("name"), field.name);

    const watchedWidth = useCanvasFieldWidth(field, boxId);

    const isActive  = activeElement?.id === field.id;
    const hasErrors = !!errors?.boxes?.[boxIndex]?.fields?.[fieldIndex];

    const {setNodeRef, isDragging, transform, listeners, attributes} = useDraggable({
        id: field.id,
        data: {field, boxId, boxIndex, fieldIndex, parentFieldId, parentBlockId, fromCanvas: true}
    });

    const topHalf    = useDroppable({id: field.id+'-top',    data: {field, boxId, isTopHalfElement: true}});
    const bottomHalf = useDroppable({id: field.id+'-bottom', data: {field, boxId, isBottomHalfElement: true}});
    const leftHalf   = useDroppable({id: field.id+'-left',   data: {field, boxId, isLeftHalfElement: true}});
    const rightHalf  = useDroppable({id: field.id+'-right',  data: {field, boxId, isRightHalfElement: true}});

    const style = {
        transform: CSS.Translate.toString(transform),
        width: `${watchedWidth}%`,
    };

    const handleClick = () => {
        dispatch(setActiveElement({id: field.id, boxId, boxIndex, fieldIndex, parentFieldId, parentFieldIndex, parentBlockId}));
    };

    const {onSelectClick, onSelectFocus} = useCanvasElementSelection({
        isActive,
        onSelect: handleClick,
        preventDefault: true,
    });

    const handleDeselect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(unsetActiveElement());
    };

    if (isDragging) return null;

    return (
        <div
            ref={setNodeRef}
            id={field.id}
            style={style}
            data-testid={`canvas-field-${field.id}`}
            className={`canvas-element${isActive ? ' active' : ''}`}
        >
            {/* Drop-half overlays — scoped to preview row only */}
            <div style={{position: 'relative'}}>
                {topHalf.isOver    && <div className="top-half-hover-placeholder" />}
                {bottomHalf.isOver && <div className="bottom-half-hover-placeholder" />}
                {leftHalf.isOver   && <div className="left-half-hover-placeholder" />}
                {rightHalf.isOver  && <div className="right-half-hover-placeholder" />}
                <div ref={topHalf.setNodeRef}    className="top-half" />
                <div ref={bottomHalf.setNodeRef} className="bottom-half" />
                <div ref={leftHalf.setNodeRef}   className="left-half" />
                <div ref={rightHalf.setNodeRef}  className="right-half" />

                {isActive && (
                    <div className="actions tight flex s-8">
                        <small className="mr-24">{name}</small>
                        <button type="button" className="top-2 btn-reset" aria-label={useTranslation("Deselect")} onClick={handleDeselect}>
                            <Icon icon="bx:x" width={14} />
                        </button>
                        <MetaFieldActions
                            boxIndex={boxIndex}
                            fieldIndex={fieldIndex}
                            boxId={boxId}
                            field={field}
                            parentFieldIndex={parentFieldIndex}
                            parentFieldId={parentFieldId}
                            parentBlockId={parentBlockId}
                        />
                    </div>
                )}

                {/* #1279: this card is a plain <div>, NOT role="button" — a widget role here made it a
                    `nested-interactive` container (drag handle + inline rename + type badge + switches all
                    live inside). Selection now splits: onClick = pointer, onFocus = keyboard
                    selection-follows-focus. onFocus is in neither disabled rule's handler list. */}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                <div
                    className="p-12 canvas-select-target"
                    onClick={onSelectClick}
                    onFocus={onSelectFocus}
                >
                    <CanvasPreviewElement
                        field={field}
                        boxId={boxId}
                        boxIndex={boxIndex}
                        fieldIndex={fieldIndex}
                        isActive={isActive}
                        hasErrors={hasErrors}
                        listeners={listeners}
                        attributes={attributes}
                    />
                </div>
            </div>
        </div>
    );
};

CanvasElement.propTypes = {
    field:            PropTypes.shape(metaFieldProps).isRequired,
    boxId:            PropTypes.string.isRequired,
    boxIndex:         PropTypes.number.isRequired,
    fieldIndex:       PropTypes.number.isRequired,
    parentFieldId:    PropTypes.string,
    parentFieldIndex: PropTypes.string,
    parentBlockId:    PropTypes.string,
};

export default CanvasElement;

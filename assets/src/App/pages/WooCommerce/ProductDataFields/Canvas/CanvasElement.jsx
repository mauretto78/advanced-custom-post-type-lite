import React from 'react';
import PropTypes from 'prop-types';
import {productFieldProps} from "../../../../props/wooCommerceProps.js";
import {useDispatch, useSelector} from "react-redux";
import {CSS} from "@dnd-kit/utilities";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {Icon} from "@iconify/react";
import {whiteColor} from "../../../../utils/colors.jsx";
import {
    addField,
    setActiveElement,
    unsetActiveElement
} from "../../../../redux/reducers/productDataFieldsStateSlice";
import CanvasPreviewElement from "./CanvasPreviewElement.jsx";
import {useFormContext, useWatch} from "react-hook-form";
import InputHidden from "../../../../components/Forms/InputHidden.jsx";
import DeleteFieldModal from "../Modal/DeleteFieldModal.jsx";
import {cloneWCField} from "../../../../utils/cloners.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";
import useCanvasElementSelection, {INLINE_EDIT_GUARD} from "../../../../hooks/useCanvasElementSelection.jsx";

const CanvasElement = ({field, fieldIndex}) => {

    const dispatch = useDispatch();
    const {activeElement} = useSelector(state => state.productDataFieldsState);
    const {register, control: formControl, formState: {errors}} = useFormContext();

    const isActive  = activeElement?.id === field.id;
    const hasErrors = !!errors?.fields?.[fieldIndex];

    // Live values from RHF — captured here so the drag-overlay ghost can show
    // the correct edited state without needing useFormContext itself.
    const watchedName = useWatch({formControl, name: `fields.${fieldIndex}.name`});
    const watchedType = useWatch({formControl, name: `fields.${fieldIndex}.type`});
    const displayName = watchedName || field.name;

    // ── Draggable ─────────────────────────────────────────────────────────
    const {setNodeRef, isDragging, transform, listeners, attributes} = useDraggable({
        id:   field.id,
        data: {
            fromCanvas: true,
            // Snapshot live form values into drag data so DragOverlayWrapper
            // can render a correct ghost without any form-context dependency.
            field: {
                ...field,
                name: watchedName || field.name,
                type: watchedType || field.type,
            },
            fieldIndex,
        }
    });

    const style = {transform: CSS.Translate.toString(transform)};

    // ── Top / bottom half drop zones ──────────────────────────────────────
    const topHalf    = useDroppable({
        id:   `${field.id}-top`,
        data: {isTopHalfElement: true, field}
    });
    const bottomHalf = useDroppable({
        id:   `${field.id}-bottom`,
        data: {isBottomHalfElement: true, field}
    });

    // Handlers
    const handleClick = () => {
        dispatch(setActiveElement({field}));
    };

    const {onSelectClick, onSelectFocus} = useCanvasElementSelection({
        isActive,
        onSelect: handleClick,
        preventDefault: true,
        clickGuard: '.handle, ' + INLINE_EDIT_GUARD,
    });

    const handleDeselect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(unsetActiveElement());
    };

    const handleDuplicate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const duplicatedField = cloneWCField({
            ...field,
            name: watchedName || field.name,
            type: watchedType || field.type,
        });
        dispatch(addField({field: duplicatedField}));
    };

    // While dragging, return null — the DragOverlay renders the ghost
    if (isDragging) return null;

    return (
        <div
            ref={setNodeRef}
            id={field.id}
            style={style}
            data-testid={`canvas-field-${field.id}`}
            className={`canvas-element${isActive ? ' active' : ''}`}
        >
            {/* Hidden id field */}
            <InputHidden
                id={`fields.${fieldIndex}.id`}
                value={field.id}
                register={register}
            />

            {/* Drop-half overlays — scoped to the preview row only */}
            <div style={{position: 'relative'}}>
                {topHalf.isOver    && <div className="top-half-hover-placeholder" />}
                {bottomHalf.isOver && <div className="bottom-half-hover-placeholder" />}
                <div ref={topHalf.setNodeRef}    className="top-half" />
                <div ref={bottomHalf.setNodeRef} className="bottom-half" />

                {/* Active overlay: name + close + trash */}
                {isActive && (
                    <div className="actions tight flex s-8">
                        <small className="mr-24">{displayName}</small>
                        <button type="button" className="top-2 btn-reset" aria-label={useTranslation("Deselect")} onClick={handleDeselect}>
                            <Icon icon="bx:x" width={14} />
                        </button>
                        <button type="button" className="btn-reset" aria-label={useTranslation("Duplicate")} onClick={handleDuplicate}>
                            <Icon icon="bx:duplicate" width={14} />
                        </button>
                        <DeleteFieldModal
                            fieldId={field.id}
                            fieldIndex={fieldIndex}
                            trigger={
                                <button type="button" className="btn-reset delete-column-action" aria-label={useTranslation("Delete")}>
                                    <Icon icon="bx:trash" width={14} color={whiteColor()} />
                                </button>
                            }
                        />
                    </div>
                )}

                {/* Card body */}
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
    field:      PropTypes.shape(productFieldProps).isRequired,
    fieldIndex: PropTypes.number.isRequired,
};

export default CanvasElement;

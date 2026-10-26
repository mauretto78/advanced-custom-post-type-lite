import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {grayColor} from "../../utils/colors.jsx";
import {dndAttributesShape} from "../../constants/propShapes.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";

/**
 * Shared canvas card row used by every manager's CanvasPreviewElement.
 *
 * Layout: [drag handle?] [name + label + middleExtra] [typeSlot]
 *         [children — nested content below the row]
 *
 * Callers fill typeSlot and middleExtra with manager-specific nodes
 * (e.g. type badges, virtual badge, icon switches).
 *
 * The card is a CSS size container (_canvas.scss): when it is too narrow for
 * the whole row, middleExtra and then typeSlot are hidden by its real pixel
 * width, so a narrow field (e.g. a 50% field inside a repeater) never
 * overflows its border (#1376).
 */
const CanvasPreviewItem = ({
    icon,
    name,
    label,
    listeners,
    attributes,
    isActive,
    hasErrors,
    middleExtra,
    typeSlot,
    nameSlot,
    children,
}) => (
    <div className={`element canvas-preview-item b-rounded bg-white p-space-btn ${hasErrors ? 'with-danger-border' : isActive ? 'with-primary-border' : 'with-border'}`}>
        <div className="flex-column s-12">
            <div className="i-flex-center s-8 canvas-preview-item__row">
                {(listeners || attributes) && (
                    <span
                        className="cursor-move top-2 handle"
                        aria-label={name ? `${useTranslation("Drag to reorder")}: ${name}` : useTranslation("Drag to reorder")}
                        {...(attributes ?? {})}
                        {...(listeners ?? {})}
                    >
                        <Icon icon="bx:dots-vertical-rounded" color={grayColor()} width={18}/>
                    </span>
                )}
                <div className="i-flex-center s-8 canvas-preview-item__main">
                    {icon && <span className="mr-8">{icon}</span>}
                    {nameSlot ?? (
                        <strong className={`canvas-text-truncate ${hasErrors ? "color-danger" : "text-bold color-black"}`} title={name}>{name}</strong>
                    )}
                    {label && (
                        <span className={`canvas-text-truncate canvas-text-truncate--secondary ${hasErrors ? "color-danger" : "color-medium-gray"}`} title={label}>{label}</span>
                    )}
                    {middleExtra && <span className="i-flex-center canvas-preview-item__extra">{middleExtra}</span>}
                </div>
                {typeSlot && <span className="i-flex-center canvas-preview-item__type">{typeSlot}</span>}
            </div>
            {children}
        </div>
    </div>
);

CanvasPreviewItem.propTypes = {
    icon:        PropTypes.node,
    name:        PropTypes.string.isRequired,
    label:       PropTypes.string,
    listeners:   PropTypes.objectOf(PropTypes.func),
    attributes:  dndAttributesShape,
    isActive:    PropTypes.bool,
    hasErrors:   PropTypes.bool,
    middleExtra: PropTypes.node,
    typeSlot:    PropTypes.node,
    nameSlot:    PropTypes.node,
    children:    PropTypes.node,
};

export default CanvasPreviewItem;

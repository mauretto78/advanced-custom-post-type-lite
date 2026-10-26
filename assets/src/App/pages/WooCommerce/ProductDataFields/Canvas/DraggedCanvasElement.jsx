import React from 'react';
import PropTypes from 'prop-types';
import {productFieldProps} from "../../../../props/wooCommerceProps.js";
import CanvasPreviewItem from '../../../../components/CanvasLayout/CanvasPreviewItem.jsx';
import MetaFieldType from '../../../../components/MetaFieldType/index.jsx';

/**
 * Pure-presentational drag ghost rendered inside DragOverlay.
 *
 * Reads the live-value snapshot captured at drag-start by CanvasElement
 * (name / type merged into the drag data). No useFormContext or
 * useWatch needed — the overlay is a frozen snapshot, not a live card.
 */
const DraggedCanvasElement = ({field}) => (
    <CanvasPreviewItem
        name={field.name}
        isActive={false}
        hasErrors={false}
        typeSlot={
            <MetaFieldType
                fieldType={field.type}
                css="font-size-xs with-primary-border color-primary b-rounded py-4 px-8"
            />
        }
    />
);

DraggedCanvasElement.propTypes = {
    field: PropTypes.shape(productFieldProps).isRequired,
};

export default DraggedCanvasElement;

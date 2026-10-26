import React from 'react';
import PropTypes from 'prop-types';
import {productFieldProps} from "../../../../props/wooCommerceProps.js";
import {useFormContext, useWatch} from "react-hook-form";
import CanvasPreviewItem from "../../../../components/CanvasLayout/CanvasPreviewItem.jsx";
import CanvasInlineFieldName from "./CanvasInlineFieldName.jsx";
import CanvasInlineFieldType from "./CanvasInlineFieldType.jsx";

/**
 * Card body rendered inside CanvasElement.
 *
 * Layout (via CanvasPreviewItem):
 *   [drag handle] [name]          [type badge]
 *   ←──────────── left ──────────────────  right ──→
 *
 * WC product data fields have no separate "label" — only name + type.
 * Both name and type are inline-editable directly on the canvas row.
 */
const CanvasPreviewElement = ({field, fieldIndex, isActive, hasErrors, listeners, attributes}) => {

    const {control: formControl} = useFormContext();

    const watchedName = useWatch({formControl, name: `fields.${fieldIndex}.name`});
    const watchedType = useWatch({formControl, name: `fields.${fieldIndex}.type`});

    const name = watchedName || field.name;
    const type = watchedType || field.type;

    return (
        <CanvasPreviewItem
            name={name}
            isActive={isActive}
            hasErrors={hasErrors}
            listeners={listeners}
            attributes={attributes}
            nameSlot={
                <CanvasInlineFieldName fieldIndex={fieldIndex} name={name} hasErrors={hasErrors} />
            }
            typeSlot={
                <CanvasInlineFieldType field={{...field, type}} fieldIndex={fieldIndex} />
            }
        />
    );
};

CanvasPreviewElement.propTypes = {
    field:      PropTypes.shape(productFieldProps).isRequired,
    fieldIndex: PropTypes.number.isRequired,
    isActive:   PropTypes.bool,
    hasErrors:  PropTypes.bool,
    listeners:  PropTypes.object,
    attributes: PropTypes.object,
};

export default CanvasPreviewElement;

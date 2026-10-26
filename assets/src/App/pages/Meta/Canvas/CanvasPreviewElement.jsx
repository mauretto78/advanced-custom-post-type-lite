import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {useFormContext, useWatch} from "react-hook-form";
import CanvasPreviewItem from "../../../components/CanvasLayout/CanvasPreviewItem.jsx";
import {metaFieldFormId} from "../../../utils/fields.jsx";
import useWatchedFieldValue from "../../../hooks/useWatchedFieldValue.jsx";
import useCanvasFieldWidth from "../../../hooks/useCanvasFieldWidth.jsx";
import CanvasInlineFieldName from "./CanvasInlineFieldName.jsx";
import CanvasInlineFieldType from "./CanvasInlineFieldType.jsx";
import CanvasInlineFieldSwitches from "./CanvasInlineFieldSwitches.jsx";
import {metaFieldProps} from "../../../props/metaProps.js";

const NESTABLE_TYPES = [];

// Below this width %, the row (name + up to 4 switch toggles + type badge)
// doesn't have room for the switches -- hide them rather than let them
// overflow/clip. Not a functionality loss: the same toggles are always
// available in the sidebar's Advanced tab for the selected field.
const COMPACT_WIDTH_THRESHOLD = 35;

// Below this (lower) width %, even name + type badge no longer both fit --
// the type badge doesn't shrink (unlike the name, which can truncate down
// to nothing), so it was starving the name of all its space. Drop the type
// badge too at this point, so the name gets the full row and stays legible.
const SUPER_COMPACT_WIDTH_THRESHOLD = 20;

const CanvasPreviewElement = ({field, boxId, boxIndex, fieldIndex, isActive, hasErrors, listeners, attributes}) => {

    const {group} = useSelector(state => state.metaState);
    const {control} = useFormContext();

    const fp = (key) => boxId ? metaFieldFormId(group?.boxes ?? [], boxId, field.id, key) : '_noop_';

    const name  = useWatchedFieldValue(fp("name"), field.name);
    const label = useWatchedFieldValue(fp("label"), field.label);

    const watchedShowInArchive     = useWatch({control, name: fp("showInArchive")});
    const watchedFilterableInAdmin = useWatch({control, name: fp("filterableInAdmin")});
    const watchedQuickEdit         = useWatch({control, name: fp("quickEdit")});
    const watchedIsRequired        = useWatch({control, name: fp("isRequired")});

    const showInArchive     = typeof watchedShowInArchive     === "boolean" ? watchedShowInArchive     : (field.showInArchive     ?? false);
    const filterableInAdmin = typeof watchedFilterableInAdmin === "boolean" ? watchedFilterableInAdmin : (field.filterableInAdmin ?? false);
    const quickEdit         = typeof watchedQuickEdit         === "boolean" ? watchedQuickEdit         : (field.quickEdit         ?? false);
    const isRequired        = typeof watchedIsRequired        === "boolean" ? watchedIsRequired        : (field.isRequired        ?? false);

    const isNestable = NESTABLE_TYPES.includes(field.type);
    const isChildField = !!field.parentId || !!field.blockId;

    const width = useCanvasFieldWidth(field, boxId);
    const isCompact = width <= COMPACT_WIDTH_THRESHOLD;
    const isSuperCompact = width <= SUPER_COMPACT_WIDTH_THRESHOLD;

    return (
        (<CanvasPreviewItem
            name={name}
            isActive={isActive}
            hasErrors={hasErrors}
            listeners={listeners}
            attributes={attributes}
            // In super-compact mode there's no room for the rename affordance
            // (pencil icon, tooltip trigger) alongside the name text itself --
            // fall back to CanvasPreviewItem's own plain, non-editable <strong>{name}</strong>
            // (rendered whenever nameSlot is null) rather than cramming the
            // interactive control in. Still renamable via the sidebar.
            nameSlot={
                !isSuperCompact ? (
                    <CanvasInlineFieldName
                        name={name}
                        label={label}
                        hasErrors={hasErrors}
                        formId={fp}
                        boxIndex={boxIndex}
                        fieldIndex={fieldIndex}
                        field={field}
                    />
                ) : null
            }
            middleExtra={
                !isNestable && !isCompact ? (
                    <CanvasInlineFieldSwitches
                        formId={fp}
                        showInArchive={showInArchive}
                        filterableInAdmin={filterableInAdmin}
                        quickEdit={quickEdit}
                        isRequired={isRequired}
                        isChildField={isChildField}
                        fieldType={field.type}
                    />
                ) : null
            }
            typeSlot={
                !isSuperCompact ? (
                    <CanvasInlineFieldType
                        field={field}
                        boxId={boxId}
                        formId={fp}
                    />
                ) : null
            }
        >


        </CanvasPreviewItem>)
    );
};

CanvasPreviewElement.propTypes = {
    field:      PropTypes.shape(metaFieldProps).isRequired,
    boxId:      PropTypes.string,
    boxIndex:   PropTypes.number,
    fieldIndex: PropTypes.number,
    isActive:   PropTypes.bool,
    hasErrors:  PropTypes.bool,
    listeners:  PropTypes.object,
    attributes: PropTypes.object,
};

export default CanvasPreviewElement;

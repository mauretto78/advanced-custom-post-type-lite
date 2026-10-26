import PropTypes from "prop-types";
import {metaTypes} from "../constants/metaTypes.jsx";

// Shared shape fragments for the Meta group/field editor domain
// (assets/src/App/pages/Meta/**). Field lists validated against each PHP
// model's jsonSerialize() output (the real wire shape sent to the React
// app), not the export-only arrayRepresentation() used by
// ExportMetaCodeStrings.php.
//
// Declaration order matters: leaf shapes with no forward dependencies come
// first so later shapes (metaFieldProps, metaBoxProps, metaGroupProps) can
// reference them -- ES `const` bindings sit in a temporal dead zone until
// their own declaration runs, so referencing a not-yet-declared shape throws
// "Cannot access '...' before initialization" at module load time.

export const advancedOptionProps = {
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array, PropTypes.object]).isRequired,
};

export const optionProps = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array, PropTypes.object]).isRequired,
    sort: PropTypes.number,
    isDefault: PropTypes.bool,
};

export const belongProps = {
    id: PropTypes.string.isRequired,
    belongsTo: PropTypes.oneOf([
        metaTypes.COMMENT,
        metaTypes.CUSTOM_POST_TYPE,
        metaTypes.TAXONOMY,
        metaTypes.MEDIA,
        metaTypes.USER,
        'PARENT_POST_ID',
        'POST_ID',
        'POST_TEMPLATE',
        'POST_FORMAT',
        'POST_TAX',
        'POST_CAT',
        'TERM_ID',
        'USER_ID'
    ]),
    // BelongModel::setOperator() only ever allows these five -- narrower than
    // the richer Operator::ALLOWED_VALUES used by visibilityConditionProps.
    operator: PropTypes.oneOf(['', '=', '!=', 'IN', 'NOT_IN']),
    find: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    logic: PropTypes.oneOf(['', 'AND', 'OR']),
    sort: PropTypes.number,
};

export const metaFieldProps = {
    id: PropTypes.string.isRequired,
    boxId: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    // optional, not required: DragOverlayWrapper.jsx renders CanvasPreviewElement
    // with the raw dnd-kit active.data.current.field payload during a drag, which
    // legitimately carries only {id, parentId, blockId} -- and
    // MetaFieldDefaultValue/index.jsx explicitly guards `if(!field.type) return null`,
    // confirming a typeless field is an anticipated real state, not just test noise.
    type: PropTypes.string,
    // Computed by MetaFieldModel::isBindable() (PHP), not user-settable --
    // whether this field's type can be used in a Gutenberg block binding at
    // all (see BINDABLE_FIELD_TYPES). Drives whether AdvancedTab's "Allow in
    // block bindings" toggle is shown.
    bindable: PropTypes.bool,
    description: PropTypes.string,
    parentId: PropTypes.string,
    blockId: PropTypes.string,
    groupId: PropTypes.string,
    isRequired: PropTypes.bool,
    isSaved: PropTypes.bool,
    showInArchive: PropTypes.bool,
    filterableInAdmin: PropTypes.bool,
    quickEdit: PropTypes.bool,
    sort: PropTypes.number,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array, PropTypes.object]),
    advancedOptions: PropTypes.arrayOf(PropTypes.shape(advancedOptionProps)),
    validationRules: PropTypes.array,
    visibilityConditions: PropTypes.array,
    permissions: PropTypes.array,
    options: PropTypes.arrayOf(PropTypes.shape(optionProps)),
    relations: PropTypes.array,
    // recursive nesting -- each `children` entry is itself a metaFieldProps-
    // shaped object (repeater/flexible children) and each `blocks` entry is a
    // metaBlockProps-shaped object (flexible-content blocks). Kept as plain
    // arrays to avoid a circular PropTypes.shape reference: `children` is a
    // direct self-reference (can't be resolved by reordering), and `blocks`
    // would require metaBlockProps to be declared before metaFieldProps --
    // but metaBlockProps.fields itself needs metaFieldProps, so the cycle has
    // to break on one side or the other. metaBlockProps.fields is shaped
    // instead (see below), since it's the less-central, narrower shape.
    children: PropTypes.array,
    blocks: PropTypes.array,
};

export const metaBlockProps = {
    id: PropTypes.string.isRequired,
    groupId: PropTypes.string,
    boxId: PropTypes.string,
    fieldId: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape(metaFieldProps)),
    sort: PropTypes.number,
};

export const metaBoxProps = {
    id: PropTypes.string.isRequired,
    groupId: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    UIName: PropTypes.string,
    sort: PropTypes.number,
    // real/received data is a plain object (MetaBoxModel::getSettings():
    // array<string,mixed>, e.g. {context, priority, hide_title, hide_toggle} --
    // confirmed by MetaBoxSettings.jsx's `box.settings?.context` access). The
    // `boxes.${index}.settings[0].${value}` path string seen elsewhere is only
    // a react-hook-form *outbound* field-path convention (unwrapped
    // server-side by SaveMetaGroupCommand.php), not the shape of the received
    // `box` prop. oneOfType tolerates the json_encode([]) empty-settings edge case.
    settings: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    visibilityConditions: PropTypes.array,
    fields: PropTypes.arrayOf(PropTypes.shape(metaFieldProps)),
};

export const metaGroupProps = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    display: PropTypes.oneOf(['standard', 'accordion', 'verticalTabs', 'horizontalTabs']),
    context: PropTypes.string,
    priority: PropTypes.string,
    isCCTCopy: PropTypes.bool,
    UIName: PropTypes.string,
    fieldsCount: PropTypes.number,
    belongs: PropTypes.arrayOf(PropTypes.shape(belongProps)),
    boxes: PropTypes.arrayOf(PropTypes.shape(metaBoxProps)),
};

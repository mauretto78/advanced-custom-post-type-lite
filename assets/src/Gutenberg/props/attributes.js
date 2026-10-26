import PropTypes from "prop-types";

// A WP `BorderControl` value (@wordpress/components) -- one unified border
// definition, as set by ACPTBasicBlock/InspectorControls/LinkControls.jsx's
// <BorderControl onChange={(border) => setAttributes({..., border})} />.
const borderShape = PropTypes.shape({
    color: PropTypes.string,
    style: PropTypes.string,
    width: PropTypes.string,
});

// A WP `BoxControl` value (@wordpress/components) -- per-side CSS lengths,
// used for both borderRadius and padding (LinkControls' <BoxControl values={...}/>).
const boxShape = PropTypes.shape({
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
});

/**
 * The union of every attribute registered across the three ACPT field blocks
 * (advanced-custom-post-type/basic-block, repeater-block, relational-block --
 * see their `attributes: {...}` schemas in index.jsx's registerBlocks()).
 * Each block only ever passes its own subset through; PropTypes.shape doesn't
 * warn on keys that are simply absent, so one shared shape covering the full
 * union is safe to reuse across all three edit() components' `attributes` prop.
 */
export const attributesProps = {
    align: PropTypes.string,
    audioStyle: PropTypes.string,
    backgroundColor: PropTypes.string,
    block: PropTypes.string, // repeater-block only -- JSON-stringified block definition
    border: borderShape,
    borderRadius: boxShape,
    carouselSpeed: PropTypes.number,
    color: PropTypes.string,
    customHeight: PropTypes.number,
    dateFormat: PropTypes.string,
    display: PropTypes.string,
    elements: PropTypes.number,
    field: PropTypes.string, // JSON-stringified field definition
    fontSize: PropTypes.string,
    gap: PropTypes.number,
    gradient: PropTypes.string,
    height: PropTypes.string,
    lightbox: PropTypes.bool,
    padding: boxShape,
    phoneFormat: PropTypes.string,
    postId: PropTypes.number,
    prefix: PropTypes.string,
    previewPostId: PropTypes.number, // relational-block only
    sort: PropTypes.string,
    style: PropTypes.object,
    suffix: PropTypes.string,
    target: PropTypes.string,
    // relational-block registers this as `object` (default null), repeater-block
    // as `string` (default '') -- same attribute name, genuinely different type
    // depending on which block it's read from.
    template: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    templateType: PropTypes.string, // relational-block only
    textColor: PropTypes.string,
    timeFormat: PropTypes.string,
    uniformHeight: PropTypes.bool,
    uomFormat: PropTypes.string,
    uomFormatDecimalPoints: PropTypes.string,
    uomFormatDecimalSeparator: PropTypes.string,
    uomFormatThousandsSeparator: PropTypes.string,
    uomPosition: PropTypes.string,
    value: PropTypes.array, // repeater-block only -- fallback content when no inner blocks
    width: PropTypes.string,
    zoom: PropTypes.number,
};

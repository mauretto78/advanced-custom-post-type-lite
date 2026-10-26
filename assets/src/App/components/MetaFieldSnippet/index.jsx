import { useState } from 'react';
import PropTypes from 'prop-types';
import {metaTypes} from "../../constants/metaTypes.jsx";
import CopyElement from "../CopyElement/index.jsx";
import IconRadioGroup from "../Forms/IconRadioGroup.jsx";
import useTranslation from "../../hooks/useTranslation.jsx";

const MODE_META = {
    base:      {icon: 'bxl:wordpress', label: () => useTranslation("WordPress native snippet")},
    acpt:      {icon: 'bx:customize',  label: () => useTranslation("ACPT function snippet")},
    shortcode: {icon: 'bx:code-alt',   label: () => useTranslation("Shortcode")},
};

const MetaFieldSnippet = ({box, field, parentField, contexts = [], isCct = false, index, blockName, blockIndex}) => {

    // Hook first, unconditionally -- box/field can be transiently falsy on an
    // already-mounted instance (watched form values), and React requires a
    // stable hook count across renders.
    const [mode, setMode] = useState(null);

    if(!box || box === '' || typeof box !== 'string') return null;
    if(!field || field === '' || typeof field !== 'string') return null;

    const isChildField = typeof parentField === 'string' && parentField !== '';
    const isBlockChildField = isChildField && typeof blockName === 'string' && blockName !== '';

    // Base meta key. Option pages prefix the page slug; everything else is `box_field`.
    const baseSlug = (context) => {
        const prefix = "";
        return prefix + box + '_' + field;
    };

    const idArg = (context) => {
        switch (context.belongsTo) {
        case metaTypes.TAXONOMY:    return `'term_id' => 123`;
        case metaTypes.USER:        return `'user_id' => 123`;
        case metaTypes.COMMENT:     return `'comment_id' => 123`;
        // CUSTOM_POST_TYPE, MEDIA
        default:                    return `'post_id' => 123`;
        }
    };

    const nativeFunc = (context) => {
        if(isCct) return null; // CCT values are not stored in the WP meta tables
        switch (context.belongsTo) {
        case metaTypes.TAXONOMY:    return `get_term_meta(123, '${baseSlug(context)}', true)`;
        case metaTypes.USER:        return `get_user_meta(123, '${baseSlug(context)}', true)`;
        case metaTypes.COMMENT:     return `get_comment_meta(123, '${baseSlug(context)}', true)`;
        // CUSTOM_POST_TYPE, MEDIA
        default:                    return `get_post_meta(123, '${baseSlug(context)}', true)`;
        }
    };

    const acptFunc = (context) => {

        if(isBlockChildField){
            const idx = (index !== undefined && index !== null && index !== '') ? index : 0;
            const blkIdx = (blockIndex !== undefined && blockIndex !== null && blockIndex !== '') ? blockIndex : 0;
            return `get_acpt_block_child_field([${idArg(context)}, 'box_name' => '${box}', 'field_name' => '${field}', 'parent_field_name' => '${parentField}', 'block_name' => '${blockName}', 'block_index' => '${blkIdx}', 'index' => '${idx}'])`;
        }

        if(isChildField){
            const idx = (index !== undefined && index !== null && index !== '') ? index : 0;
            return `get_acpt_child_field([${idArg(context)}, 'box_name' => '${box}', 'field_name' => '${field}', 'parent_field_name' => '${parentField}', 'index' => '${idx}'])`;
        }

        if(context.belongsTo === metaTypes.MEDIA){
            // get_acpt_field() has no media/attachment id key — the only documented
            // ACPT path for a flat media field is the [acpt_media] shortcode.
            return `do_shortcode('[acpt_media pid="123" box="${box}" field="${field}"]')`;
        }

        return `get_acpt_field([${idArg(context)}, 'box_name' => '${box}', 'field_name' => '${field}'])`;
    };

    // Raw shortcode form — only offered for flat (non-child) fields, so no
    // parent/index/block_* handling. Each WP-entity context has its own registered
    // tag (there is no universal [acpt_field]); pointing `box` at a CCT table slug
    // is fine — AbstractACPTShortcode::renderShortcode() routes it to renderCctField().
    const shortcodeFunc = (context) => {
        switch (context.belongsTo) {
        case metaTypes.TAXONOMY:    return `[acpt_tax tid="123" box="${box}" field="${field}"]`;
        case metaTypes.USER:        return `[acpt_user uid="123" box="${box}" field="${field}"]`;
        case metaTypes.COMMENT:     return `[acpt_comm cid="123" box="${box}" field="${field}"]`;
        case metaTypes.MEDIA:       return `[acpt_media pid="123" box="${box}" field="${field}"]`;
        // CUSTOM_POST_TYPE
        default:                    return `[acpt pid="123" box="${box}" field="${field}"]`;
        }
    };

    const contextLabel = (context) => {
        switch (context.belongsTo) {
        case metaTypes.TAXONOMY:    return useTranslation("Term");
        case metaTypes.USER:        return useTranslation("User");
        case metaTypes.COMMENT:     return useTranslation("Comment");
        case metaTypes.MEDIA:       return useTranslation("Media");
        default:                    return useTranslation("Post");
        }
    };

    const snippetBuilders = {base: nativeFunc, acpt: acptFunc, shortcode: shortcodeFunc};

    // Which format modes apply. Child fields only have get_acpt_child_field (no
    // switch); CCT has no WP-native form; flat meta fields have all three.
    const modeKeys = isChildField
        ? ['acpt']
        : (isCct ? ['acpt', 'shortcode'] : ['base', 'acpt', 'shortcode']);

    const effectiveMode = modeKeys.includes(mode) ? mode : modeKeys[0];

    // No location rule resolves to a snippet context.
    if(contexts.length === 0){
        if(!isCct){
            return null;
        }
        return (
            <div className="flex-column s-4 w-100">
                <CopyElement
                    text={`GET /wp-json/acpt/v1/${box}/{id}`}
                    size="sm"
                    testId="meta-snippet-selector"
                />
                <span className="color-medium-gray font-size-xs">
                    {useTranslation('Requires "Expose via REST API" on the table.')}
                </span>
            </div>
        );
    }

    return (
        <div className="flex-column s-8 w-100">
            {modeKeys.length > 1 && (
                <IconRadioGroup
                    name={`meta-snippet-mode-${box}-${field}`}
                    ariaLabel={useTranslation("Snippet format")}
                    value={effectiveMode}
                    onChange={setMode}
                    testId="meta-snippet-mode-switch"
                    options={modeKeys.map(key => ({
                        value: key,
                        icon: MODE_META[key].icon,
                        label: MODE_META[key].label(),
                    }))}
                />
            )}
            {contexts.map(context => (
                <div key={context.belongsTo + context.find} className="i-flex-center s-8 w-100">
                    {contexts.length > 1 && (
                        <span className="color-medium-gray font-size-xs">
                            {contextLabel(context)}
                        </span>
                    )}
                    <CopyElement
                        text={snippetBuilders[effectiveMode](context)}
                        size="sm"
                        testId={contexts.length > 1 ? `meta-snippet-selector-${context.belongsTo}` : 'meta-snippet-selector'}
                    />
                </div>
            ))}
        </div>
    );
};

MetaFieldSnippet.propTypes = {
    box: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    parentField: PropTypes.string,
    contexts: PropTypes.arrayOf(PropTypes.shape({
        belongsTo: PropTypes.string.isRequired,
        find: PropTypes.string,
    })),
    isCct: PropTypes.bool,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    blockName: PropTypes.string,
    blockIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default MetaFieldSnippet;

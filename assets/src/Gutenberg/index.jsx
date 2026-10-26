import React from "react";
import {isLodash} from "./tools/isLodash";
import "./scss/block.scss";
import ACPTBasicBlock from "./components/ACPTBasicBlock";
import {fetchMeta} from "./data/metaFields";
import {fetchGlobals} from "./data/globals";
import {logoIcon} from "./icons/logoIcon";
import {fieldTypes} from "../App/constants/fields";

const { __ } = wp.i18n;
const { registerBlockType, registerBlockBindingsSource } = wp.blocks;
const { useBlockProps, useInnerBlocksProps, InnerBlocks } = wp.blockEditor;
const ServerSideRender = wp.serverSideRender;

if ( isLodash() ) {
    _.noConflict();
}

fetchGlobals();

/**
 * The "--Select--" entry heading every block's field picker
 * @return {{label: *, value: null, group: string}}
 */
const fieldPlaceholder = () => ({
    value: null,
    label: __("--Select---", 'acpt'),
    group: 'all'
});

/**
 * Fetch meta fields
 * @return {Promise<[{label: *, value: null, group: string}]>}
 */
const fetchFields = async () => {
    let metaFields = [fieldPlaceholder()];

    // awaited: the caller registers the bindings source and computes the (cached)
    // bindable field list as soon as this resolves -- resolving before the fields
    // were loaded cached an empty list and hid the Attributes panel (#1357)
    await fetchMeta().then(groups => {
        groups.map((group) => {
            const records = group.records;
            const belongsTo = group.belongsTo;
            const find = group.find ? group.find : null;
            const findLabel = group.findLabel || find;

            /**
             *
             * @param groupName
             * @param box
             * @param field
             * @param parent
             * @return {{field: *, children: [], find: null, parent_field: (null|null), box: *, label: string, type: *, value: string, belongsTo: *, group: *}}
             */
            const formatField = (groupName, box, field, parent = null) => {
                let blocks = [];
                let children = [];

                field.blocks && field.blocks.map((b) => {
                    let block = {
                        name: b.name,
                        fields: []
                    };

                    b.fields && b.fields.map((c) => {
                        block.fields.push(formatField(groupName, box, c, field));
                    });

                    blocks.push(block);
                });

                field.children && field.children.map((c) => {
                    children.push(formatField(groupName, box, c, field));
                });

                return {
                    group: groupName,
                    value: find +'_'+field.db_name,
                    label: '['+findLabel+'] - ' + field.ui_name,
                    box: box.name,
                    field: field.name,
                    type: field.type,
                    belongsTo: belongsTo,
                    find: find,
                    advanced_options: field.advancedOptions,
                    relations: field.relations.length > 0 ? {
                        relationship: field.relations[0].relationship,
                        from: field.relations[0].from,
                        to: field.relations[0].to,
                    } : null,
                    parent_field: parent ? parent.name : null,
                    blocks: blocks,
                    children: children
                };
            };

            if(records.length > 0){
                records.map((record) => {
                    if(record.boxes.length > 0){
                        record.boxes.map((box) => {
                            if(box.fields){
                                box.fields
                                    .map((field) => {
                                        metaFields.push({
                                            label: '['+findLabel+'] - ' + field.ui_name,
                                            group: field.group,
                                            value: JSON.stringify(formatField(record.name, box, field))
                                        });
                                    });
                            }
                        });
                    }
                });
            }
        });
    }).catch(error => console.error(error));

    return metaFields;
};

/**
 * Register blocks
 * @param fields
 */
const registerBlocks = (fields) => {
    // set document.metaFields
    document.metaFields = fields;

    // update category logo
    wp.blocks.updateCategory( 'acpt-lite-blocks', { icon: logoIcon } );

    // relational and repeater fields are not part of ACPT Lite

    /**
     * Basic fields block
     */
    registerBlockType( 'advanced-custom-post-type/basic-block', {
        apiVersion: 3,
        title: __('ACPT Basic fields', 'acpt'),
        description: __( 'Include an ACPT basic field.', 'acpt'),
        keywords: [
            "acpt",
            "meta field"
        ],
        icon: 'block-default',
        category: 'acpt-lite-blocks',
        textdomain: "acpt-lite",
        usesContext: [ 'postId' ],
        supports: {
            color: {
                gradients: true,
            },
            typography: {
                fontSize: true
            },
            spacing: {
                padding: true,
                margin: true,
            }
        },
        attributes: {
            postId: {
                type: 'integer',
                default: 99999999999999999
            },
            field: {
                type: 'string',
                default: null
            },
            gradient: {
                type: 'string',
                default: null
            },
            backgroundColor: {
                type: 'string',
                default: null
            },
            prefix: {
                type: 'string',
                default: null
            },
            suffix: {
                type: 'string',
                default: null
            },
            textColor: {
                type: 'string',
                default: null
            },
            style: {
                type: 'object',
                default: {}
            },
            audioStyle: {
                type: 'string',
                default: null
            },
            display: {
                type: 'string',
                default: null
            },
            color: {
                type: 'string',
                default: null
            },
            fontSize: {
                type: 'string',
                default: null
            },
            target: {
                type: 'string',
                default: null
            },
            width: {
                type: 'string',
                default: null
            },
            height: {
                type: 'string',
                default: null
            },
            uomFormatDecimalPoints: {
                type: 'string',
                default: null
            },
            uomFormatDecimalSeparator: {
                type: 'string',
                default: null
            },
            uomFormatThousandsSeparator: {
                type: 'string',
                default: null
            },
            uomFormat: {
                type: 'string',
                default: null
            },
            uomPosition: {
                type: 'string',
                default: null
            },
            phoneFormat: {
                type: 'string',
                default: null
            },
            dateFormat: {
                type: 'string',
                default: null
            },
            timeFormat: {
                type: 'string',
                default: null
            },
            sort: {
                type: 'string',
                default: null
            },
            align: {
                type: 'string',
                default: 'left'
            },
            zoom: {
                type: 'integer',
                default: 14
            },
            gap: {
                type: 'integer',
                default: 20
            },
            elements: {
                type: 'integer',
                default: 3
            },
            uniformHeight: {
                type: 'bool',
                default: false
            },
            customHeight: {
                type: 'integer',
                default: 250
            },
            lightbox: {
                type: 'bool',
                default: false
            },
            carouselSpeed: {
                type: 'integer',
                default: 5000
            },
            border: {
                type: 'object',
                default: {}
            },
            borderRadius: {
                type: 'object',
                default: {}
            },
            padding: {
                type: 'object',
                default: {}
            }
        },
        edit: ACPTBasicBlock,
        save: ( props ) => {
            const blockProps = useBlockProps.save();

            return (
                <div {...blockProps }>
                    {props.attributes.content}
                </div>
            );
        },
    } );
};

// Register the block types right away: the editor parses the post content as soon as
// it starts, and a block whose type is registered after that loads as unsupported
// (core/missing). The blocks only read the field list when their inspector renders.
registerBlocks([fieldPlaceholder()]);

fetchFields().then(metaFields => {
    document.metaFields = metaFields;

});

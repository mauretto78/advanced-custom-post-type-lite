import React from "react";
import {isLodash} from "./tools/isLodash";
import "./scss/block.scss";
import ACPTBasicBlock from "./components/ACPTBasicBlock";
import {fetchMeta} from "./data/metaFields";
import {fetchGlobals} from "./data/globals";
import {logoIcon} from "./icons/logoIcon";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useBlockProps, InnerBlocks } = wp.blockEditor;

if ( isLodash() ) {
    _.noConflict();
}

fetchGlobals();

/**
 * Fetch meta fields
 * @return {Promise<[{label: *, value: null, group: string}]>}
 */
const fetchFields = async () => {

    let metaFields = [{
        value: null,
        label: __("--Select---", 'acpt'),
        group: 'all'
    }];

    fetchMeta().then(groups => {

        groups.map((group) => {

            const records = group.records;
            const belongsTo = group.belongsTo;
            const find = group.find ? group.find : null;

            /**
             *
             * @param groupName
             * @param box
             * @param field
             * @param parent
             * @return {{field: *, children: [], find: null, parent_field: (null|null), box: *, label: string, type: *, value: string, belongsTo: *, group: *}}
             */
            const formatField = (groupName, box, field, parent = null) => {

                return {
                    group: groupName,
                    value: find +'_'+field.db_name,
                    label: '['+find+'] - ' + field.ui_name,
                    box: box.name,
                    field: field.name,
                    type: field.type,
                    belongsTo: belongsTo,
                    find: find,
                    relations: null,
                    parent_field: null,
                    blocks: [],
                    children: []
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
                                            label: '['+find+'] - ' + field.ui_name,
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
    });

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
    wp.blocks.updateCategory( 'advanced-custom-post-type-blocks', { icon: logoIcon } );

    /**
     * Basic fields block
     */
    registerBlockType( 'advanced-custom-post-type/basic-block', {
        apiVersion: 3,
        title: __('ACPT Basic fields', 'acpt'),
        description: __( 'Include an ACPT basic field.', 'acpt'),
        icon: 'block-default',
        category: 'advanced-custom-post-type-blocks',
        textdomain: "advanced-custom-post-type",
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
            textColor: {
                type: 'string',
                default: null
            },
            style: {
                type: 'object',
                default: {}
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
            dateFormat: {
                type: 'string',
                default: null
            },
            timeFormat: {
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

fetchFields().then(metaFields => {
    if(metaFields.length > 0) {
        registerBlocks(metaFields);
    }
});






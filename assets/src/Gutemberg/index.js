import React from "react";
import {isLodash} from "./tools/isLodash";
import "./scss/block.scss";
import ACPTBasicBlock from "./components/ACPTBasicBlock";
import metaFields from "./data/metaFields";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useBlockProps, InnerBlocks } = wp.blockEditor;

if ( isLodash() ) {
    _.noConflict();
}

if(metaFields.length > 0) {

    // set document.metaFields
    document.metaFields = metaFields;

    // update category logo
    const ACPTSvg = <svg width="20" height="20" viewBox="0 0 634 572" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M465.039 115.5L339.505 42.9755C333.314 39.3991 325.686 39.3991 319.495 42.9755L193.961 115.5L319.495 188.024C325.686 191.601 333.314 191.601 339.505 188.024L465.039 115.5ZM359.515 8.34015C340.943 -2.3891 318.057 -2.3891 299.485 8.34015L114 115.5L299.485 222.66C318.057 233.389 340.943 233.389 359.515 222.66L545 115.5L359.515 8.34015Z" fill="#02C39A"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M520.34 209.498L394.765 281.952C388.572 285.524 384.758 292.131 384.76 299.28L384.801 444.258L510.376 371.805C516.568 368.232 520.383 361.625 520.381 354.476L520.34 209.498ZM374.775 247.305C356.197 258.024 344.754 277.844 344.76 299.292L344.82 513.507L530.366 406.452C548.944 395.733 560.387 375.913 560.381 354.465L560.32 140.25L374.775 247.305Z" fill="#02C39A"/>
        <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M275.34 444.259L275.381 299.281C275.383 292.131 271.568 285.525 265.376 281.952L139.801 209.498L139.76 354.476C139.758 361.625 143.572 368.232 149.765 371.805L275.34 444.259ZM315.381 299.292C315.387 277.844 303.944 258.024 285.366 247.305L99.8202 140.25L99.7599 354.465C99.7538 375.913 111.197 395.733 129.775 406.452L315.32 513.507L315.381 299.292Z" fill="#02C39A"/>
    </svg>;
    wp.blocks.updateCategory( 'advanced-custom-post-type-blocks', { icon: ACPTSvg } );

    /**
     * Basic fields block
     */
    registerBlockType( 'advanced-custom-post-type/basic-block', {
        apiVersion: 3,
        title: __('ACPT Basic fields', 'acpt'),
        description: __( 'Include an ACPT basic field.', 'acpt'),
        icon: 'block-default',
        category: 'advanced-custom-post-type-blocks',
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
}





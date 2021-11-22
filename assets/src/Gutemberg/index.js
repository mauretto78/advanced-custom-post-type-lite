import React from "react";
import {isLodash} from "./tools/isLodash";
import {logoIcon} from "./icons/logoIcon";
import metaFields from "./data/metaFields";
import ShortcodeBlock from "./components/ShortcodeBlock";
// scss
import "./scss/block.scss";

const { registerBlockType } = wp.blocks;

if ( isLodash() ) {
    _.noConflict();
}

registerBlockType( 'advanced-custom-post-type/block', {
    title: 'Meta box fields',
    icon: logoIcon,
    category: 'advanced-custom-post-type-blocks',
    attributes: {
        type: { type: 'string', default: 'default' },
        title: { type: 'string' },
        content: { type: 'array', source: 'children', selector: 'p' },
        selectedOption: { type: 'object' },
        value: { type: 'string' },
        target: { type: 'string' },
        width: { type: 'string' },
        height: { type: 'string' },
        dateFormat: { type: 'string' },
        elements: { type: 'string' },
    },
    edit: ( props ) => {

        const updateType = ( value ) => {
            const option = metaFields.filter( y => y.value === value )[0];
            const content = (value !== '') ? `[acpt box="${option.box}" field="${option.field}"]` : '';

            props.setAttributes( { selectedOption: option } );
            props.setAttributes( { type: option.type } );
            props.setAttributes( { content: content } );
            props.setAttributes( { value: value } );
            props.setAttributes( { target: null } );
            props.setAttributes( { dateFormat: null } );
            props.setAttributes( { width: null } );
            props.setAttributes( { height: null } );
            props.setAttributes( { elements: null } );
        };

        const updateHeight = (height) => {
            const content = `[acpt box="${props.attributes.selectedOption.box}" field="${props.attributes.selectedOption.field}" ${(props.attributes.width && props.attributes.width !== '') ? `width="${props.attributes.width}"` : ''} ${(height !== '') ? `height="${height}"` : ''}]`;

            props.setAttributes( { content: content } );
            props.setAttributes( { height: height } );
            props.setAttributes( { dateFormat: null } );
            props.setAttributes( { target: null } );
            props.setAttributes( { elements: null } );
        };

        const updateWidth = (width) => {
            const content = `[acpt box="${props.attributes.selectedOption.box}" field="${props.attributes.selectedOption.field}" ${(width !== '') ? `width="${width}"` : ''} ${(props.attributes.height && props.attributes.height !== '') ? `height="${props.attributes.height}"` : ''}]`;

            props.setAttributes( { content: content } );
            props.setAttributes( { width: width } );
            props.setAttributes( { dateFormat: null } );
            props.setAttributes( { target: null } );
            props.setAttributes( { elements: null } );
        };

        const updateTarget = (target) => {
            const content = `[acpt box="${props.attributes.selectedOption.box}" field="${props.attributes.selectedOption.field}" target="${target}"]`;

            props.setAttributes( { content: content } );
            props.setAttributes( { target: target } );
            props.setAttributes( { dateFormat: null } );
            props.setAttributes( { width: null } );
            props.setAttributes( { height: null } );
            props.setAttributes( { elements: null } );
        };

        const updateDateFormat = (dateFormat) => {
            const content = `[acpt box="${props.attributes.selectedOption.box}" field="${props.attributes.selectedOption.field}" date-format="${dateFormat}"]`;

            props.setAttributes( { content: content } );
            props.setAttributes( { dateFormat: dateFormat } );
            props.setAttributes( { target: null } );
            props.setAttributes( { width: null } );
            props.setAttributes( { height: null } );
            props.setAttributes( { elements: null } );
        };

        const updateElements = (elements) => {
            const content = `[acpt box="${props.attributes.selectedOption.box}" field="${props.attributes.selectedOption.field}" elements="${elements}"]`;

            props.setAttributes( { content: content } );
            props.setAttributes( { elements: elements } );
            props.setAttributes( { dateFormat: null } );
            props.setAttributes( { target: null } );
            props.setAttributes( { width: null } );
            props.setAttributes( { height: null } );
        };

        return (
            <ShortcodeBlock
                props={props}
                updateType={updateType}
                updateWidth={updateWidth}
                updateHeight={updateHeight}
                updateTarget={updateTarget}
                updateDateFormat={updateDateFormat}
                updateElements={updateElements}
            />
        );
    },
    save: ( props ) => {

        return (
            <div className="acpt-block">
                <p className="shortcode">
                    {props.attributes.content}
                </p>
            </div>
        );
    },
} );
import React from "react";
import {fieldTypes} from "../../../App/constants/fields";
import TextOrLinkControls from "./InspectorControls/TextOrLinkControls";
import DateFormatControls from "./InspectorControls/DateFormatControls";
import CommonControls from "./InspectorControls/CommonControls";

const ACPTBasicBlock = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const { useBlockProps, InspectorControls, BlockControls, AlignmentControl } = wp.blockEditor;
    const ServerSideRender = wp.serverSideRender;
    const { Panel, PanelBody } = wp.components;

    const blockProps = useBlockProps();
    const field = attributes.field ? JSON.parse(attributes.field) : null;

    return (
        <div { ...blockProps }>
            <BlockControls>
                <AlignmentControl
                    value={ attributes.align }
                    onChange={ (align) => setAttributes({ ...attributes, align: align })  }
                />
            </BlockControls>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__("General settings", "acpt")} initialOpen={true}>
                        <CommonControls
                            fields={document.metaFields.filter((f) => f.group === 'all' || f.group === 'basic' || f.group === 'media')}
                            attributes={attributes}
                            setAttributes={setAttributes}
                        />
                    </PanelBody>
                    <PanelBody title={__("Advanced settings", "acpt")} initialOpen={true}>
                        {field && (
                            field.type === fieldTypes.EMAIL
                        ) && (
                            <TextOrLinkControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (field.type === fieldTypes.DATE) && (
                            <DateFormatControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <ServerSideRender
                block="advanced-custom-post-type/basic-block"
                attributes={attributes}
            />
        </div>
    );
};

export default ACPTBasicBlock;

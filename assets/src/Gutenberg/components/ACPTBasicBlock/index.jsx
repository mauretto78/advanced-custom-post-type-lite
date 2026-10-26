import PropTypes from "prop-types";
import {fieldTypes} from "../../../App/constants/fields";
import TextOrLinkControls from "./InspectorControls/TextOrLinkControls";
import LinkControls from "./InspectorControls/LinkControls";
import MediaControls from "./InspectorControls/MediaControls";
import UOMControls from "./InspectorControls/UOMControls";
import DateFormatControls from "./InspectorControls/DateFormatControls";
import TimeFormatControls from "./InspectorControls/TimeFormatControls";
import DateTimeFormatControls from "./InspectorControls/DateTimeFormatControls";
import RatingControls from "./InspectorControls/RatingControls";
import SelectMultiControls from "./InspectorControls/SelectMultiControls";
import CommonControls from "./InspectorControls/CommonControls";
import AddressControls from "./InspectorControls/AddressControls";
import GalleryControls from "./InspectorControls/GalleryControls";
import ListControls from "./InspectorControls/ListControls";
import CountryControls from "./InspectorControls/CountryControls";
import AudioControls from "./InspectorControls/AudioControls";
import PhoneControls from "./InspectorControls/PhoneControls";
import IconControls from "./InspectorControls/IconControls";
import {attributesProps} from "../../props/attributes.js";
import {isJsonString} from "../../utils/json";

const ACPTBasicBlock = ({ attributes, setAttributes, context }) => {

    const { __ } = wp.i18n;
    const { useBlockProps, InspectorControls, BlockControls, AlignmentControl } = wp.blockEditor;
    const ServerSideRender = wp.serverSideRender;
    const { Panel, PanelBody } = wp.components;

    const blockProps = useBlockProps();
    const field = isJsonString(attributes.field) ? JSON.parse(attributes.field) : null;

    return (
        (<div { ...blockProps }>
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
                            false
                        ) && (
                            <ListControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (
                            field.type === fieldTypes.EMAIL
                        ) && (
                            <TextOrLinkControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (
                            false
                        ) && (
                            <PhoneControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <AddressControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <AudioControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <GalleryControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <LinkControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <MediaControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <UOMControls
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
                        {field && (false) && (
                            <DateTimeFormatControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <TimeFormatControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <RatingControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <SelectMultiControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <CountryControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                        {field && (false) && (
                            <IconControls
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                        )}
                    </PanelBody>
                </Panel>
            </InspectorControls>
            {/* POST, not the default GET: `field` is a JSON-stringified field definition
                (advanced options included) that easily pushes the query string past the
                web server's URI limit — nginx answers 414, which ServerSideRender can only
                show as "Error loading block: [object Object]" (ticket #1322).
                POST sends null attributes as JSON null (GET silently dropped them), so
                BasicBlockGenerator registers every null-defaulted attribute as nullable. */}
            <ServerSideRender
                block="advanced-custom-post-type/basic-block"
                attributes={{...attributes, ...context}}
                httpMethod="POST"
            />
        </div>)
    );
};

ACPTBasicBlock.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
    context: PropTypes.object.isRequired,
};

export default ACPTBasicBlock;

import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";
import {colors} from "../../../data/colors";

const MediaControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        TextControl,
        __experimentalBorderControl: BorderControl,
        __experimentalBoxControl: BoxControl
    } = wp.components;

    return (
        <React.Fragment>
            <PanelRow>
                <BorderControl
                    colors={ colors }
                    label={ __( 'Border' ) }
                    onChange={ ( border ) => {
                        setAttributes({
                            ...attributes,
                            border: border
                        });
                    } }
                    value={ attributes.border }
                />
            </PanelRow>
            <PanelRow>
                <BoxControl
                    label={ __( 'Border radius' ) }
                    onChange={ ( borderRadius ) => {
                        setAttributes({
                            ...attributes,
                            borderRadius: borderRadius
                        });
                    } }
                    values={ attributes.borderRadius }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Width", "acpt")}
                    value={attributes.width}
                    onChange={ ( width ) => {
                        setAttributes({
                            ...attributes,
                            width: width
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <TextControl
                    label={__("Height", "acpt")}
                    value={attributes.height}
                    onChange={ ( height ) => {
                        setAttributes({
                            ...attributes,
                            height: height
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

MediaControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default MediaControls;
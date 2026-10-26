import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const IconControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        ColorPicker,
        TextControl,
    } = wp.components;

    return (
        <React.Fragment>
            <PanelRow>
                <TextControl
                    label={__("Font size", "acpt")}
                    value={attributes.fontSize}
                    onChange={ ( fontSize ) => {
                        setAttributes({
                            ...attributes,
                            fontSize: fontSize
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <ColorPicker
                    label={__("Color", "acpt")}
                    color={ attributes.color}
                    enableAlpha
                    defaultValue="#000"
                    onChange={ ( color ) => {
                        setAttributes({
                            ...attributes,
                            color: color
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

IconControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default IconControls;
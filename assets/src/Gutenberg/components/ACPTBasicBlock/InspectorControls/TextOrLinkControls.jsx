import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const TextOrLinkControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    return (
        <PanelRow>
            <SelectControl
                label={__("Display as", "acpt")}
                value={attributes.display}
                options={[
                    {label: __("text", "acpt"), value: "text"},
                    {label: __("link", "acpt"), value: "link"},
                ]}
                onChange={ ( display ) => {
                    setAttributes({
                        ...attributes,
                        display: display
                    });
                } }
            />
        </PanelRow>
    );
};

TextOrLinkControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default TextOrLinkControls;
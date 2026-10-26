import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const PhoneControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    return (
        <React.Fragment>
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
            <PanelRow>
                <SelectControl
                    label={__("Format", "acpt")}
                    value={attributes.phoneFormat}
                    options={[
                        {label: __("e164", "acpt"), value: "e164"},
                        {label: __("international", "acpt"), value: "international"},
                        {label: __("national", "acpt"), value: "national"},
                    ]}
                    onChange={ ( phoneFormat ) => {
                        setAttributes({
                            ...attributes,
                            phoneFormat: phoneFormat
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

PhoneControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default PhoneControls;
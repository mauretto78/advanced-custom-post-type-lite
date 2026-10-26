import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const CountryControls = ({attributes, setAttributes}) => {

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
                    {label: __("Plain text", "acpt"), value: "text"},
                    {label: __("Flag", "acpt"), value: "flag"},
                    {label: __("Flag and text", "acpt"), value: "full"},
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

CountryControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default CountryControls;
import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const SelectMultiControls = ({ attributes, setAttributes }) => {

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
                    {label: __("list", "acpt"), value: "list"},
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

SelectMultiControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default SelectMultiControls;
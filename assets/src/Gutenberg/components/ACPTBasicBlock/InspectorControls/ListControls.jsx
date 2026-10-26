import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const ListControls = ({ attributes, setAttributes }) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    const options = [
        {label: __("--Select---", "acpt"), value: ""},
        {label: __("Unordered list", "acpt"), value: "ul"},
        {label: __("Ordered list", "acpt"), value: "ol"},
        {label: __("Single string", "acpt"), value: "string"},
    ];

    return (
        <PanelRow>
            <SelectControl
                label={__("Display as", "acpt")}
                value={attributes.display}
                options = {options}
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

ListControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default ListControls;
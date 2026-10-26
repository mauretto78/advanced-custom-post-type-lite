import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const TimeFormatControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    const options = [
        {label: __("--Select---", "acpt"), value: ""},
        {value:"H:i", label: "H:i (ex. 21:18)"},
        {value:"g:i a", label: "g:i a (ex. 9:18 pm)"},
        {value:"g:i A", label: "g:i A (ex. 9:18 PM)"},
    ];

    return (
        <PanelRow>
            <SelectControl
                label={__("Select time format", "acpt")}
                value={attributes.timeFormat}
                options={options}
                onChange={ ( timeFormat ) => {
                    setAttributes({
                        ...attributes,
                        timeFormat: timeFormat
                    });
                } }
            />
        </PanelRow>
    );
};

TimeFormatControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default TimeFormatControls;
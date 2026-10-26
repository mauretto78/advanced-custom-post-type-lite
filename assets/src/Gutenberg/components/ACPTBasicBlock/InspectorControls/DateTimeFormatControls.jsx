import React from "react";
import PropTypes from "prop-types";
import {attributesProps} from "../../../props/attributes.js";

const DateTimeFormatControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    const dateOptions = [
        {label: __("--Select---", "acpt"), value: ""},
        {value:"d-M-y", label: "dd-mmm-yy (ex. 28-OCT-90)"},
        {value:"d-M-Y", label: "dd-mmm-yyyy (ex. 28-OCT-1990)"},
        {value:"d M y", label: "mmm yy (ex. 28 OCT 90)"},
        {value:"d M Y", label: "mmm yyyy (ex. 28 OCT 1990)"},
        {value:"d/m/y", label: "dd/mm/yy (ex. 28/10/90)"},
        {value:"d/m/Y", label: "dd/mm/yyyy (ex. 28/10/1990)"},
        {value:"m/d/y", label: "mm/dd/yy (ex. 10/28/90)"},
        {value:"m/d/Y", label: "mm/dd/yyyy (ex. 10/28/1990)"},
        {value:"d.m.y", label: "dd.mm.yy (ex. 28.10.90)"},
        {value:"d.m.Y", label: "dd.mm.yyyy (ex. 28.10.1990)"}
    ];

    const timeOptions = [
        {label: __("--Select---", "acpt"), value: ""},
        {value:"H:i", label: "H:i (ex. 21:18)"},
        {value:"g:i a", label: "g:i a (ex. 9:18 pm)"},
        {value:"g:i A", label: "g:i A (ex. 9:18 PM)"},
    ];

    return (
        <React.Fragment>
            <PanelRow>
                <SelectControl
                    label={__("Select date format", "acpt")}
                    value={attributes.dateFormat}
                    options = {dateOptions}
                    onChange={ ( dateFormat ) => {
                        setAttributes({
                            ...attributes,
                            dateFormat: dateFormat
                        });
                    } }
                />
            </PanelRow>
            <PanelRow>
                <SelectControl
                    label={__("Select time format", "acpt")}
                    value={attributes.timeFormat}
                    options = {timeOptions}
                    onChange={ ( timeFormat ) => {
                        setAttributes({
                            ...attributes,
                            timeFormat: timeFormat
                        });
                    } }
                />
            </PanelRow>
        </React.Fragment>
    );
};

DateTimeFormatControls.propTypes = {
    attributes: PropTypes.shape(attributesProps).isRequired,
    setAttributes: PropTypes.func.isRequired,
};

export default DateTimeFormatControls;
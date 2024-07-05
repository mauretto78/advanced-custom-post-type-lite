import React from "react";

const DateFormatControls = ({attributes, setAttributes}) => {

    const { __ } = wp.i18n;
    const {
        PanelRow,
        SelectControl,
    } = wp.components;

    const options = [
        {label: __("--Select---", "acpt"), value: null},
        {value:"d-M-y", label: "dd-mmm-yy (ex. 28-OCT-90)"},
        {value:"d-M-Y", label: "dd-mmm-yyyy (ex. 28-OCT-1990)"},
        {value:"d M y", label: "mmm yy (ex. 28 OCT 90)"},
        {value:"d M Y", label: "mmm yyyy (ex. 28 OCT 1990)"},
        {value:"d/m/Y", label: "dd/mm/yy (ex. 28/10/90)"},
        {value:"d/m/Y", label: "dd/mm/yyyy (ex. 28/10/1990)"},
        {value:"m/d/y", label: "mm/dd/yy (ex. 10/28/90)"},
        {value:"m/d/Y", label: "mm/dd/yyyy (ex. 10/28/1990)"},
        {value:"d.m.Y", label: "dd.mm.yy (ex. 28.10.90)"},
        {value:"d.m.Y", label: "dd.mm.yyyy (ex. 28.10.1990)"}
    ];

    return (
        <PanelRow>
            <SelectControl
                label={__("Select date format", "acpt")}
                value={attributes.dateFormat}
                options = {options}
                onChange={ ( dateFormat ) => {
                    setAttributes({
                        ...attributes,
                        dateFormat: dateFormat
                    });
                } }
            />
        </PanelRow>
    );
};

export default DateFormatControls;
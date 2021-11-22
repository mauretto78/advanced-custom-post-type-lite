import React from "react";

const { SelectControl } = wp.components;

const TargetSelect = ({props, updateTarget}) => {

    const options = [
        {label: "--Select---", value: null},
        {label: "Opens in a new window or tab", value: "_blank"},
        {label: "Opens in the same frame as it was clicked", value: "_self"},
        {label: "Opens in the parent frame", value: "_parent"},
        {label: "Opens in the full body of the window", value: "_top"},
    ];

    return (
        <SelectControl
            label="Select target"
            value={props.attributes.target}
            options = {options}
            onChange={(value) => updateTarget(value)}
        />
    );
};

export default TargetSelect;
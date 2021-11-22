import React from "react";

const { TextControl } = wp.components;
const { SelectControl } = wp.components;

const ElementsSelect = ({props, updateElements, updateWidth, updateHeight}) => {

    const options = [
        {label: "--Select---", value: null},
        {value:'1', label: "One element"},
        {value:'2', label: "Two elements"},
        {value:'3', label: "Three elements"},
        {value:'4', label: "Four elements"},
        {value:'6', label: "Six elements"},
    ];

    return (
        <React.Fragment>
            <SelectControl
                label="Select the number of elements to display"
                value={props.attributes.elements}
                options = {options}
                onChange={(value) => updateElements(value)}
            />
            <TextControl
                label="Width of images"
                value={props.attributes.width}
                onChange={ ( value ) => updateWidth(value) }
            />
            <TextControl
                label="Height of images"
                value={props.attributes.height}
                onChange={ ( value ) => updateHeight(value) }
            />
        </React.Fragment>
    );
};

export default ElementsSelect;
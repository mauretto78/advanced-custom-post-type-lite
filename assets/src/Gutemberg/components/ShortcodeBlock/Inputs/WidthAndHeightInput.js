import React from "react";

const { TextControl } = wp.components;

const WidthAndHeightSelect = ({props, updateWidth, updateHeight}) => {

    return (
        <div>
            <TextControl
                label="Width"
                value={props.attributes.width}
                onChange={ ( value ) => updateWidth(value) }
            />
            <TextControl
                label="Height"
                value={props.attributes.height}
                onChange={ ( value ) => updateHeight(value) }
            />
        </div>
    );
};

export default WidthAndHeightSelect;
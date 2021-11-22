import React, {useState} from 'react';
import {generateRandomInteger} from "../../../../../utils/math";
import {Icon} from "@iconify/react";

const FontStyle = ({value, onChange}) => {

    const id1 = generateRandomInteger(10000);
    const id2 = generateRandomInteger(10000);

    const [selectedValue, setSelectedValue] = useState(value);

    const submitOnChange = (val) => {
        setSelectedValue(val);
        onChange(val);
    };

    return (
        <div className="acpt-radio-buttons-wrapper">
            <input type="radio" className="radio-button" onChange={(e)=> submitOnChange("normal")} value="normal" id={`button-${id1}`} checked={ typeof selectedValue === 'undefined' || selectedValue === 'normal' } />
            <label htmlFor={`button-${id1}`}><Icon icon="clarity:text-line" width="20px" /></label>
            <input type="radio" className="radio-button" onChange={(e)=> submitOnChange("italic")} value="italic" id={`button-${id2}`} checked={ selectedValue === 'italic' } />
            <label htmlFor={`button-${id2}`}><Icon icon="bx:bx-italic" width="20px" /></label>
        </div>
    );
};

export default FontStyle;

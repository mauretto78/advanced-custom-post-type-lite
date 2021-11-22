import React, {useState} from 'react';
import {generateRandomInteger} from "../../../../../utils/math";
import {Icon} from "@iconify/react";

const TextAlign = ({value, onChange}) => {

    const id1 = generateRandomInteger(10000);
    const id2 = generateRandomInteger(10000);
    const id3 = generateRandomInteger(10000);
    const id4 = generateRandomInteger(10000);

    const [selectedValue, setSelectedValue] = useState(value);

    const submitOnChange = (val) => {
        setSelectedValue(val);
        onChange(val);
    };

    return (
        <div className="acpt-radio-buttons-wrapper">
            <input type="radio" className="radio-button" onChange={(e) => submitOnChange("left") } value="left" id={`button-${id1}`} checked={ typeof selectedValue === 'undefined' || selectedValue === 'left' } />
            <label htmlFor={`button-${id1}`}><Icon icon="bx:bx-align-left" width="20px" /></label>
            <input type="radio" className="radio-button" onChange={(e) => submitOnChange("center") } value="center" id={`button-${id2}`} checked={ selectedValue === 'center' } />
            <label htmlFor={`button-${id2}`}><Icon icon="bx:bx-align-middle" width="20px" /></label>
            <input type="radio" className="radio-button" onChange={(e) => submitOnChange("right") } value="right" id={`button-${id3}`} checked={ selectedValue === 'right' } />
            <label htmlFor={`button-${id3}`}><Icon icon="bx:bx-align-right" width="20px" /></label>
            <input type="radio" className="radio-button" onChange={(e) => submitOnChange("justify") } value="justify" id={`button-${id4}`} checked={ selectedValue === 'justify' } />
            <label htmlFor={`button-${id4}`}><Icon icon="bx:bx-align-justify" width="20px" /></label>
        </div>
    );
};

export default TextAlign;

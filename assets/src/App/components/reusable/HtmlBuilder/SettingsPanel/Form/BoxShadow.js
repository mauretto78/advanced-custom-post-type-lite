import React, {useEffect, useState} from 'react';
import InputRange from "./InputRange";
import ColorPicker from "./ColorPicker";

const BoxShadow = ( {boxShadow, onChange}) => {

    const [shiftRight, setShiftRight] = useState(typeof boxShadow !== 'undefined' ? boxShadow.shiftRight : 0);
    const [shiftDown, setShiftDown] = useState(typeof boxShadow !== 'undefined' ? boxShadow.shiftDown : 0);
    const [spread, setSpread] = useState(typeof boxShadow !== 'undefined' ? boxShadow.spread : 0);
    const [blur, setBlur] = useState(typeof boxShadow !== 'undefined' ? boxShadow.blur : 0);
    const [color, setColor] = useState(typeof boxShadow !== 'undefined' ? boxShadow.color : '');
    const [opacity, setOpacity] = useState(typeof boxShadow !== 'undefined' ? boxShadow.opacity : 0);
    const [inset, setInset] = useState(typeof boxShadow !== 'undefined' ? boxShadow.inset : false);

    useEffect(()=>{
        const boxShadow = {
            shiftRight: parseInt(shiftRight),
            shiftDown: parseInt(shiftDown),
            spread: parseInt(spread),
            blur: parseInt(blur),
            color: color,
            opacity: opacity,
            inset: inset,
        };
        onChange(boxShadow);

    }, [shiftRight, shiftDown, spread, blur, color, opacity, inset]);

    return (
        <div className="box-shadow-wrapper">
            <div className="acpt-form-group">
                <label>Shift right (px)</label>
                <InputRange
                    min={-50}
                    max={50}
                    value={shiftRight}
                    onChange={(value) => {
                        setShiftRight(value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Shift down (px)</label>
                <InputRange
                    min={-50}
                    max={50}
                    value={shiftDown}
                    onChange={(value) => {
                        setShiftDown(value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Spread (px)</label>
                <InputRange
                    min={-30}
                    max={50}
                    value={spread}
                    onChange={(value) => {
                        setSpread(value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Blur (px)</label>
                <InputRange
                    min="0"
                    max={50}
                    value={blur}
                    onChange={(value) => {
                        setBlur(value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Color</label>
                <ColorPicker
                    value={color }
                    onChange={(color) => {
                        setColor(color);
                    } }
                />
            </div>
            <div className="acpt-form-group">
                <label>Shadow opacity</label>
                <InputRange
                    min="0"
                    max={1}
                    step="0.01"
                    value={opacity}
                    onChange={(value) => {
                        setOpacity(value);
                    }}
                />
            </div>
            <div className="mt-6">
                <input
                    type="checkbox"
                    className="mr-1"
                    defaultChecked={inset}
                    onChange={(e) => {
                        setInset(e.currentTarget.checked);
                        changeValue();
                    }}
                />
                Inset
            </div>
            
        </div>
    );
};

export default BoxShadow;
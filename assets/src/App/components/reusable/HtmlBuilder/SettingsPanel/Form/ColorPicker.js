import React, {useEffect, useRef, useState} from 'react';
import {HexColorInput, HexColorPicker} from "react-colorful";
import useDebouncy from "use-debouncy/lib/effect";

const ColorPicker = ({value, onChange}) => {

    // manage local state
    const wrapperRef = useRef(null);
    const [color, setColor] = useState(value);
    const [openPicker, toggleOpenPicker] = useState(false);
    const presetColors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"];

    // debounce color change
    useDebouncy(()=>{
        onChange(color);
    }, 400, [color]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                toggleOpenPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} style={{position: "relative"}}>
            <div className="react-colorful-wrapper" onClick={ () => toggleOpenPicker(!openPicker)  }>
                <HexColorInput
                    color={color}
                    onChange={setColor}
                    alpha
                />
            </div>
            {openPicker && (
                <div className="acpt-picker">
                    <HexColorPicker
                        color={color}
                        onChange={setColor}
                    />
                    <div className="picker__swatches">
                        {presetColors.map((presetColor) => (
                            <button
                                key={presetColor}
                                className="picker__swatch"
                                style={{ background: presetColor }}
                                onClick={() => onChange(setColor(presetColor))}
                            />
                        ))}
                    </div>
                    <button className="acpt-btn acpt-btn-sm acpt-btn-primary-o" onClick={e => setColor('')}>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
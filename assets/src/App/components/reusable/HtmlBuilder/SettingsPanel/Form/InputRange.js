import React, {useEffect, useState} from 'react';

const InputRange = ({value, onChange, min, max, step}) => {

    const defaultMin = min ? min : 7;
    const defaultMax = max ? max : 50;
    const defaultStep = step ? step : 1;

    const [bubblePos, setBubblePos] = useState(0);

    useEffect(() => {
        const newVal = Number(((value - defaultMin) * 100) / (defaultMax - defaultMin));

        setBubblePos(newVal);

    }, [value]);

    return (
        <div className={`acpt-range`}>
            <input
                type="range"
                style={{backgroundSize: `${bubblePos}% 100%`  }}
                defaultValue={value}
                step={defaultStep}
                min={defaultMin}
                max={defaultMax}
                onChange={e => onChange(e.currentTarget.value)}
            />
            <span className="bubble" style={{left: `calc(${bubblePos}% + (${8 - bubblePos * 0.15}px))`   }}>{value}</span>
        </div>
    );
};

export default InputRange;
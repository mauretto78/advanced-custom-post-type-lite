import React, {useRef} from 'react';

const Measure = ( {value, onChange}) => {

    const measureRef = useRef();
    const unitRef = useRef();
    const measures = ['px','rem','%'];

    let unit = null;
    let measure = null;

    measures.map((m) => {
        if(value !== null && typeof value !== 'undefined'){
            if(value.replace(m, '') !== value){
                unit = m;
                measure = value.replace(m, '');
            }
        }
    });

    const changeValue = () => {
        if(!measureRef.current.value){
            unitRef.current.value = '';
        }

        let newValue = null;
        if(measureRef.current.value && unitRef.current.value){
            newValue = measureRef.current.value+unitRef.current.value;
        }

        onChange(newValue);
    };

    return (
        <div className="space-between">
            <input
                style={{
                    width: '75%'
                }}
                ref={measureRef}
                type="number"
                className="acpt-form-control"
                defaultValue={measure}
                onChange={(e) => changeValue(e.target.value, measureRef)}
            />
            <select
                style={{
                    width: '25%'
                }}
                ref={unitRef}
                className="acpt-form-control"
                defaultValue={unit}
                onChange={(e) => {
                    changeValue(e.currentTarget.value, unitRef);
                }}
            >
                <option value="">unit</option>
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="%">%</option>
            </select>
        </div>
    );
};

export default Measure;
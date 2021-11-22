import React, {useRef, useState} from 'react';
import {Icon} from "@iconify/react";

const FourSquarePixel = ( {value, onChange, defaultLocked}) => {

    const borderTopLeftRef = useRef();
    const borderTopRightRef = useRef();
    const borderBottomLeftRef = useRef();
    const borderBottomRightRef = useRef();
    const unitRef = useRef();

    const [locked, toggleLocked] = useState((typeof defaultLocked !== 'undefined') ? defaultLocked : true);

    const changeValue = (val, ref) => {
        if(locked){
            borderTopLeftRef.current.value = val;
            borderTopRightRef.current.value = val;
            borderBottomLeftRef.current.value = val;
            borderBottomRightRef.current.value = val;
        } else {
            ref.current.value = val;
        }

        if(borderTopLeftRef.current.value && borderTopRightRef.current.value && borderBottomLeftRef.current.value && borderBottomRightRef.current.value && unitRef.current.value){
            onChange([
                parseInt(borderTopLeftRef.current.value),
                parseInt(borderTopRightRef.current.value),
                parseInt(borderBottomLeftRef.current.value),
                parseInt(borderBottomRightRef.current.value),
                unitRef.current.value
            ]);
        } else {
            onChange([null,null,null,null,null]);
        }
    };

    return (
        <div className="four-square-pixel-wrapper">
            <div>
                <input
                    ref={borderTopLeftRef}
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={(value && typeof value !== 'undefined') ? value[0] : null}
                    onChange={(e) => changeValue(e.target.value, borderTopLeftRef)}
                />
                <span className="pixel">north</span>
            </div>
            <div>
                <input
                    ref={borderTopRightRef}
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={(value && typeof value !== 'undefined') ? value[1] : null}
                    onChange={(e) => changeValue(e.target.value, borderTopRightRef)}
                />
                <span className="pixel">east</span>
            </div>
            <div>
                <input
                    ref={borderBottomLeftRef}
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={(value && typeof value !== 'undefined') ? value[2] : null}
                    onChange={(e) => changeValue(e.target.value, borderBottomLeftRef)}
                />
                <span className="pixel">south</span>
            </div>
            <div>
                <input
                    ref={borderBottomRightRef}
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={(value && typeof value !== 'undefined') ? value[3] : null}
                    onChange={(e) => changeValue(e.target.value, borderBottomRightRef)}
                />
                <span className="pixel">west</span>
            </div>
            <div>
                <select
                    ref={unitRef}
                    className="acpt-form-control"
                    defaultValue={(value && typeof value !== 'undefined') ? value[4] : null}
                >
                    <option value="">unit</option>
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="%">%</option>
                </select>
            </div>
            <div>
                <a
                    className={`acpt-btn ${locked ? 'acpt-btn-primary-o' : 'acpt-btn-secondary-o'}`}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleLocked(!locked);
                    }}
                >
                    {locked ?
                        <React.Fragment><Icon icon="bx:bx-link" width="24px" /></React.Fragment>
                        :
                        <React.Fragment><Icon icon="bx:bx-unlink" width="24px" /></React.Fragment>
                    }
                </a>
            </div>
        </div>
    );
};

export default FourSquarePixel;

// link-switch
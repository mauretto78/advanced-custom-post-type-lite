import React from 'react';
import {Icon} from "@iconify/react";
import {reactSelectStyles} from "../../../../../constants/styles";
import AsyncSelect from "react-select/async/dist/react-select.esm";

const ChooseIcon = ( {value, onChange}) => {

    // load icons from API
    const loadOptions = async ( inputValue, callback ) => {

        // &limit=96`);
        const res = await fetch(`https://api.iconify.design/search?query=${inputValue}`);
        const json = await res.json();

        callback(getIcons(json));
    };

    // format icon array
    const getIcons = (json) => {

        let icons = [];

        json.icons.map((icon)=>{
            icons.push({label: <div className="vertical-center"><Icon icon={icon} color="#aaa" width="24px" />&nbsp;{icon}</div>, value: icon })
        });

        return icons;
    };

    return (
        <React.Fragment>
            <AsyncSelect
                defaultValue={ value ? {label: <div className="vertical-center"><Icon icon={value} color="#aaa" width="24px" />&nbsp;{value}</div>, value: value} : null }
                cacheOptions
                onChange={onChange}
                placeholder="Search an icon"
                styles={reactSelectStyles}
                loadOptions={loadOptions}
            />
            <a
                style={{
                    display: "inline-block"
                }}
                className="mt-1"
                href="https://icon-sets.iconify.design/bx/ChooseIcon.js" target="_blank"
            >
                Full list of icons here
            </a>
        </React.Fragment>

    );
};

export default ChooseIcon;
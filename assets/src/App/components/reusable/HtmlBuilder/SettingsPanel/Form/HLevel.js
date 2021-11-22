import React, {useState} from 'react';

const HLevel = ({value, onChange}) => {

    const [selectedValue, setSelectedValue] = useState(value);

    const submitOnChange = (val) => {
        setSelectedValue(val);
        onChange(val);
    };

    return (
        <React.Fragment>
            <select
                className="acpt-form-control"
                defaultValue={selectedValue}
                onChange={(e) => {
                    submitOnChange(e.target.value);
                }}
            >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
            </select>
        </React.Fragment>
    );
};

export default HLevel;
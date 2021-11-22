import React, {useState} from 'react';

const TargetLink = ({value, onChange}) => {

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
                <option value="_blank">Opens in a new window or tab</option>
                <option value="_self">Opens in the same frame as it was clicked</option>
                <option value="_parent">Opens in the parent frame</option>
                <option value="_top">Opens in the full body of the window</option>
            </select>
        </React.Fragment>
    );
};

export default TargetLink;
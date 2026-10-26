import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {displayOptions, fieldGroupsDisplay} from "../../constants/fields.jsx";

const DisplayPickerItem = ({option, handleSelect, isActive}) => {

    if(!option.value) return;

    /**
     * Generates a visual representation of a "micon" component based on a specified layout type.
     *
     * Depending on the option value, the component renders one of the following layouts:
     * - STANDARD: A default layout with a top section containing dots and a body composed of rows.
     * - VERTICAL_TABS: A layout with vertical tabs on the left and a row-based body on the right.
     * - HORIZONTAL_TABS: A layout with horizontal tabs at the top and a row-based body below.
     *
     * @function micon
     * @returns {JSX.Element} The rendered micon component with the appropriate layout based on the selected option value.
     */
    const micon = () => {

        const val = option.value;

        switch(val) {
            default:
            case fieldGroupsDisplay.STANDARD:
                return (
                    <div className="micon">
                        <div className="mi-top">
                            <div className="mi-dot"></div>
                            <div className="mi-dot"></div>
                        </div>
                        <div className="mi-body">
                            <div className="mi-row"></div>
                            <div className="mi-row"></div>
                            <div className="mi-row" style={{width: '60%'}}></div>
                        </div>
                    </div>
                );

            case fieldGroupsDisplay.ACCORDION:
                return (
                    <div className="micon accordion">
                        <div className="mi-acc">
                            <div className="mi-acc-head a"></div>
                            <div className="mi-body">
                                <div className="mi-row"></div>
                                <div className="mi-row"></div>
                            </div>
                        </div>
                        <div className="mi-acc">
                            <div className="mi-acc-head"></div>
                        </div>
                        <div className="mi-acc">
                            <div className="mi-acc-head"></div>
                        </div>
                    </div>
                );

            case fieldGroupsDisplay.VERTICAL_TABS:
                return (
                    <div className="micon" style={{flexDirection: 'row'}}>
                        <div className="mi-left">
                            <div className="mi-vtab a"></div>
                            <div className="mi-vtab"></div>
                            <div className="mi-vtab"></div>
                        </div>
                        <div className="mi-body" style={{flex: 1}}>
                            <div className="mi-row"></div>
                            <div className="mi-row"></div>
                            <div className="mi-row" style={{width: '50%'}}></div>
                        </div>
                    </div>
                );

            case fieldGroupsDisplay.HORIZONTAL_TABS:
                return (
                    <div className="micon">
                        <div className="mi-htabs">
                            <div className="mi-htab a"></div>
                            <div className="mi-htab"></div>
                            <div className="mi-htab"></div>
                        </div>
                        <div className="mi-body">
                            <div className="mi-row"></div>
                            <div className="mi-row"></div>
                            <div className="mi-row" style={{width: '60%'}}></div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            key={option.value}
            className={`mode-option ${isActive ? 'active' : ''}`}
            role="radio"
            aria-checked={!!isActive}
            tabIndex={0}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    handleSelect(option.value);
                }
            }}
        >
            {micon()}
            {option.label || option.value}
        </div>
    );
}

const DisplayPicker = ({id, defaultValue, description, validate, register, errors, setValue}) => {

    useEffect(() => {
        if(defaultValue){
            setSelected(defaultValue);
        }
    }, [defaultValue])

    const error = get(errors, id);
    const [selected, setSelected] = useState(defaultValue || fieldGroupsDisplay.STANDARD);

    const handleSelect = (value) => {
        setSelected(value);
        if (setValue) {
            setValue(id, value);
        }
    };

    return (
        <React.Fragment>
            <div className="flex-column s-8">
                <div role="radiogroup" className={`display-mode-selector ${error ? 'has-errors' : ''}`}>
                    <input
                        type="hidden"
                        id={id}
                        {...register(id, validate)}
                        value={selected}
                    />
                    {displayOptions.map((option) => (
                        <DisplayPickerItem
                            option={option}
                            handleSelect={handleSelect}
                            key={option.value}
                            isActive={selected === option.value}
                        />
                    ))}
                </div>
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

DisplayPickerItem.propTypes = {
    option: PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
    handleSelect: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
};

DisplayPicker.propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    defaultValue: PropTypes.string,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    setValue: PropTypes.func,
};

export default DisplayPicker;

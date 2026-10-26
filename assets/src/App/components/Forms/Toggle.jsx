import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {sizes} from "../../constants/forms.jsx";

const Toggle = ({id, defaultValue = 0,  size= 'default', description, validate, register, errors, onChangeCapture, onClickCapture, disabled = false}) => {

    const error = get(errors, id);

    return (
        <div className={`toggle-group ${disabled ? "disabled" : ""} ${size}`}>
            <label
                data-testid={`toggle-${id}`}
                className="toggle"
            >
                <input
                    disabled={disabled}
                    id={id}
                    name={id}
                    type="checkbox"
                    data-testid={`toggle-checkbox-${id}`}
                    // The string "0" is truthy in JS -- without this, a
                    // persisted advanced-option value of "0" (explicitly
                    // disallowed) would render as checked on reload. Every
                    // other falsy defaultValue (undefined/null/''/0/false)
                    // still behaves as before via the `!!` fallback.
                    defaultChecked={defaultValue === '0' ? false : !!defaultValue}
                    onClickCapture={onClickCapture}
                    onChangeCapture={onChangeCapture}
                    {...register(id, validate)}
                />
                <span className="slider round"/>
            </label>
            {description && (
                <span className={`form-description ${disabled ? "disabled" : ""}`}>{description}</span>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </div>
    );
};

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    defaultValue: PropTypes.bool,
    description: PropTypes.string,
    onClickCapture: PropTypes.func,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.object,
    disabled: PropTypes.bool,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default Toggle;
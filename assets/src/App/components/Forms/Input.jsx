import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {sizes} from "../../constants/forms.jsx";
import DangerousContent from "../DangerousContent";

const Input = ({innerRef, type = 'text', size= 'default', placeholder, id, defaultValue, description, step, min, max, readOnly, onClick, onChangeCapture, validate, register, errors, disabled = false}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <input
                ref={innerRef}
                id={id}
                data-testid={`input-${id}`}
                name={id}
                type={type}
                disabled={disabled}
                min={min ?? null}
                max={max ?? null}
                step={step ? step : "any"}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChangeCapture={onChangeCapture}
                onClick={onClick}
                readOnly={readOnly}
                aria-invalid={error ? "true" : "false"}
                className={`form-control ${size} ${error ? 'has-errors': ''}`}
                {...register(id, validate)}
            />
            {error && <div data-testid={`input-error-${id}`} className="invalid-feedback"><DangerousContent element="span" content={error.message}/></div>}
            {description && (
                <DangerousContent className="form-description" content={description} />
            )}
        </React.Fragment>
    );
};

Input.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    innerRef: PropTypes.func,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    description: PropTypes.string,
    readOnly: PropTypes.bool,
    // Spread straight onto the native <input min/max/step> attribute below --
    // AdvancedTab's renderAdvancedField() callers commonly pass these as
    // quoted numeric strings (e.g. `min: "0"`), which HTML accepts fine.
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeCapture: PropTypes.func,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
        'text',
        'color',
        'email',
        'number',
        'phone',
        'tel',
        'url',
        'date',
        'datetime-local',
        'time',
    ]),

};

export default Input;
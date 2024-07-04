import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const Input = ({innerRef, type = 'text', size= 'default', placeholder, id, defaultValue, description, step, min, max, readOnly, onClick, onChangeCapture, validate, register, errors, disabled = false}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <input
                ref={innerRef}
                id={id}
                data-cy={`input-${id}`}
                name={id}
                type={type}
                disabled={disabled}
                min={min ? min : 0}
                max={max}
                step={step ? min : 1}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChangeCapture={onChangeCapture}
                onClick={onClick}
                readOnly={readOnly}
                aria-invalid={error ? "true" : "false"}
                className={`form-control ${size} ${error ? 'has-errors': ''}`}
                {...register(id, validate)}
            />
            {error && <div data-cy={`input-error-${id}`} className="invalid-feedback"><span dangerouslySetInnerHTML={{__html: error.message}}/></div>}
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

Input.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf([
        'default',
        'sm',
    ]),
    innerRef: PropTypes.func,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    readOnly: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
        'text',
        'email',
        'number',
        'tel',
        'url',
        'date',
        'time',
    ]),

};

export default Input;
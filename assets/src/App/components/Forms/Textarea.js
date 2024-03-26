import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const Textarea = ({innerRef, size= 'default', placeholder, id, defaultValue, description, readOnly, onChangeCapture, validate, register, errors, disabled = false}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <textarea
                rows={8}
                ref={innerRef}
                id={id}
                data-cy={`textarea-${id}`}
                name={id}
                disabled={disabled}
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChangeCapture={onChangeCapture}
                readOnly={readOnly}
                aria-invalid={error ? "true" : "false"}
                className={`form-control ${size} ${error ? 'has-errors': ''}`}
                {...register(id, validate)}
            />
            {error && <div className="invalid-feedback">{error.message}</div>}
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

Textarea.propTypes = {
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
    onChangeCapture: PropTypes.func,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    disabled: PropTypes.bool,

};

export default Textarea;
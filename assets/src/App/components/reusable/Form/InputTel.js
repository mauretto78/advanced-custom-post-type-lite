import React from 'react';

const InputTel = ({id, label, placeholder, validate, register, errors, isRequired, description, wizard}) => {

    const error = errors[id];

    return (
        <div className="acpt-form-group">
            <div className="acpt-form-label-wrapper">
                <label htmlFor={id}>
                    {label}
                    {isRequired && (
                        <span className="required">*</span>
                    )}
                </label>
                {wizard && (
                    <span className="wizard" dangerouslySetInnerHTML={{ __html: wizard }} />
                )}
            </div>
            <div className="acpt-form-control-wrapper">
                <input
                    id={id}
                    name={id}
                    type="tel"
                    placeholder={placeholder}
                    required={isRequired}
                    aria-invalid={error ? "true" : "false"}
                    className={`acpt-form-control ${error ? 'has-errors': ''}`}
                    {...register(id, validate)}
                />
                {description && (
                    <span className="description">{description}</span>
                )}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </div>
    );
};

export default InputTel;


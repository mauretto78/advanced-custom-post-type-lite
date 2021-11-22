import React from 'react';

const InputPassword = ({id, label, validate, register, errors, isRequired, description, wizard}) => {

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
                    type="password"
                    placeholder="password"
                    required={isRequired}
                    aria-invalid={error ? "true" : "false"}
                    className={`form-control ${error ? 'has-errors': ''}`}
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

export default InputPassword;


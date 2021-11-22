import React from 'react';

const Select = ( {id, label, validate, register, errors, values, placeholder, defaultValue, isRequired, description, wizard}) => {

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
                <select
                    defaultValue={defaultValue}
                    id={id}
                    name={id}
                    required={isRequired}
                    aria-invalid={error ? "true" : "false"}
                    className={`form-control ${error ? 'has-errors': ''}`}
                    {...register(id, validate)}
                >
                    <option value="">{placeholder ? placeholder : 'Select an item'}</option>
                    {Object.keys(values).map((keyName) => (
                        <option value={keyName} key={keyName}>{values[keyName]}</option>
                    ))}
                </select>
                {description && (
                    <span className="description">{description}</span>
                )}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </div>
    );
};

export default Select;
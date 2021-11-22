import React from 'react';

const InputSwitch = ( {id, label, validate, register, errors, defaultValue, isRequired, description, wizard}) => {

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
                <label className="switch">
                    <input
                        id={id}
                        name={id}
                        required={isRequired}
                        type="checkbox"
                        defaultChecked={defaultValue}
                        {...register(id, validate)}
                    />
                    <span className="slider round"/>
                </label>
                {description && (
                    <span className="description">{description}</span>
                )}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </div>
    );
};

export default InputSwitch;


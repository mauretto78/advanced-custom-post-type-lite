import React from 'react';

const Textarea = ({id, label, validate, register, errors, rows, cols, isRequired, description, wizard}) => {

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
                <textarea
                    id={id}
                    name={id}
                    rows={rows ? rows : 8}
                    cols={cols ? cols : 30}
                    required={isRequired}
                    aria-invalid={error ? "true" : "false"}
                    className={`form-control ${error && 'has-errors'}`}
                    {...register(id, validate)}
                >...</textarea>
                {description && (
                    <span className="description">{description}</span>
                )}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </div>
    );
};

export default Textarea;
import React from 'react';

const Checkboxes = ( {id, label, validate, register, errors, values, isRequired, description, wizard}) => {

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
                <div className="acpt-checkboxes-wrapper">
                    {Object.keys(values).map((keyName, index) => (
                        <div className="acpt-checkbox" key={keyName}>
                            <input
                                id={`${id}_${index}`}
                                value={values[keyName]['value']}
                                defaultChecked={values[keyName]['checked']}
                                type="checkbox"
                                aria-invalid={error ? "true" : "false"}
                                className={`form-control ${error ? 'has-errors': ''}`}
                                {...register(`${id}_${index}`, {...validate})}
                            />
                            <label htmlFor={`${id}_${index}`}>
                                {keyName}
                            </label>
                        </div>
                    ))}
                    {error && <div className="invalid-feedback">{error.message}</div>}
                </div>
                {description && (
                    <span className="description">{description}</span>
                )}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
        </div>
    );
};

export default Checkboxes;
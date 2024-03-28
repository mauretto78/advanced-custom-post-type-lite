import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const Select = ({size= 'default', placeholder, id, defaultValue, description, values, onChangeCapture, validate, register, errors, disabled, muted}) => {

    const error = get(errors, id);

    /**
     *
     * @param value
     * @return {*}
     */
    const renderSelectElement = (value = null) => {
        return (
            <React.Fragment>
                <div className={`${!muted ? 'acpt-select' : ''}`}>
                    <select
                        id={id}
                        name={id}
                        data-cy={`select-${id}`}
                        defaultValue={value}
                        placeholder={placeholder}
                        onChangeCapture={onChangeCapture}
                        disabled={disabled}
                        aria-invalid={error ? "true" : "false"}
                        className={muted ? 'muted' :`form-control ${size} ${error ? 'has-errors': ''}`}
                        {...register(id, validate)}
                    >
                        {values.map((value) => {

                            const renderOption = (option) => {

                                if(option.value === null){
                                    return (
                                        <option value="">{option.label}</option>
                                    )
                                }

                                return (
                                    <option value={option.value}>{option.label}</option>
                                )
                            };

                            if(value.options){
                                return (
                                    <optgroup label={value.label} data-original={value.originalLabel ? value.originalLabel : value.label}>
                                        {value.options.map((option)=> renderOption(option))}
                                    </optgroup>
                                );
                            } else {
                                return renderOption(value);
                            }
                        })}
                    </select>
                </div>
                {error && <div data-cy={`select-error-${id}`} className="invalid-feedback">{error.message}</div>}
                {description && (
                    <div className="form-description">{description}</div>
                )}
            </React.Fragment>
        );
    };

    // Force re-rendering when injecting the defaultValue
    if(defaultValue && values.length > 0){
        return (
            <div className="acpt-select-wrapper-with-values" data-current-value={defaultValue}>
                {renderSelectElement(defaultValue)}
            </div>
        );
    }

    return renderSelectElement();
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf([
        'default',
        'sm',
    ]),
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    isMulti: PropTypes.bool,
    disabled: PropTypes.bool,
    muted: PropTypes.bool,
    values: PropTypes.array.isRequired,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
};

export default Select;
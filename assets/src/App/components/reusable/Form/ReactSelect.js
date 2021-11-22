import Select from 'react-select';
import React from "react";
import {Controller} from "react-hook-form";
import {reactSelectStyles} from "../../../constants/styles";

const ReactSelect = ( {id, label, validate, control, values, defaultValue, isRequired, description, wizard}) => {

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
                <Controller
                    id={id}
                    control={control}
                    name={id}
                    rules={validate}
                    render={(
                        {
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { invalid, isTouched, isDirty, error },
                            formState,
                        }
                    ) => (
                            <div>
                                <Select
                                    defaultValue={defaultValue}
                                    styles={reactSelectStyles}
                                    classNamePrefix="addl-class"
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    checked={value}
                                    inputRef={ref}
                                    options={values}
                                />
                                {error && <div className="invalid-feedback">{error.message}</div>}
                            </div>
                        )
                    }
                />
                {description && (
                    <span className="description">{description}</span>
                )}

            </div>
        </div>
    );
};

export default ReactSelect;
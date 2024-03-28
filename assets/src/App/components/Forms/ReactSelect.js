import React from 'react';
import PropTypes from 'prop-types';
import {Controller} from "react-hook-form";
import Select from "react-select";
import useTranslation from "../../hooks/useTranslation";
import {reactSelectStyles} from "../../constants/styles";

const ReactSelect = ({id, validate, control, values, defaultValue, description, disabled, isMulti=false, placeholder, onChange: externalOnChange}) => {

    return (
        <React.Fragment>
            <Controller
                id={id}
                control={control}
                name={id}
                rules={validate}
                defaultValue={defaultValue}
                render={(
                    {
                        field: { onChange, onBlur, value, name, ref },
                        fieldState: { invalid, isTouched, isDirty, error },
                        formState,
                    }
                ) => (
                    <div>
                        <Select
                            placeholder={placeholder ? placeholder : useTranslation("Select")}
                            isDisabled={disabled}
                            isMulti={isMulti}
                            defaultValue={defaultValue}
                            styles={reactSelectStyles}
                            classNamePrefix="addl-class"
                            onBlur={onBlur}
                            onChange={(value)=> {
                                onChange(value);
                                if(externalOnChange){
                                    externalOnChange(value);
                                }
                            }}
                            checked={value}
                            inputRef={ref}
                            options={values}
                        />
                        {error && <div className="invalid-feedback">{error.message}</div>}
                    </div>
                )}
            />
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

ReactSelect.propTypes = {
    id: PropTypes.string.isRequired,
    isMulti: PropTypes.bool,
    description: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    validate: PropTypes.func,
    onChange: PropTypes.func,
    control: PropTypes.func.isRequired,
};

export default ReactSelect;


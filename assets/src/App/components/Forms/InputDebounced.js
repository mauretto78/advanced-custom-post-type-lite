import React from 'react';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import useTranslation from "../../hooks/useTranslation";
import {debounce} from "../../utils/debounce";

const InputDebounced = ({type = 'text', size= 'default', placeholder, id, defaultValue, description, step, min, max, readOnly, onClick, onChangeCapture, validate, control, disabled = false, debounceTime = 1000}) => {

    return (
        <React.Fragment>
            <Controller
                render={({
                     field: { onChange, onBlur, value, name, ref },
                     fieldState: { invalid, isTouched, isDirty, error }
                 }) => (
                    <React.Fragment>
                        <input
                            type={type}
                            disabled={disabled}
                            min={min ? min : 0}
                            max={max}
                            step={step ? min : 1}
                            readOnly={readOnly}
                            aria-invalid={error ? "true" : "false"}
                            id={name}
                            name={name}
                            ref={ref}
                            placeholder={useTranslation("The field label, non latin characters are allowed")}
                            className={`form-control ${error ? 'has-errors': ''}`}
                            onChange={debounce((e) => {
                                onChangeCapture(e.target.value);
                                onChange(e.target.value);
                            }, debounceTime)}
                            onBlur={onBlur}
                            defaultValue={value}
                            onClick={onClick}
                        />
                        {error && <div className="invalid-feedback">{error.message}</div>}
                    </React.Fragment>
                )}
                control={control}
                id={id}
                name={id}
                defaultValue={defaultValue}
                rules={validate}
            />
        </React.Fragment>
    );
};

InputDebounced.propTypes = {
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
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.func,
    control: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf([
        'text',
        'email',
        'number',
        'tel',
        'url',
        'date',
        'time',
    ]),

};

export default InputDebounced;
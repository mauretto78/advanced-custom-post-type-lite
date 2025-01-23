import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const ColorPicker = ({id, defaultValue, description, validate, onChangeCapture, register, errors}) => {

    const error = get(errors, id);
    const [color, setColor] = useState(defaultValue);

    return (
        <React.Fragment>
            <div className="flex-column s-8">
                <div className="acpt-color-picker">
                    <input
                        id={id}
                        data-cy={`input-${id}`}
                        name={id}
                        type="color"
                        defaultValue={defaultValue}
                        onChangeCapture={(e) => {
                            setColor(e.target.value);

                            if(onChangeCapture){
                                onChangeCapture(e);
                            }
                        }}
                        aria-invalid={error ? "true" : "false"}
                        className={`${error ? 'has-errors': ''}`}
                        {...register(id, validate)}
                    />
                    <span className="color-value">{color}</span>
                </div>
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </React.Fragment>
    );
};

ColorPicker.propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    defaultValue: PropTypes.string,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
};

export default ColorPicker;

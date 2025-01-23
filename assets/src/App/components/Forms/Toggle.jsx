import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const Toggle = ({id, defaultValue = 0, description, validate, register, errors, onChangeCapture}) => {

    const error = get(errors, id);

    return (
        <div className="toggle-group">
            <label
                data-cy={`toggle-${id}`}
                className="toggle"
            >
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    data-cy={`toggle-checkbox-${id}`}
                    defaultChecked={defaultValue}
                    onChangeCapture={onChangeCapture}
                    {...register(id, validate)}
                />
                <span className="slider round"/>
            </label>
            {description && (
                <span className="form-description">{description}</span>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </div>
    );
};

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool,
    description: PropTypes.string,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
};

export default Toggle;
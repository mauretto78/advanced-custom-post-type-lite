import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import useTranslation from "../../hooks/useTranslation";

const Checkbox = ({id, values, description, validate, register, errors, valueAsArray = false}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <div className="flex-column s-8">
                {Object.keys(values).map((keyName, index) => {

                    return (
                        <label key={keyName} className="checkbox" htmlFor={`${id}_${index}`}>
                            <input
                                name={id}
                                value={values[keyName]['value']}
                                defaultChecked={values[keyName]['checked']}
                                aria-invalid={error ? "true" : "false"}
                                type="checkbox"
                                id={`${id}_${index}`}
                                {...register(valueAsArray ? `${id}[]` : `${id}_${index}`, {...validate})}
                            />
                            <span>
                            {useTranslation(keyName)}
                        </span>
                        </label>
                    );
                })}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </React.Fragment>
    );
};

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    values: PropTypes.objectOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        checked: PropTypes.bool,
    })).isRequired,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    valueAsArray: PropTypes.bool
};

export default Checkbox;



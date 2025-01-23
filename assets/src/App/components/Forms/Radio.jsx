import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';

const Radio = ({id, values, description, validate, register, style, errors}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <div className={`${style === 'inline' ? 'i-flex-center' : 'flex-column'} s-8`} style={{minHeight: "46px"}}>
                {Object.keys(values).map((keyName, index) => (
                    <label className="radio" htmlFor={`${id}_${index}`}>
                        <input
                            name={id}
                            value={values[keyName]['value']}
                            defaultChecked={values[keyName]['checked']}
                            aria-invalid={error ? "true" : "false"}
                            type="radio"
                            id={`${id}_${index}`}
                            {...register(id, {...validate})}
                        />
                        <span>
                            {values[keyName]['label']}
                        </span>
                    </label>
                ))}
                {error && <div className="invalid-feedback">{error.message}</div>}
            </div>
            {description && (
                <div className="form-description">{description}</div>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
        </React.Fragment>
    );
};

Radio.propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    style: PropTypes.string,
};

export default Radio;



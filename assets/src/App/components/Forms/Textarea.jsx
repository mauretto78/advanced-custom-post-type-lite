import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {sizes} from "../../constants/forms.jsx";

const Textarea = ({size= 'default', placeholder, id, defaultValue, description, readOnly, onChangeCapture, validate, register, errors, rows = 8, disabled = false, characterLimit = null}) => {

    const error = get(errors, id);
    const [currentValue, setCurrentValue] = useState(defaultValue);

    /**
     *
     * @return {string}
     */
    const getCharacterCounterClass = () => {

        if(!characterLimit || !currentValue){
            return '';
        }

        const currentValueLength = currentValue?.length ?? 0;
        const diff = characterLimit - currentValueLength;

        if(diff <= 3){
            return "color-danger";
        } else if(diff <= 10){
            return "color-warning";
        }

        return '';
    };

    return (
        <React.Fragment>
            <div className="acpt-textarea">
                <textarea
                    rows={rows ? rows : 8}
                    id={id}
                    data-testid={`textarea-${id}`}
                    name={id}
                    disabled={disabled}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChangeCapture={(e) => {
                        // Update the character limit message when the value changes
                        const allowed = () => {
                            if(characterLimit){
                                return e.target.value.length <= characterLimit;
                            }

                            return true;
                        };

                        if(allowed()){
                            setCurrentValue(e.target.value);
                        }

                        if(onChangeCapture){
                            onChangeCapture(e);
                        }
                    }}
                    readOnly={readOnly}
                    maxLength={characterLimit}
                    aria-invalid={error ? "true" : "false"}
                    className={`form-control ${size} ${error ? 'has-errors': ''}`}
                    {...register(id, validate)}
                />
                {characterLimit && (
                    <div className="acpt-character-limit mt-4">
                        <span className={getCharacterCounterClass()}>
                            {currentValue?.length ?? 0}
                        </span>
                        <span>/</span>
                        <span>{characterLimit}</span>
                    </div>
                )}
            </div>
            {error && <div className="invalid-feedback">{error.message}</div>}
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

Textarea.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    innerRef: PropTypes.func,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    readOnly: PropTypes.bool,
    onChangeCapture: PropTypes.func,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    rows: PropTypes.number,
    characterLimit: PropTypes.number,
};

export default Textarea;
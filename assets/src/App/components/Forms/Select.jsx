import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'react-hook-form';
import {sizes} from "../../constants/forms.jsx";
import {selectValuesPropType, inlineStyleShape} from "../../constants/propShapes.jsx";

const Select = ({size= 'default', placeholder, id, defaultValue, description, values, onChangeCapture, onBlur, validate, register, errors, disabled, muted, style}) => {

    const error = get(errors, id);

    /**
     *
     * @param value
     * @return {*}
     */
    const renderSelectElement = (value = null) => {
        const {onBlur: registerOnBlur, ...registerRest} = register(id, validate);

        return (
            <React.Fragment>
                <div
                    style={style}
                    className={`${!muted ? `acpt-select ${size} ${disabled ? 'disabled' : ''}` : ''}`}
                >
                    <select
                        id={id}
                        name={id}
                        data-testid={`select-${id}`}
                        defaultValue={value}
                        placeholder={placeholder}
                        onChangeCapture={onChangeCapture}
                        onBlur={(e) => {
                            registerOnBlur(e);
                            if (onBlur) onBlur(e);
                        }}
                        disabled={disabled}
                        aria-invalid={error ? "true" : "false"}
                        className={muted ? 'muted' :`form-control ${size} ${error ? 'has-errors': ''}`}
                        {...registerRest}
                    >
                        {values.map((value) => {

                            const renderOption = (option) => {

                                if(option.value === null){
                                    return (
                                        <option key={String(option.value)} value="">{option.label}</option>
                                    )
                                }

                                return (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                )
                            };

                            if(value.options){
                                return (
                                    <optgroup key={value.label} label={value.label} data-original={value.originalLabel ? value.originalLabel : value.label}>
                                        {value.options.map((option)=> renderOption(option))}
                                    </optgroup>
                                );
                            } else {
                                return renderOption(value);
                            }
                        })}
                    </select>
                </div>
                {error && <div data-testid={`select-error-${id}`} className="invalid-feedback">{error.message}</div>}
                {description && (
                    <div className="form-description">{description}</div>
                )}
            </React.Fragment>
        );
    };

    // Remount the <select> once both the defaultValue and the options are there: React applies
    // defaultValue only on mount, and options that arrive later (fetched in an effect) left it
    // showing the placeholder. Without distinct keys React reuses the same <div> and <select>
    // and only swaps the class, so nothing remounts (#1455).
    if(defaultValue && values.length > 0){
        return (
            <div key="with-values" className="acpt-select-wrapper-with-values" data-current-value={defaultValue}>
                {renderSelectElement(defaultValue)}
            </div>
        );
    }

    return (
        <div key="without-values" className="acpt-select-wrapper-without-values">
            {renderSelectElement()}
        </div>
    );
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    style: inlineStyleShape,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    description: PropTypes.string,
    isMulti: PropTypes.bool,
    disabled: PropTypes.bool,
    muted: PropTypes.bool,
    values: selectValuesPropType.isRequired,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    onChangeCapture: PropTypes.func,
    onBlur: PropTypes.func,
};

export default Select;
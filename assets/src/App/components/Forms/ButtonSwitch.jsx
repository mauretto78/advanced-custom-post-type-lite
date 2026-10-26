import React from 'react';
import PropTypes from 'prop-types';
import {Controller, get} from 'react-hook-form';
import {Icon} from '@iconify/react';
import {sizes} from "../../constants/forms.jsx";

const ButtonSwitch = ({id, size, icon, control, defaultValue = false, errors, disabled = false, externalOnChange, ariaLabel}) => {

    const error = get(errors, id);
    const iconSize = () => {
        switch (size) {
            case 'xs':
                return 14;

            case 'sm':
                return 16;

            default:
                return 18;
        }
    };

    return (
        <React.Fragment>
            <Controller
                control={control}
                name={id}
                defaultValue={defaultValue}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <React.Fragment>
                        <label className={`acpt-btn-switch ${defaultValue === true ? 'active' : ''} ${disabled === true ? 'disabled' : ''}`}>
                            <input
                                type="checkbox"
                                id={id}
                                disabled={disabled}
                                // Pre-existing (out of scope here): this tracks the `defaultValue`
                                // prop rather than the Controller's `value`. It works because every
                                // consumer feeds a watched value into `defaultValue`.
                                checked={defaultValue ? defaultValue : false}
                                aria-label={ariaLabel}
                                onBlur={onBlur}
                                onChange={(e) => {
                                    onChange(e.currentTarget.checked);
                                    externalOnChange && externalOnChange({
                                        id: id,
                                        checked: e.currentTarget.checked
                                    });
                                }}
                            />
                            <Icon icon={icon} width={iconSize()} />
                        </label>
                        {error && <div className="invalid-feedback">{error.message}</div>}
                    </React.Fragment>
                )}
            />
        </React.Fragment>
    );
};

ButtonSwitch.propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOf(sizes),
    control: PropTypes.object.isRequired,
    icon: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    externalOnChange: PropTypes.func,
    ariaLabel: PropTypes.string.isRequired,
};

export default ButtonSwitch;



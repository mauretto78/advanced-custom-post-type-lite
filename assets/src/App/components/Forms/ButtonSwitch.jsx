import React from 'react';
import PropTypes from 'prop-types';
import {Controller, get} from 'react-hook-form';
import {Icon} from '@iconify/react';

const ButtonSwitch = ({id, icon, control, defaultValue = false, errors, disabled = false, externalOnChange}) => {

    const error = get(errors, id);

    return (
        <React.Fragment>
            <Controller
                control={control}
                name={id}
                defaultValue={defaultValue}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <React.Fragment>
                        <input
                            className="hidden"
                            type="checkbox"
                            id={id}
                            disabled={disabled}
                            checked={defaultValue ? defaultValue : false}
                            onBlur={onBlur}
                            onChange={(e) => {
                                onChange(e.currentTarget.checked);
                                externalOnChange && externalOnChange({
                                    id: id,
                                    checked: e.currentTarget.checked
                                });
                            }}
                        />
                        <label htmlFor={id} className={`acpt-btn-switch ${defaultValue === true ? 'active' : ''} ${disabled === true ? 'disabled' : ''}`}>
                            <Icon icon={icon} width={18} />
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
    control: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool,
    errors: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    externalOnChange: PropTypes.func,
};

export default ButtonSwitch;



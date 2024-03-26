import React from 'react';
import PropTypes from 'prop-types';

const InputHidden = ({id, value, register}) => {

    return (
        <React.Fragment>
            <input
                id={id}
                name={id}
                type="hidden"
                value={value ? value : ''}
                {...register(id)}
            />
        </React.Fragment>
    );
};

InputHidden.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    register: PropTypes.func.isRequired
};

export default InputHidden;
import React from 'react';

const InputSubmit = ({id, label, loading}) => {

    return (
        <div className="form-group">
            <input
                className="btn btn-primary"
                id={id}
                value={(loading) ? 'loading...' : label}
                disabled={loading}
                type="submit" />
        </div>
    );
};

export default InputSubmit;


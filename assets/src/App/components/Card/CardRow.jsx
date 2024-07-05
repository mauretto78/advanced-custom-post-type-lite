import React from 'react';
import PropTypes from 'prop-types';

const CardRow = ({label, value, wizard}) => {

    return (
        <div className="acpt-card-row">
            <span className="label">
                <span>{label}</span>
                {wizard && (
                    <div
                        className="wizard"
                        dangerouslySetInnerHTML={{__html: wizard}}
                    />
                )}
            </span>
            <span className="value">
                {value}
            </span>
        </div>
    );
};

CardRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.element.isRequired,
    wizard: PropTypes.string,
};

export default CardRow;
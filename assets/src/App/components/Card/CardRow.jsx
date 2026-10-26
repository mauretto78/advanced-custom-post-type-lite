import React from 'react';
import PropTypes from 'prop-types';
import DangerousContent from "../DangerousContent";

const CardRow = ({label, value, wizard, layout = 'default'}) => {

    return (
        // A native wrapping <label> — with no htmlFor/id needed — is a valid
        // HTML association as long as the labelling text and the form
        // control are both descendants of it. `value` almost always holds
        // exactly one form control (Toggle, Input, Select, ...) that
        // otherwise has no accessible name at all in this pattern; for
        // non-form values (buttons, badges, plain text) the wrapping is
        // inert and harmless.
        <label className="acpt-card-row">
            <span className="label" style={layout === 'narrow' ? {width: "auto"} : {}}>
                <span>{label}</span>
                {wizard && (
                    <DangerousContent
                        element="span"
                        className="wizard"
                        content={wizard}
                    />
                )}
            </span>
            <span className="value">
                {value}
            </span>
        </label>
    );
};

CardRow.propTypes = {
    label: PropTypes.node.isRequired,
    value: PropTypes.node.isRequired,
    wizard: PropTypes.string,
    layout: PropTypes.oneOf([
        'default',
        'narrow',
    ]),
};

export default CardRow;
import React, {useState} from 'react';
import PropTypes from 'prop-types';

const ButtonGroup = ({buttons, activeBtn = 0}) => {

    const [activeButton, setActiveButton] = useState(activeBtn);

    return (
        <div className="acpt-button-group">
            {buttons && buttons.map((button, index) => (
                <span
                    onClick={() => setActiveButton(index)}
                    className={`btn ${index === activeButton ? 'active' : ''}`}
                >
                    {button}
                </span>
            ))}
        </div>
    );
};

ButtonGroup.propTypes = {
    buttons: PropTypes.arrayOf(<button/>),
    activeBtn: PropTypes.number
};

export default ButtonGroup;
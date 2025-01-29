import React, {useState} from 'react';
import PropTypes from 'prop-types';

const ButtonGroup = ({buttons, activeBtn}) => {

    const [activeButton, setActiveButton] = useState(activeBtn);

    return (
        <div className="acpt-button-group">
            {buttons && buttons.map((button) => {

                const view = button.props['data-view'] ? button.props['data-view'] : 'list';

                return (
                    <span
                        onClick={() => setActiveButton(view)}
                        className={`btn ${view === activeButton ? 'active' : ''}`}
                    >
                        {button}
                    </span>
                );
            })}
        </div>
    );
};

ButtonGroup.propTypes = {
    buttons: PropTypes.arrayOf(<button/>).isRequired,
    activeBtn: PropTypes.oneOf([
        "accordion",
        "list",
        "tabular"
    ]).isRequired,
};

export default ButtonGroup;
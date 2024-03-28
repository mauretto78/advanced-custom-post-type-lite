import React from 'react';
import PropTypes from 'prop-types';

const Card = ({title, style = 'with-shadow', actions, children}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    return (
        <div className={`acpt-card ${globals.is_rtl === true ? `rtl` : ``} ${style}`}>
            {title && (
                <div className="acpt-card-header">
                    <h3>{title}</h3>
                    {actions && (
                        <div className="actions">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className="acpt-card-body">
                <div className="responsive">
                    {children}
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    style: PropTypes.string,
    actions: PropTypes.element,
};

export default Card;
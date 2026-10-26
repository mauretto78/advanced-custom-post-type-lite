import React from 'react';
import PropTypes from 'prop-types';
import {isRTLOrientation} from "../../utils/misc";

const Card = ({title, titleTag: TitleTag = 'h3', style = '', actions, children, testId}) => {

    return (
        <div data-testid={testId ? testId : null} className={`acpt-card ${isRTLOrientation()} ${style}`}>
            {title && (
                <div className="acpt-card-header">
                    <TitleTag>{title}</TitleTag>
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
    titleTag: PropTypes.oneOf(['h2', 'h3', 'h4']),
    style: PropTypes.string,
    testId: PropTypes.string,
    actions: PropTypes.element,
};

export default Card;
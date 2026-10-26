import React from 'react';
import PropTypes from 'prop-types';
import {styleVariants} from "../../constants/styles";
import {Icon} from "@iconify/react";
import {inlineStyleShape} from "../../constants/propShapes.jsx";

const Badge = ({style = 'default', css, className, icon, children}) => {

    return (
        <span style={css ?? {}} className={`acpt-badge acpt-badge-${style} ${className ?? ''}`}>
            {icon ? (
                <span className="i-flex-center s-4">
                    <Icon icon={icon} width={14} />
                    <span>{children}</span>
                </span>
            ) : (
                children
            )}
        </span>
    );
};

Badge.propTypes = {
    css: inlineStyleShape,
    icon: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.oneOf(Object.values(styleVariants))
};

export default Badge;
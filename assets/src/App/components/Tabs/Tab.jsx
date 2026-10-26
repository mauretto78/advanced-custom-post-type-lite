import React from 'react';
import PropTypes from "prop-types";

const Tab = ({title, style, children}) => {
    return (
        <div>
            {children}
        </div>
    );
};

Tab.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    style: PropTypes.string,
    children: PropTypes.node,
};

export default Tab;
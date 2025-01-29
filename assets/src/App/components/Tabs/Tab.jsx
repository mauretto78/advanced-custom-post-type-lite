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
    title: PropTypes.string.isRequired,
};

export default Tab;
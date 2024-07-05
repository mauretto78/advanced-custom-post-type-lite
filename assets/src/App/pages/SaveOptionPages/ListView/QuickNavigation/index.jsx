import React from "react";
import PropTypes from 'prop-types';
import QuickNavigationPage from "./QuickNavigationPage";

const QuickNavigation = ({pages}) => {

    if(pages.length === 0){
        return null;
    }

    return (
        <React.Fragment>
            {pages.map((page, index) => (
                <QuickNavigationPage
                    index={index}
                    page={page}
                />
            ))}
        </React.Fragment>
    );
};

QuickNavigation.propTypes = {
    pages: PropTypes.array.isRequired,
};

export default QuickNavigation;
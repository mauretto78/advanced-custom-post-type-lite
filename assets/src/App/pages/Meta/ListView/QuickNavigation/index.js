import React from "react";
import PropTypes from 'prop-types';
import QuickNavigationBox from "./QuickNavigationBox";

const QuickNavigation = ({boxes}) => {

    if(typeof boxes === 'undefined' || boxes.length === 0){
        return null;
    }

    return (
        <React.Fragment>
            {boxes && boxes.map((box, index) => (
                <QuickNavigationBox
                    index={index}
                    box={box}
                />
            ))}
        </React.Fragment>
    );
};

QuickNavigation.propTypes = {
    boxes: PropTypes.array.isRequired,
};

export default QuickNavigation;
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {displayOptions, fieldGroupsDisplay} from "../../constants/fields.jsx";
import {styleVariants} from "../../constants/styles.jsx";
import Badge from "../Badge/index.jsx";
import useTranslation from "../../hooks/useTranslation";
const DisplayBadge = ({display}) => {

    let variant;
    let label;

    switch (display) {
        case fieldGroupsDisplay.STANDARD:
            variant = styleVariants.INFO;
            label = useTranslation("Standard view");
            break;
        case fieldGroupsDisplay.ACCORDION:
            variant = styleVariants.SUCCESS;
            label = useTranslation("Accordion");
            break;
        case fieldGroupsDisplay.HORIZONTAL_TABS:
            variant = styleVariants.WARNING;
            label = useTranslation("Horizontal tabs");
            break;
        case fieldGroupsDisplay.VERTICAL_TABS:
            variant = styleVariants.DANGER;
            label = useTranslation("Vertical tabs");
            break;
        default:
            break;
    }

    if(!variant){
        return null;
    }

    if(!label){
        return null;
    }

    return (
        <Badge style={variant}>
            {label}
        </Badge>
    );
}

DisplayBadge.propTypes = {
    // Not every meta group record has a `display` setting -- the switch
    // above already renders nothing for a missing/unrecognized value.
    display: PropTypes.oneOf([
        fieldGroupsDisplay.STANDARD,
        fieldGroupsDisplay.ACCORDION,
        fieldGroupsDisplay.HORIZONTAL_TABS,
        fieldGroupsDisplay.VERTICAL_TABS
    ]),
}

export default DisplayBadge;
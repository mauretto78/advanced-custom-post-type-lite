import React from 'react';
import PropTypes from 'prop-types';
import Badge from "../Badge";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";

const ElementTypeBadge = ({element}) => {

    let variant;
    let label;

    if(element.id === 'user_meta') {
        variant = styleVariants.DANGER;
        label = useTranslation("User");
    } else if(element.children){
        variant = (element.children.length > 0 || element.parentId === null) ? styleVariants.SECONDARY : styleVariants.WARNING;
        label = useTranslation((element.children.length > 0 || element.parentId === null) ? "Parent" : "Child");
    } else if(element.isNative){
        variant = styleVariants.SECONDARY;
        label = useTranslation("Native");
    } else if(element.isWooCommerce){
        variant = styleVariants.INFO;
        label = "WooCommerce";
    } else {
        variant = styleVariants.WARNING;
        label = useTranslation('Custom');
    }

    return (
        <Badge style={variant}>
            {label}
        </Badge>
    );
};

ElementTypeBadge.propTypes = {
    element: PropTypes.object.isRequired
};

export default ElementTypeBadge;
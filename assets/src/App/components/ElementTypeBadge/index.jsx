import React from 'react';
import PropTypes from 'prop-types';
import Badge from "../Badge";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";

const ElementTypeBadge = ({element}) => {

    let variant;
    let label;

    if(!element){
        return null;
    }

    if(element.id && element.id === 'user_meta') {
        variant = styleVariants.DANGER;
        label = useTranslation("User");
    } else if(element.parentSlug){
        variant = styleVariants.WARNING;
        label = useTranslation("Child");
    } else if(element.children){
        variant = (element.children.length > 0 || element.parentId === null) ? styleVariants.SECONDARY : styleVariants.WARNING;
        label = useTranslation((element.children.length > 0 || element.parentId === null) ? "Parent" : "Child");
    } else if(element.isNative){
        variant = styleVariants.SECONDARY;
        label = useTranslation("Native");
    } else if(element.isWooCommerce){
        variant = styleVariants.INFO;
        label = useTranslation("WooCommerce");
    } else {
        variant = styleVariants.PRIMARY;
        label = useTranslation("Custom");
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
};

ElementTypeBadge.propTypes = {
    element: PropTypes.shape(
        {
            id: PropTypes.string,
            children: PropTypes.arrayOf(PropTypes.object),
            parentId: PropTypes.string,
            isNative: PropTypes.bool,
            isWooCommerce: PropTypes.bool,
        }
    ).isRequired
};

export default ElementTypeBadge;
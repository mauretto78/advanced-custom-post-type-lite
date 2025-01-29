import {styleVariants} from "../constants/styles";
import {formActions, formActionsList} from "../constants/forms";
import Badge from "../components/Badge";
import React from "react";

/**
 *
 * @param record
 * @param metaKey
 * @param defaultValue
 * @return {*}
 */
export const getFormMetadataDefaultValue = (record, metaKey, defaultValue = null) => {

    if(record && record.meta.length > 0){
        const filtered = record.meta.filter(m => m.key === metaKey);

        return (filtered.length > 0) ? filtered[0].value : defaultValue;
    }

    return defaultValue;
};

 /**
 *
 * @param action
 * @return {*}
 */
 export const renderActionBadge = (action) => {

    let style = styleVariants.SECONDARY;

    switch (action) {
        case formActions.EMAIL:
            style = styleVariants.DANGER;
            break;


        case formActions.CUSTOM:
            style = styleVariants.WARNING;
            break;


        case formActions.PHP:
            style = styleVariants.INFO;
            break;


        case formActions.AJAX:
            style = styleVariants.SUCCESS;
            break;


        case formActions.FILL_META:
            style = styleVariants.PRIMARY;
            break;
    }

    const label = formActionsList.filter(f => f.value === action)[0].label;

    return <Badge style={style}>{label}</Badge>
};
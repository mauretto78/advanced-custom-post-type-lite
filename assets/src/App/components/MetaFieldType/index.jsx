import React from 'react';
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import {resolveField} from "../../utils/resolvers";

const MetaFieldType = ({fieldType, css}) => {

    const {icon, label} = resolveField(fieldType);

    return (
        <span className={`bg-white i-flex-center s-4 ${css ? css : ''}`}>
            <Icon icon={icon} width={18} />
            <span className="flex-shrink">{useTranslation(label)}</span>
        </span>
    );
};

MetaFieldType.propTypes = {
    css: PropTypes.string,
    fieldType: PropTypes.object.isRequired,
};

export default MetaFieldType;
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import {resolveField} from "../../utils/resolvers";
import {fieldTypes} from "../../constants/fields.jsx";

const MetaFieldType = ({fieldType, css}) => {

    const {icon, label} = resolveField(fieldType);

    return (
        <span className={`bg-white i-flex-center s-4 ${css ? css : ''}`}>
            <Icon icon={icon} width={14} />
            <span className="flex-shrink">{useTranslation(label)}</span>
        </span>
    );
};

MetaFieldType.propTypes = {
    css: PropTypes.string,
    // CanvasInlineFieldType (CCT root columns) also passes raw SQL column
    // types here for the "column type" badge -- resolveField() handles
    // both fieldTypes and columnTypes values by design.
    fieldType: PropTypes.oneOf([...Object.values(fieldTypes)]),
};

export default MetaFieldType;
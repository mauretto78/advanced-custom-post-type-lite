import React from 'react';
import PropTypes from 'prop-types';
import NameLabelInlineEdit from "../../../../components/CanvasLayout/NameLabelInlineEdit.jsx";
import {alphanumericallyValid} from "../../../../utils/validation.jsx";
import useProductFieldNameValidator from "../../../../hooks/useProductFieldNameValidator.jsx";
import useTranslation from "../../../../hooks/useTranslation.jsx";

/**
 * Inline canvas rename editor. WC product data fields have no separate
 * "label" — only name — so this is a name-only variant of the shared
 * <NameLabelInlineEdit>.
 */
const CanvasInlineFieldName = ({fieldIndex, name, hasErrors}) => {

    const formId = (key) => `fields.${fieldIndex}.${key}`;
    const checkIfNameIsValid = useProductFieldNameValidator({index: fieldIndex});

    return (
        <NameLabelInlineEdit
            formId={formId}
            name={name}
            hasErrors={hasErrors}
            nameOnly
            nameValidate={{alphanumericallyValid, checkIfNameIsValid}}
            namePlaceholder={useTranslation("Field slug")}
        />
    );
};

CanvasInlineFieldName.propTypes = {
    fieldIndex: PropTypes.number.isRequired,
    name:       PropTypes.string.isRequired,
    hasErrors:  PropTypes.bool,
};

export default CanvasInlineFieldName;

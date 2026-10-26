import React from 'react';
import PropTypes from 'prop-types';
import NameLabelInlineEdit from "../../../components/CanvasLayout/NameLabelInlineEdit.jsx";
import {alphanumericallyValid} from "../../../utils/validation.jsx";
import useMetaFieldNameValidator from "../../../hooks/useMetaFieldNameValidator.jsx";
import useTranslation from "../../../hooks/useTranslation.jsx";
import {metaFieldProps} from "../../../props/metaProps.js";

/**
 * Inline click-to-edit for a field's Label + Name, mirroring BasicTab's
 * Basic-options Label/Name/Auto-slug behaviour directly in the canvas.
 *
 * Thin adapter over the shared <NameLabelInlineEdit>: wires the meta-field
 * name-uniqueness validator (shared with the sidebar Basic tab).
 */
const CanvasInlineFieldName = ({name, label, hasErrors, formId, boxIndex, fieldIndex, field}) => {

    const checkIfNameIsValid = useMetaFieldNameValidator({boxIndex, fieldIndex, field});

    return (
        <NameLabelInlineEdit
            formId={formId}
            name={name}
            label={label}
            hasErrors={hasErrors}
            primaryField="name"
            nameValidate={{alphanumericallyValid, checkIfNameIsValid}}
            labelPlaceholder={useTranslation("Field label")}
            namePlaceholder={useTranslation("Field slug")}
        />
    );
};

CanvasInlineFieldName.propTypes = {
    name:       PropTypes.string.isRequired,
    label:      PropTypes.string,
    hasErrors:  PropTypes.bool,
    formId:     PropTypes.func.isRequired,
    boxIndex:   PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    field:      PropTypes.shape(metaFieldProps).isRequired,
};

export default CanvasInlineFieldName;

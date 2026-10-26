import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {useFormContext} from "react-hook-form";
import MetaFieldType from "../../../components/MetaFieldType/index.jsx";
import CanvasTypeTrigger from "../../../components/CanvasLayout/CanvasTypeTrigger.jsx";
import Select from "../../../components/Forms/Select.jsx";
import {fieldsList} from "../../../constants/fields.jsx";
import {fieldNestingLevel} from "../../../utils/fields.jsx";
import useFieldTypeChange from "../../../hooks/useFieldTypeChange.jsx";
import {metaFieldProps} from "../../../props/metaProps.js";

const CanvasInlineFieldType = ({field, boxId, formId}) => {

    const [isEditing, setIsEditing] = useState(false);
    const {group} = useSelector(state => state.metaState);
    const {register, formState: {errors}} = useFormContext();
    const changeType = useFieldTypeChange({boxId, field, formId});
    const nestingLevel = fieldNestingLevel(group.boxes, boxId, field.id);

    if (!isEditing) {
        return (
            <CanvasTypeTrigger onActivate={() => setIsEditing(true)}>
                <MetaFieldType
                    fieldType={field.type}
                    css="font-size-xs with-primary-border color-primary b-rounded py-4 px-8"
                />
            </CanvasTypeTrigger>
        );
    }

    return (
        <div
            role="presentation"
            onClick={e => e.stopPropagation()}
            onBlur={() => setIsEditing(false)}
            style={{minWidth: "160px"}}
        >
            <Select
                size="xs"
                // eslint-disable-next-line jsx-a11y/no-autofocus -- deliberate: focuses the type select only after the user's own click/keyboard activation opened this edit group, not on page load
                autoFocus
                register={register}
                id={formId("type")}
                errors={errors}
                defaultValue={field.type}
                values={fieldsList(nestingLevel)}
                onChangeCapture={e => {
                    changeType(e.target.value);
                    setIsEditing(false);
                }}
            />
        </div>
    );
};

CanvasInlineFieldType.propTypes = {
    field:  PropTypes.shape(metaFieldProps).isRequired,
    boxId:  PropTypes.string.isRequired,
    formId: PropTypes.func.isRequired,
};

export default CanvasInlineFieldType;

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {productFieldProps} from "../../../../props/wooCommerceProps.js";
import {useFormContext} from "react-hook-form";
import MetaFieldType from "../../../../components/MetaFieldType/index.jsx";
import CanvasTypeTrigger from "../../../../components/CanvasLayout/CanvasTypeTrigger.jsx";
import Select from "../../../../components/Forms/Select.jsx";
import {WooCommerceFieldsList} from "../../../../constants/woocommerce_fields.jsx";
import useProductFieldTypeChange from "../../../../hooks/useProductFieldTypeChange.jsx";

const CanvasInlineFieldType = ({field, fieldIndex}) => {

    const [isEditing, setIsEditing] = useState(false);
    const {register, formState: {errors}} = useFormContext();

    const formId = (key) => `fields.${fieldIndex}.${key}`;
    const changeType = useProductFieldTypeChange({field, formId});

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
                values={WooCommerceFieldsList}
                onChangeCapture={e => {
                    changeType(e.target.value);
                    setIsEditing(false);
                }}
            />
        </div>
    );
};

CanvasInlineFieldType.propTypes = {
    field:      PropTypes.shape(productFieldProps).isRequired,
    fieldIndex: PropTypes.number.isRequired,
};

export default CanvasInlineFieldType;

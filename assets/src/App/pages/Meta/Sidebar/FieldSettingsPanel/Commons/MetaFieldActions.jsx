import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../../hooks/useTranslation";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {canCopyTheField, getFormId, metaFieldFormId} from "../../../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {whiteColor} from "../../../../../utils/colors.jsx";
import {cloneField} from "../../../../../utils/cloners";
import {addField, unsetActiveElement} from "../../../../../redux/reducers/metaStateSlice";
import {delay} from "../../../../../utils/misc";
import {scrollToId} from "../../../../../utils/scroll";
import CopyMetaFieldModal from "../../../Modal/CopyMetaFieldModal";
import DeleteMetaFieldModal from "../../../Modal/DeleteMetaFieldModal";
import {fieldIsRepeater, fieldTypes} from "../../../../../constants/fields";
import {v4 as uuidv4} from "uuid";
import {metaFieldProps} from "../../../../../props/metaProps.js";

const MetaFieldActions = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, control } = useFormContext();
    const watchedField = useWatch({
        control,
        name: getFormId(group.boxes, boxId, field.id)
    });

    const watchedType = useWatch({
        control,
        name: metaFieldFormId(group.boxes, boxId, field.id,"type")
    });

    const { append } = useFieldArray({
        control,
        name: getFormId(group.boxes, boxId, field.id, false),
    });

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    const handleAddChildField = () => {

        const fieldId = uuidv4();
        const child = {
            id: fieldId,
            boxId: boxId,
            name: 'meta_box_field',
            label: 'meta box field',
            type: fieldTypes.TEXT,
            defaultValue: "",
            description: "",
            isRequired: false,
            showInArchive: false,
            quickEdit: false,
            filterableInAdmin: false,
            sort: 1,
            advancedOptions: [],
            options: [],
            blocks: [],
            blockId: null,
            validationRules: [],
            visibilityConditions: [],
            hasManyRelation: [],
            children: [],
            parentId: field.id,
            isATextualField: true,
            isFilterable: true,
            isSaved: false
        };

        dispatch(addField({boxId, parentFieldId: field.id, parentBlockId: null, field: child}));

        delay(1).then(()=>{
            scrollToId(`${fieldId}`);
        });
    };

    return (
        <span className="i-flex-center s-8">
            <button
                type="button"
                className="btn-reset"
                aria-label={useTranslation("Duplicate")}
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const duplicatedField = cloneField(boxId, watchedField, parentFieldId, parentBlockId);
                    dispatch(addField({boxId, field: duplicatedField, parentFieldId, parentBlockId}));
                    append(duplicatedField);

                    delay(1).then(()=>{
                        scrollToId(duplicatedField.id);
                    });
                }}
            >
                <Icon icon="bx:duplicate" width={14} />
            </button>
            {canCopyTheField(field.isSaved) && (
                <CopyMetaFieldModal field={field} />
            )}
            <DeleteMetaFieldModal
                boxId={boxId}
                fieldId={field.id}
                fieldIndex={fieldIndex}
                parentFieldId={parentFieldId}
                parentBlockId={parentBlockId}
                onAfterDelete={() => dispatch(unsetActiveElement())}
                trigger={
                    <button type="button" className="btn-reset delete-column-action" aria-label={useTranslation("Delete")}>
                        <Icon icon="bx-trash" width={14} color={whiteColor()} />
                    </button>
                }
            />
            {fieldIsRepeater(fieldType()) && (
                <button
                    type="button"
                    className="btn-reset"
                    aria-label={useTranslation("Add field")}
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddChildField();
                    }}
                >
                    <Icon icon="bx:plus-circle" width={14} />
                </button>
            )}
        </span>
    );
};

MetaFieldActions.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.shape(metaFieldProps).isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string
};

export default MetaFieldActions;

import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {canCopyTheField, getFormId, metaFieldFormId} from "../../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import Tooltip from "../../../../components/Tooltip";
import {cloneField} from "../../../../utils/cloners";
import {addBlock, addField, hideElement, showElement} from "../../../../redux/reducers/metaStateSlice";
import {delay} from "../../../../utils/misc";
import {scrollToId} from "../../../../utils/scroll";
import CopyMetaFieldModal from "../../Modal/CopyMetaFieldModal";
import DeleteMetaFieldModal from "../../Modal/DeleteMetaFieldModal";
import {saveIsClosed} from "../../../../utils/localStorage";
import MetaFieldShortCodeModal from "../../Modal/MetaFieldShortCodeModal";
import {fieldIsFlexible, fieldIsRepeater, fieldTypes} from "../../../../constants/fields";
import {v4 as uuidv4} from "uuid";

const MetaFieldActions = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group, closedElements} = useSelector(state => state.metaState);

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

    /**
     *
     * @return {boolean|boolean}
     */
    const showTheShortcode = () => {
        return fieldType() !== fieldTypes.REPEATER && fieldType() !== fieldTypes.FLEXIBLE;
    };

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        return filter.length === 1;
    };

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(field.id);

        if((isClosed())){
            dispatch(showElement({id: field.id}));
        } else {
            dispatch(hideElement({id: field.id}));
        }
    };

    const handleAddChildField = () => {

        const child = {
            id: uuidv4(),
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
    };

    const handleAddBlock = () => {

        const block = {
            id: uuidv4(),
            boxId: boxId,
            fieldId: field.id,
            label: 'new-block',
            name: 'new_block',
            fields: [],
            isSaved: false,
        };

        dispatch(addBlock({boxId, parentFieldId: field.id, block}));
    };

    return (
        <span className="i-flex-center s-8">
            {showTheShortcode() && (
                <Tooltip
                    label={
                        <MetaFieldShortCodeModal
                            boxId={boxId}
                            field={field}
                            parentFieldId={parentFieldId}
                            parentBlockId={parentBlockId}
                        />
                    }
                    tip={useTranslation("Show the shortcode")}
                    icon={false}
                />
            )}
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            const duplicatedField = cloneField(boxId, watchedField, parentFieldId, parentBlockId);
                            dispatch(addField({boxId, field: duplicatedField, parentFieldId, parentBlockId}));
                            append(duplicatedField);

                            delay(1).then(()=>{
                                scrollToId(duplicatedField.id);
                            });
                        }}
                    >
                        <Icon icon="bx:duplicate" width={18} />
                    </a>
                }
                tip={useTranslation("Duplicate this meta field")}
                icon={false}
            />
            {canCopyTheField(field.isSaved) && (
                <Tooltip
                    label={
                        <CopyMetaFieldModal
                            field={field}
                        />
                    }
                    tip={useTranslation("Copy this meta field")}
                    icon={false}
                />
            )}
            <Tooltip
                label={
                    <DeleteMetaFieldModal
                        boxId={boxId}
                        fieldId={field.id}
                        fieldIndex={fieldIndex}
                        parentFieldId={parentFieldId}
                        parentBlockId={parentBlockId}
                    />
                }
                tip={useTranslation("Delete this meta field")}
                icon={false}
            />
            {fieldIsRepeater(fieldType()) && (
                <Tooltip
                    label={
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleAddChildField();
                            }}
                        >
                            <Icon icon="bx:plus-circle" width={18} />
                        </a>
                    }
                    tip={useTranslation("Add field")}
                    icon={false}
                />
            )}
            {fieldIsFlexible(fieldType()) && (
                <Tooltip
                    label={
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleAddBlock();
                            }}
                        >
                            <Icon icon="bx:plus-circle" width={18} />
                        </a>
                    }
                    tip={useTranslation("Add block")}
                    icon={false}
                />
            )}
            <Tooltip
                label={
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            handleToggleClose();
                        }}
                    >
                        <Icon icon="bx:expand-alt" width={18} />
                    </a>
                }
                tip={useTranslation("Hide/show this meta field")}
                icon={false}
            />
        </span>
    );
};

MetaFieldActions.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string
};

export default MetaFieldActions;
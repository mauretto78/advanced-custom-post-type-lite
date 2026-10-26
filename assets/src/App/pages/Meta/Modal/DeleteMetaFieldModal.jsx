import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch, useSelector} from "react-redux";
import {deleteField} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../utils/fields";

const DeleteMetaFieldModal = ({boxId, fieldId, fieldIndex, parentFieldId, parentBlockId, trigger, onAfterDelete}) => {

    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: getFormId(group.boxes, boxId, fieldId, false),
    });

    // The `fieldIndex` prop is the field's position among a *filtered* sibling list
    // (CanvasBox's root-level fields, or CanvasElementChildren's repeater children) --
    // not necessarily its real position in the box's flat `fields` array (fields are
    // stored flat post-flattenFields, with parentId/blockId tags, not nested). Since
    // getFormId(..., false) always resolves to that one flat array regardless of
    // nesting, remove() must be called with the field's real flat index, or it silently
    // removes whichever unrelated field happens to sit at the filtered-sibling index.
    const box = group.boxes?.find(b => b.id === boxId);
    const flatIndex = box?.fields?.findIndex(f => f.id === fieldId);
    const removeIndex = (typeof flatIndex === 'number' && flatIndex !== -1) ? flatIndex : fieldIndex;

    return (
        <DeleteModal
            title={useTranslation('Confirm deleting meta field')}
            trigger={trigger}
            onConfirm={() => {
                dispatch(deleteField({boxId, parentFieldId, parentBlockId, fieldId}));
                remove(removeIndex);
                if (onAfterDelete) onAfterDelete();
            }}
            onCancel={() => {}}
        >
            {useTranslation("Are you sure?")}
        </DeleteModal>
    );
};

DeleteMetaFieldModal.propTypes = {
    boxId:         PropTypes.string.isRequired,
    fieldId:       PropTypes.string.isRequired,
    fieldIndex:    PropTypes.number.isRequired,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    trigger:       PropTypes.element,
    onAfterDelete: PropTypes.func,
};

export default DeleteMetaFieldModal;

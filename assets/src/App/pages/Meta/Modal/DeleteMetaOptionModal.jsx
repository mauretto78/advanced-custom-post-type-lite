import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch, useSelector} from "react-redux";
import {deleteOption} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../utils/fields";

const DeleteMetaOptionModal = ({boxId, fieldId, optionId, parentFieldId, optionIndex, trigger}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: `${getFormId(group.boxes, boxId, fieldId)}.options`,
    });

    return (
        <DeleteModal
            title={useTranslation('Confirm deleting option')}
            trigger={trigger}
            onConfirm={() => {
                dispatch(deleteOption({boxId, fieldId, parentFieldId, optionId}));
                remove(optionIndex);
            }}
            onCancel={() => {}}
        >
            {useTranslation("Are you sure?")}
        </DeleteModal>
    );
};

DeleteMetaOptionModal.propTypes = {
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    optionId: PropTypes.string.isRequired,
    optionIndex: PropTypes.number.isRequired,
    trigger: PropTypes.element,
};

export default DeleteMetaOptionModal;

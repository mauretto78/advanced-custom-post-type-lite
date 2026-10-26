import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch} from "react-redux";
import {deleteBox, unsetActiveBox, unsetActiveElement} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";

const DeleteMetaBoxModal = ({index, boxId, trigger, onAfterDelete}) => {

    const dispatch = useDispatch();

    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: "boxes",
    });

    return (
        <DeleteModal
            title={useTranslation('Confirm deleting meta box')}
            trigger={trigger}
            onConfirm={() => {
                dispatch(deleteBox(boxId));
                dispatch(unsetActiveElement());
                dispatch(unsetActiveBox());
                remove(index);
                if (onAfterDelete) onAfterDelete();
            }}
            onCancel={() => {}}
        >
            {useTranslation("Are you sure?")}
        </DeleteModal>
    );
};

DeleteMetaBoxModal.propTypes = {
    index:         PropTypes.number.isRequired,
    boxId:         PropTypes.string.isRequired,
    trigger:       PropTypes.element,
    onAfterDelete: PropTypes.func,
};

export default DeleteMetaBoxModal;

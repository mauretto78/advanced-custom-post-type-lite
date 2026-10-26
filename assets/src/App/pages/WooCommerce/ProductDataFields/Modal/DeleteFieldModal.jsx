import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {deleteField, unsetActiveElement} from "../../../../redux/reducers/productDataFieldsStateSlice";

const DeleteFieldModal = ({fieldId, fieldIndex, trigger}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state — keep RHF field array in sync when deleting
    const {control} = useFormContext();
    const {remove} = useFieldArray({
        control,
        name: "fields",
    });

    return (
        <DeleteModal
            testId={`delete-field-${fieldId}`}
            title={useTranslation('Confirm deleting field')}
            trigger={trigger}
            onConfirm={() => {
                dispatch(deleteField({field: {id: fieldId}}));
                dispatch(unsetActiveElement());
                remove(fieldIndex);
            }}
            onCancel={() => {}}
        >
            {useTranslation("Are you sure?")}
        </DeleteModal>
    );
};

DeleteFieldModal.propTypes = {
    fieldId:    PropTypes.string.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    trigger:    PropTypes.element,
};

export default DeleteFieldModal;

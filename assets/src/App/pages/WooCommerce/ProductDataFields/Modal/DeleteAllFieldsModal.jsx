import React from "react";
import useTranslation from "../../../../hooks/useTranslation";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import {useDispatch} from "react-redux";
import {useFormContext} from "react-hook-form";
import {deleteAllFields, deselectAllElements} from "../../../../redux/reducers/productDataFieldsStateSlice";

const DeleteAllFieldsModal = () => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { setValue } = useFormContext();

    return (
        <DeleteModal
            testId="delete-all-product-data-fields"
            title={useTranslation('Confirm deleting all')}
            onConfirm={() => {
                dispatch(deleteAllFields());
                dispatch(deselectAllElements());
                setValue("fields", []);
            }}
            onCancel={() => {}}
            trigger={
                <Button
                    testId="delete-all-product-data-fields-trigger"
                    style={styleVariants.OUTLINED_DANGER}
                    size="sm"
                    icon="bx:trash"
                >
                    {useTranslation("Delete all")}
                </Button>
            }
        >
            {useTranslation("Are you sure?")}
        </DeleteModal>
    );
};

export default DeleteAllFieldsModal;

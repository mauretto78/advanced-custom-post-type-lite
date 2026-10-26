import React from "react";
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deleteAllBoxes, deselectAllElements} from "../../../redux/reducers/metaStateSlice";
import {useFormContext} from "react-hook-form";

const DeleteAllMetaBoxesModal = () => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { unregister } = useFormContext();

    return (
        <DeleteModal
            title={useTranslation('Confirm deleting all')}
            onConfirm={() => {
                dispatch(deleteAllBoxes());
                dispatch(deselectAllElements());
                unregister("boxes");
            }}
            onCancel={() => {}}
            trigger={
                <Button
                    type="button"
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

export default DeleteAllMetaBoxesModal;

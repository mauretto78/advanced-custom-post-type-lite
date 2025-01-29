import React, {useState} from "react";
import useTranslation from "../../../../hooks/useTranslation";
import Modal from "../../../../components/Modal";
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

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    
    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteAllFields());
            dispatch(deselectAllElements());
            setValue("fields", []);
            setModalOpen(!modalOpen);
        }}>
            {useTranslation("Yes")}
        </Button>,
        <Button style={styleVariants.DANGER} onClick={(e) => {
            e.preventDefault();
            setModalOpen(!modalOpen);
        }}>
            {useTranslation("No")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Confirm deleting all')}
                visible={modalOpen}
                buttons={buttons}
            >
                {useTranslation("Are you sure?")}
            </Modal>
            <Button
                style={styleVariants.DANGER}
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Delete all")}
            </Button>
        </React.Fragment>
    );
};


export default DeleteAllFieldsModal;

import React, {useState} from "react";
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {useFormContext} from "react-hook-form";
import {deleteAllPages} from "../../../redux/reducers/optionPagesStateSlice";

const DeleteAllPagesModal = () => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { unregister } = useFormContext();

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    
    const buttons = [
        <Button
            testId="confirm-delete-all-pages"
            style={styleVariants.SUCCESS}
            onClick={(e) => {
                e.preventDefault();
                dispatch(deleteAllPages());
                unregister("pages");
                setModalOpen(!modalOpen);
            }}
        >
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
                testId="delete-all-pages"
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

export default DeleteAllPagesModal;

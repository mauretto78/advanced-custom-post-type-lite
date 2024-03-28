import React, {useState} from "react";
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deleteAllBoxes} from "../../../redux/reducers/metaStateSlice";
import {useFormContext} from "react-hook-form";

const DeleteAllMetaBoxesModal = () => {

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    
    // manage form state
    const { unregister } = useFormContext();

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteAllBoxes());
            unregister("boxes");
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
                type="button"
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

export default DeleteAllMetaBoxesModal;

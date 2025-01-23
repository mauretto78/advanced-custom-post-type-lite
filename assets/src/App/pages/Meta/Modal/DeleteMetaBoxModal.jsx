import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deleteBox} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {Icon} from "@iconify/react";

const DeleteMetaBoxModal = ({index, boxId, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: "boxes",
    });

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteBox(boxId));
            remove(index);
            setModalOpen(!modalOpen);

            if(setActiveTab){
                setActiveTab(0);
            }
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
                title={useTranslation('Confirm deleting meta box')}
                visible={modalOpen}
                buttons={buttons}
            >
                {useTranslation("Are you sure?")}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx-trash" width={18} color="#F94144" />
            </a>
        </React.Fragment>
    );
};

DeleteMetaBoxModal.propTypes = {
    setActiveTab: PropTypes.func,
    index: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
};

export default DeleteMetaBoxModal;

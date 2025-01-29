import React, {useState} from "react";
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import useTranslation from "../../../../hooks/useTranslation";
import Modal from "../../../../components/Modal";
import {deleteField} from "../../../../redux/reducers/productDataFieldsStateSlice";
import {Icon} from "@iconify/react";

const DeleteProductDataFieldModal = ({field, index}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: "fields",
    });

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteField({field}));
            remove(index);
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
                title={useTranslation('Confirm deleting option')}
                visible={modalOpen}
                buttons={buttons}
            >
                {useTranslation("Are you sure?")}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);;
                }}
            >
                <Icon icon="bx-trash" width={18} color="#F94144" />
            </a>
        </React.Fragment>
    );
};

DeleteProductDataFieldModal.propTypes = {
    index: PropTypes.number.isRequired,
    field: PropTypes.object.isRequired
};

export default DeleteProductDataFieldModal;
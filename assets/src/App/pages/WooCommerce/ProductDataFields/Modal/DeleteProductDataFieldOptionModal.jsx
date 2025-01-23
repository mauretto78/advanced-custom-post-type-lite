import React, {useState} from "react";
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import useTranslation from "../../../../hooks/useTranslation";
import Modal from "../../../../components/Modal";
import {deleteOption} from "../../../../redux/reducers/productDataFieldsStateSlice";
import {Icon} from "@iconify/react";
import Tooltip from "../../../../components/Tooltip";

const DeleteProductDataFieldOptionModal = ({fieldIndex, optionIndex}) => {

    // manage global state
    const dispatch = useDispatch();

    const formId = () => {
        return `fields.${fieldIndex}.options`;
    };

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: formId(),
    });

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteOption({fieldIndex, optionIndex}));
            remove(optionIndex);
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
        <span>
            <Modal
                title={useTranslation('Confirm deleting option')}
                visible={modalOpen}
                buttons={buttons}
            >
                {useTranslation("Are you sure?")}
            </Modal>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Tooltip
                    icon={false}
                    tip={useTranslation("Delete")}
                    label={<Icon icon="bx-trash" width={18} color="#F94144" />}
                />
            </a>
        </span>
    );
};

DeleteProductDataFieldOptionModal.propTypes = {
    fieldIndex: PropTypes.number.isRequired,
    optionIndex: PropTypes.number.isRequired
};

export default DeleteProductDataFieldOptionModal;
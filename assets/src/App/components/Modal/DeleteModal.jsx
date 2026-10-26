import React, {useState} from "react";
import PropTypes from 'prop-types';
import Modal from "./index";
import Button from "../Button";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";

const DeleteModal = ({ title, onConfirm, onCancel, children, testId, trigger }) => {

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    const buttons = [
        <Button
            testId={testId ? `cancel-${testId}` : undefined}
            style={styleVariants.OUTLINED_SECONDARY}
            size="sm"
            icon="bx:arrow-back"
            key="cancel"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(false);
                onCancel();
            }}
        >
            {useTranslation("No")}
        </Button>,
        <Button
            style={styleVariants.DANGER}
            size="sm"
            icon="bx:trash"
            key="confirm"
            testId={testId ? `confirm-${testId}` : undefined}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(false);
                onConfirm();
            }}
        >
            {useTranslation("Yes")}
        </Button>,
    ];

    const triggerElement = trigger
        ? React.cloneElement(trigger, {
            onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(true);
            }
        })
        : (
            <button
                type="button"
                className={`btn-reset color-${styleVariants.DANGER}`}
                data-testid={testId ? testId : null}
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Delete")}
            </button>
        );

    return (
        <React.Fragment>
            <Modal
                title={title}
                visible={modalOpen}
                buttons={buttons}
                testId={testId}
            >
                {children}
            </Modal>
            {triggerElement}
        </React.Fragment>
    );
};

DeleteModal.propTypes = {
    title: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    children: PropTypes.node,
    testId: PropTypes.string,
    trigger: PropTypes.element,
};

export default DeleteModal;

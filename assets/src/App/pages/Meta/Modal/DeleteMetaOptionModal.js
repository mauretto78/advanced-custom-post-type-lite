import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {deleteOption} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../utils/fields";
import {Icon} from "@iconify/react";
import Tooltip from "../../../components/Tooltip";

const DeleteMetaOptionModal = ({boxId, fieldId, optionId, parentFieldId, optionIndex}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const formId = () => {
        return `${getFormId(group.boxes, boxId, fieldId)}.options`;
    };

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: formId(),
    });

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deleteOption({boxId, fieldId, parentFieldId, optionId}));
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
                    label={<Icon icon="bx-minus"/>}
                />
            </a>
        </span>
    );
};

DeleteMetaOptionModal.propTypes = {
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string,
    optionId: PropTypes.string.isRequired,
    optionIndex: PropTypes.number.isRequired
};

export default DeleteMetaOptionModal;

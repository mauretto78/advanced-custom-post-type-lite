import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useFormContext} from "react-hook-form";
import {deleteBlock} from "../../../redux/reducers/metaStateSlice";
import {getFormId} from "../../../utils/fields";
import {Icon} from "@iconify/react";

const DeleteMetaBlockModal = ({boxId, parentFieldId, blockId, blockIndex}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const formId = () => {
        return getFormId(group.boxes, boxId, blockId, false);
    };

    // manage local state
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
            dispatch(deleteBlock({boxId, parentFieldId, blockId}));
            remove(blockIndex);
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
                title={useTranslation('Confirm deleting block')}
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

DeleteMetaBlockModal.propTypes = {
    boxId: PropTypes.string.isRequired,
    parentFieldId: PropTypes.string.isRequired,
    blockId: PropTypes.string.isRequired,
};

export default DeleteMetaBlockModal;
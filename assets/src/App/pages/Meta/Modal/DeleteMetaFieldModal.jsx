import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {deleteField} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../utils/fields";
import {Icon} from "@iconify/react";

const DeleteMetaFieldModal = ({boxId, fieldId, fieldIndex, parentFieldId, parentBlockId, setActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const formId = () => {
        return getFormId(group.boxes, boxId, fieldId, false);
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
            dispatch(deleteField({boxId, parentFieldId, parentBlockId, fieldId}));
            remove(fieldIndex);
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
                title={useTranslation('Confirm deleting meta field')}
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

DeleteMetaFieldModal.propTypes = {
    setActiveTab: PropTypes.func,
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
};

export default DeleteMetaFieldModal;

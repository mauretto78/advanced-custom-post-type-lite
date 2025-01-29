import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch, useSelector} from "react-redux";
import {deletePermission} from "../../../redux/reducers/metaStateSlice";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getFormId} from "../../../utils/fields";
import {Icon} from "@iconify/react";
import Tooltip from "../../../components/Tooltip";

const DeletePermissionElementModal = ({boxId, fieldId, permissionId, permissionIndex, parentFieldId}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    const formId = () => {
        return `${getFormId(group.boxes, boxId, fieldId)}.permissions`;
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
            dispatch(deletePermission({boxId, fieldId, parentFieldId, permissionId}));
            remove(permissionIndex);
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
        <div>
            <Modal
                title={useTranslation('Confirm deleting permission element')}
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
        </div>
    );
};

DeletePermissionElementModal.propTypes = {
    boxId: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    permissionId: PropTypes.string.isRequired,
    permissionIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string,
};

export default DeletePermissionElementModal;

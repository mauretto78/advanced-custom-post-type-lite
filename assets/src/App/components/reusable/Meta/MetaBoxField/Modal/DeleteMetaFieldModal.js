import React from 'react';
import {deleteField} from "../../../../../redux/actions/metaStateActions";
import Modal from "../../../Modal";
import {useDispatch} from "react-redux";

const DeleteMetaFieldModal = ({id, boxId, fieldName, modalVisible, setModalVisible, deleteMetadataOption}) => {

    // manage global state
    const dispatch = useDispatch();

    return (
        <Modal title={`Confirm deleting field "${fieldName}"`} visible={modalVisible}>
            <p>You are going to delete this meta field definition. Are you sure?</p>
            {deleteMetadataOption === "1" && typeof parentId === 'undefined' && (
                <div className="acpt-alert acpt-alert-warning">
                    WARNING: This action will delete all the post metadata related to this field. The action is irreversible.
                </div>
            )}
            <p className="acpt-buttons">
                <a
                    href="#"
                    className="acpt-btn acpt-btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(deleteField(boxId, id));
                    }}
                >
                    Yes
                </a>
                <a
                    href="#"
                    className="acpt-btn acpt-btn-primary-o"
                    onClick={(e) => {
                        e.preventDefault();
                        setModalVisible(!modalVisible);
                    }}
                >
                    No
                </a>
            </p>
        </Modal>
    );
};

export default DeleteMetaFieldModal;
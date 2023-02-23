import React from 'react';
import {deleteBox} from "../../../../../redux/actions/metaStateActions";
import Modal from "../../../Modal";
import {useDispatch} from "react-redux";

const DeleteMetaBoxModal = ({id, boxName, modalVisible, setModalVisible, deleteMetadataOption}) => {

    // manage global state
    const dispatch = useDispatch();

    return (
        <Modal title={`Confirm deleting box "${boxName}"`} visible={modalVisible}>
            <p>You are going to delete this meta box definition. Every field definition inside of it will be deleted. Are you sure?</p>
            {deleteMetadataOption === "1" && (
                <div className="acpt-alert acpt-alert-warning">
                    WARNING: This action will delete all the post metadata related with this box. The action is irreversible.
                </div>
            )}
            <p className="acpt-buttons">
                <a
                    href="#"
                    className="acpt-btn acpt-btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(deleteBox(id));
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

export default DeleteMetaBoxModal;
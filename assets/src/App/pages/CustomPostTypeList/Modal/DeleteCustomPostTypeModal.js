import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import Alert from "../../../components/Alert";
import {filterByLabel} from "../../../utils/objects";
import {useDispatch} from "react-redux";
import {deleteCustomPostType} from "../../../redux/reducers/deleteCustomPostTypeSlice";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";

const DeleteCustomPostTypeModal = ({postType}) => {

    const globals = document.globals;
    const settings = globals.settings;
    const deletePostsOption = filterByLabel(settings, 'key', 'delete_posts').value;

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    // manage redirect
    const navigate = useNavigate();

    const handleDeletePostType = () => {
        dispatch(deleteCustomPostType(postType, 'all'))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    navigate('/');
                    setModalOpen(!modalOpen);
                    toast.success(useTranslation("Custom post type successfully deleted. The browser will refresh after 5 seconds."));
                    refreshPage(5000);
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => {
                toast.error(err);
            })
        ;
    };

    const buttons = [
        <Button
            style={styleVariants.DANGER}
            onClick={() => {
                handleDeletePostType();
            }}
        >
            {useTranslation("Yes, delete it")}
        </Button>,
        <Button
            style={styleVariants.SECONDARY}
            onClick={() => {
                setModalOpen(!modalOpen);
            }}
        >
            {useTranslation("Return back to list")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal title={useTranslation('Delete custom post type')} buttons={buttons} visible={modalOpen}>
                <div>
                    {useTranslation("You are going to delete this custom post type. Are you sure?")}
                </div>
                {deletePostsOption && (
                    <div className="mt-24">
                        <Alert style={styleVariants.WARNING}>
                            {useTranslation("WARNING: This action will delete all posts and metadata for this post type. The action is irreversible.")}
                        </Alert>
                    </div>
                )}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Delete")}
            </a>
        </React.Fragment>
    );
};

DeleteCustomPostTypeModal.propTypes = {
    postType: PropTypes.string.isRequired,
};

export default DeleteCustomPostTypeModal;
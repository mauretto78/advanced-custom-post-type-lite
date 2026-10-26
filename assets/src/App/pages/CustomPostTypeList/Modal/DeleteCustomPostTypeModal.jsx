import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {styleVariants} from "../../../constants/styles";
import Alert from "../../../components/Alert";
import {filterByLabel} from "../../../utils/objects";
import {useDispatch} from "react-redux";
import {deleteCustomPostType} from "../../../redux/reducers/deleteCustomPostTypeSlice";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";
import {useFormContext} from "react-hook-form";
import {setCookieMessage} from "../../../utils/cookies";
import {getErrorMessage} from "../../../utils/errors";

const DeleteCustomPostTypeModal = ({postType, page, perPage}) => {

    const globals = document.globals;
    const settings = globals.settings;
    const deletePostsOption = filterByLabel(settings, 'key', 'delete_posts').value;

    // manage form state
    const { reset } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    const handleDeletePostType = () => {
        dispatch(deleteCustomPostType({postType, mode: 'all'}))
            .then(res => {
                const payload = res.payload;
                if(payload.success){
                    reset();
                    setCookieMessage("Custom post type successfully deleted.");
                    refreshPage();
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => {
                toast.error(getErrorMessage(err));
            });
    };

    return (
        <DeleteModal
            title={useTranslation('Delete custom post type')}
            onConfirm={handleDeletePostType}
            onCancel={() => {}}
        >
            <div>{useTranslation("You are going to delete this custom post type. Are you sure?")}</div>
            {deletePostsOption !== 0 && (
                <div className="mt-24">
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation("WARNING: This action will delete all posts and metadata for this post type. The action is irreversible.")}
                    </Alert>
                </div>
            )}
        </DeleteModal>
    );
};

DeleteCustomPostTypeModal.propTypes = {
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    postType: PropTypes.string.isRequired,
};

export default DeleteCustomPostTypeModal;

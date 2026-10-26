import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch} from "react-redux";
import {deleteMeta} from "../../../redux/reducers/deleteMetaSlice";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {filterByLabel} from "../../../utils/objects";
import {useFormContext} from "react-hook-form";
import {setCookieMessage} from "../../../utils/cookies";
import {refreshPage} from "../../../utils/misc";

const DeleteMetaModal = ({page, id}) => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;

    // manage form state
    const { reset } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    // manage redirect
    const navigate = useNavigate();

    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;

    const handleDeleteModal = () => {
        dispatch(deleteMeta(id))
            .then(res => {
                const payload = res.payload;
                if(payload.success){
                    reset();
                    navigate('/meta');
                    setCookieMessage("Meta group successfully deleted.");
                    refreshPage();
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <DeleteModal
            title={useTranslation('Delete meta group')}
            onConfirm={handleDeleteModal}
            onCancel={() => {}}
        >
            <div>{useTranslation("You are going to delete this meta group. Are you sure?")}</div>
        </DeleteModal>
    );
};

DeleteMetaModal.propTypes = {
    page: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
};

export default DeleteMetaModal;

import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch} from "react-redux";
import {deleteTaxonomy} from "../../../redux/reducers/deleteTaxonomySlice";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";
import {useFormContext} from "react-hook-form";
import {setCookieMessage} from "../../../utils/cookies";
import {getErrorMessage} from "../../../utils/errors";

const DeleteTaxonomyModal = ({taxonomy, page, perPage}) => {

    // manage form state
    const { reset } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    const handleDeleteTaxonomy = () => {
        dispatch(deleteTaxonomy(taxonomy))
            .then(res => {
                const payload = res.payload;
                if(payload.success){
                    reset();
                    setCookieMessage("Taxonomy successfully deleted.");
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
            title={useTranslation('Delete Taxonomy')}
            onConfirm={handleDeleteTaxonomy}
            onCancel={() => {}}
        >
            <div>{useTranslation("You are going to delete this taxonomy. Are you sure?")}</div>
        </DeleteModal>
    );
};

DeleteTaxonomyModal.propTypes = {
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    taxonomy: PropTypes.string.isRequired,
};

export default DeleteTaxonomyModal;

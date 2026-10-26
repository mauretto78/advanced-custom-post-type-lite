import React from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import DeleteModal from "../../../components/Modal/DeleteModal";
import {useDispatch} from "react-redux";
import {deleteWooCommerceProductData} from "../../../redux/reducers/deleteWooCommerceProductDataSlice";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../../utils/cookies";
import {refreshPage} from "../../../utils/misc";
import {getErrorMessage} from "../../../utils/errors";

const DeleteWooCommerceProductDataModal = ({id, page, perPage}) => {

    // manage global state
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteWooCommerceProductData(id))
            .then(res => {
                const payload = res.payload;
                if(payload.success){
                    setCookieMessage("WooCommerce product data successfully deleted");
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
            title={useTranslation('Delete WooCommerce product data')}
            onConfirm={handleDelete}
            onCancel={() => {}}
        >
            <div>{useTranslation("You are going to delete WooCommerce this product data. Are you sure?")}</div>
        </DeleteModal>
    );
};

DeleteWooCommerceProductDataModal.propTypes = {
    id: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
};

export default DeleteWooCommerceProductDataModal;

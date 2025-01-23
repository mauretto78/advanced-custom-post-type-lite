import React, {useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deleteWooCommerceProductData} from "../../../redux/reducers/deleteWooCommerceProductDataSlice";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../../utils/cookies";
import {refreshPage} from "../../../utils/misc";

const DeleteWooCommerceProductDataModal = ({id, page, perPage}) => {

    // manage global state
    const dispatch = useDispatch();
    
    // mange local state
    const [modalVisible, setModalVisible] = useState(false);
    
    const handleDelete = () => {
        dispatch(deleteWooCommerceProductData(id))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    setModalVisible(!modalVisible);
                    setCookieMessage("WooCommerce product data successfully deleted");
                    refreshPage();
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
                handleDelete();
            }}
        >
            {useTranslation("Yes, delete it")}
        </Button>,
        <Button
            style={styleVariants.SECONDARY}
            onClick={() => {
                setModalVisible(!modalVisible);
            }}
        >
            {useTranslation("Return back to list")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal title={useTranslation('Delete WooCommerce product data')} buttons={buttons} visible={modalVisible}>
                <div>
                    {useTranslation("You are going to delete WooCommerce this product data. Are you sure?")}
                </div>
            </Modal>
            <a
                className={`color-${styleVariants.DANGER}`}
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalVisible(!modalVisible);
                }}
            >
                {useTranslation("Delete")}
            </a>
        </React.Fragment>
    );
};

DeleteWooCommerceProductDataModal.propTypes = {
    id: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
};

export default DeleteWooCommerceProductDataModal;
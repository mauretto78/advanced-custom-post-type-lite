import React, {useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {useDispatch} from "react-redux";
import {deleteMeta} from "../../../redux/reducers/deleteMetaSlice";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {fetchMeta} from "../../../redux/reducers/fetchMetaSlice";
import {filterByLabel} from "../../../utils/objects";
import {useFormContext} from "react-hook-form";

const DeleteMetaModal = ({page, id}) => {

    const documentGlobals = document.globals;
    const settings = documentGlobals.settings;

    // manage form state
    const { reset } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const [modalVisible, setmodalVisible] = useState(false);
    
    // manage redirect
    const navigate = useNavigate();

    const handleDeleteModal = () => {
        dispatch(deleteMeta(id))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    reset();
                    navigate('/meta');
                    setmodalVisible(!modalVisible);
                    toast.success(useTranslation("Meta group successfully deleted."));
                    dispatch(fetchMeta({
                        page: page ? page : 1,
                        perPage: perPage
                    }));
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => console.error(err))
        ;
    };

    const buttons = [
        <Button
            style={styleVariants.DANGER}
            onClick={() => {
                handleDeleteModal();
            }}
        >
            {useTranslation("Yes, delete it")}
        </Button>,
        <Button
            style={styleVariants.SECONDARY}
            onClick={() => {
                setmodalVisible(!modalVisible);
            }}
        >
            {useTranslation("Return back to list")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal title={useTranslation('Delete meta group')} buttons={buttons} visible={modalVisible}>
                <div>
                    {useTranslation("You are going to delete this meta group. Are you sure?")}
                </div>
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setmodalVisible(!modalVisible);
                }}
            >
                {useTranslation("Delete")}
            </a>
        </React.Fragment>
    );
};

DeleteMetaModal.propTypes = {
    page: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
};

export default DeleteMetaModal;


import React, {useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {deleteTaxonomy} from "../../../redux/reducers/deleteTaxonomySlice";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";

const DeleteTaxonomyModal = ({taxonomy}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage redirect
    const navigate = useNavigate();

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    
    const handleDeleteTaxonomy = () => {
        dispatch(deleteTaxonomy(taxonomy))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    navigate('/taxonomies');
                    setModalOpen(!modalOpen);
                    toast.success(useTranslation("Taxonomy successfully deleted. The browser will refresh after 5 seconds."));
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
                handleDeleteTaxonomy();
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
            <Modal title={useTranslation('Delete Taxonomy')} buttons={buttons} visible={modalOpen}>
                <div>
                    {useTranslation("You are going to delete this taxonomy. Are you sure?")}
                </div>
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

DeleteTaxonomyModal.propTypes = {
    taxonomy: PropTypes.string.isRequired,
};

export default DeleteTaxonomyModal;
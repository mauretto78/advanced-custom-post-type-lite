import React, {useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {useDispatch} from "react-redux";
import {deletePage} from "../../../redux/reducers/optionPagesStateSlice";

import {useFieldArray, useFormContext} from "react-hook-form";
import {Icon} from "@iconify/react";

const DeletePageModal = ({page, index, parentPageIndex, parentSetActiveTab}) => {

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    /**
     *
     * @return {string}
     */
    const formId = () => {
        if(page.parentId){
            return `pages.${parentPageIndex}.children`;
        }

        return `pages`;
    };

    // manage form state
    const { control } = useFormContext();
    const { remove } = useFieldArray({
        control,
        name: formId(),
    });

    const buttons = [
        <Button style={styleVariants.SUCCESS} onClick={(e) => {
            e.preventDefault();
            dispatch(deletePage({page:page}));
            setModalOpen(!modalOpen);

            if(parentSetActiveTab){
                parentSetActiveTab(0);
            }

            remove(index);
        }}>
            {useTranslation("Yes")}
        </Button>,
        <Button style={styleVariants.DANGER} onClick={(e) => {
            e.preventDefault();
            setModalOpen(!modalOpen);
        }}>
            {useTranslation("No")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Confirm deleting page')}
                visible={modalOpen}
                buttons={buttons}
            >
                {useTranslation("Are you sure?")}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx-trash" width={18} />
            </a>
        </React.Fragment>
    );
};

DeletePageModal.propTypes = {
    index: PropTypes.number.isRequired,
    parentPageIndex: PropTypes.number,
    page: PropTypes.object.isRequired,
    parentSetActiveTab: PropTypes.func,
};

export default DeletePageModal;

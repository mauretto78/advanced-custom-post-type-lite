import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";

const CopyMetaBoxModal = ({box}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [deleteBox, setDeleteBox] = useState(false);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setDeleteBox(false);
    }, [modalOpen]);

    const handleSubmit = () => {
        wpAjaxRequest('copyMetaBoxAction', {
                boxId: box.id,
                targetGroupId: group,
                delete: deleteBox
            })
            .then(res => {
                if(res.success){
                    toast.success(`${useTranslation("Meta box was successfully copied")}.${useTranslation("The browser will refresh after 5 seconds.")}`);
                    setModalOpen(!modalOpen);
                    refreshPage(5000);
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.err(err))
        ;
    };

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Copy this meta box')}
                visible={modalOpen}
                buttons={[]}
            >
                <div className="flex-column s-24">
                    <div>
                        <label
                            className="form-label i-flex-center s-4"
                            htmlFor="group"
                        >
                            {useTranslation("Meta group")}
                        </label>
                        <div className="acpt-select">
                            <select
                                id="group"
                                className="form-control default"
                                onChangeCapture={e => setGroup(e.target.value) }
                            >
                                {globals.find.meta.map((g) => (
                                    <option value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {group && group !== 'Select' && (
                        <div>
                            <div className="w-100 i-flex-center s-4 mb-8">
                                <input type="checkbox" defaultValue={deleteBox} onClick={() => setDeleteBox(!deleteBox)} id="deleteBox" />
                                <label htmlFor="deleteBox">
                                    {useTranslation("Delete the meta box after copying")}
                                </label>
                            </div>
                            <Button
                                onClick={() => handleSubmit() }
                                style={styleVariants.PRIMARY}
                            >
                                {useTranslation("Copy")}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
            <a
                href=""
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:copy" width={18} />
            </a>
        </React.Fragment>
    );
};

CopyMetaBoxModal.propTypes = {
    box: PropTypes.object.isRequired,
};

export default CopyMetaBoxModal;


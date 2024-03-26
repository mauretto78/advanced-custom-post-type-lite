import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import useTranslation from "../../../hooks/useTranslation";
import {refreshPage} from "../../../utils/misc";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import Modal from "../../../components/Modal";

const CopyMetaBlocksModal = ({blockIds, modalOpen, setModalOpen}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // mange local state
    const [group, setGroup] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [fields, setFields] = useState([]);
    const [targetFieldId, setTargetFieldId] = useState(null);
    const [deleteBlocks, setDeleteBlocks] = useState(false);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlocks(false);
    }, [modalOpen]);

    const handleGroupChange = (groupId) => {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlocks(false);

        wpAjaxRequest('fetchMetaAction', {
            id: groupId
        })
            .then(res => {
                setBoxes(res.boxes);
            })
            .catch(err => console.err(err))
        ;
    };

    const handleBoxChange = (boxId) => {
        setFields([]);
        const filteredFields = boxes.filter(b => b.id === boxId)[0].fields;
        setFields(filteredFields);
    };

    const handleFieldChange = (fieldId) => {
        setTargetFieldId(fieldId);
    };

    const handleSubmit = () => {

        let blockIdsArray = [];
        blockIds.map((b)=> { blockIdsArray.push(b.id); });

        wpAjaxRequest('copyMetaBlocksAction', {
            blockIds: blockIdsArray,
            targetFieldId: targetFieldId,
            delete: deleteBlocks
        })
            .then(res => {
                if(res.success){
                    toast.success(`${useTranslation("Meta block was successfully copied")}.${useTranslation("The browser will refresh after 5 seconds.")}`);
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
        <Modal
            title={useTranslation('Copy selected meta blocks')}
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
                            onChangeCapture={e => handleGroupChange(e.target.value) }
                        >
                            {globals.find.meta.map((g) => (
                                <option value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {boxes && boxes.length > 0 && (
                    <div>
                        <label
                            className="form-label i-flex-center s-4"
                            htmlFor="box"
                        >
                            {useTranslation("Meta box")}
                        </label>
                        <div className="acpt-select">
                            <select
                                id="box"
                                className="form-control default"
                                onChangeCapture={e => handleBoxChange(e.target.value) }
                            >
                                <option value={null}>{useTranslation("Select")}</option>
                                {boxes.map((b) => (
                                    <option value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                {fields.length > 0 && (
                    <div>
                        <label
                            className="form-label i-flex-center s-4"
                            htmlFor="field"
                        >
                            {useTranslation("Meta field")}
                        </label>
                        <div className="acpt-select">
                            <select
                                id="field"
                                className="form-control default"
                                onChangeCapture={e => handleFieldChange(e.target.value) }
                            >
                                <option value={null}>{useTranslation("Select")}</option>
                                {fields.map((f) => (
                                    <option value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                {targetFieldId && (
                    <div>
                        <div className="w-100 i-flex-center s-4 mb-8">
                            <input type="checkbox" defaultValue={deleteBlocks} onClick={() => setDeleteBlocks(!deleteBlocks)} id="deleteBlocks" />
                            <label htmlFor="deleteBlocks">
                                {useTranslation("Delete the meta block after copying")}
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
    );
};

CopyMetaBlocksModal.propTypes = {
    blockIds: PropTypes.array.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    setModalOpen: PropTypes.func.isRequired,
};

export default CopyMetaBlocksModal;
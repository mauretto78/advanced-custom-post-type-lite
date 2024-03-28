import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import useTranslation from "../../../hooks/useTranslation";
import {refreshPage} from "../../../utils/misc";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {Icon} from "@iconify/react";

const CopyMetaBlockModal = ({block}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [fields, setFields] = useState([]);
    const [targetFieldId, setTargetFieldId] = useState(null);
    const [deleteBlock, setDeleteBlock] = useState(false);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlock(false);
    }, [modalOpen]);

    const handleGroupChange = (groupId) => {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlock(false);

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
        wpAjaxRequest('copyMetaBlockAction', {
            blockId: block.id,
            targetFieldId: targetFieldId,
            delete: deleteBlock
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
        <React.Fragment>
            <Modal
                title={useTranslation('Copy this meta block')}
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
                                <input type="checkbox" defaultValue={deleteBlock} onClick={() => setDeleteBlock(!deleteBlock)} id="deleteBlock" />
                                <label htmlFor="deleteBlock">
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
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:copy" width={18} />
            </a>
        </React.Fragment>
    );
};

CopyMetaBlockModal.propTypes = {
    block: PropTypes.object.isRequired,
};

export default CopyMetaBlockModal;
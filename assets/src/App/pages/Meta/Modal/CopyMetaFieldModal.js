import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {fieldTypes} from "../../../constants/fields";

const CopyMetaFieldModal = ({field}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [fields, setFields] = useState([]);
    const [targetEntityType, setTargetEntityType] = useState(null);
    const [targetEntityId, setTargetEntityId] = useState(null);
    const [deleteField, setDeleteField] = useState(false);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteField(false);
    }, [modalOpen]);

    const handleGroupChange = (groupId) => {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteField(false);

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
        setTargetEntityType("box");
        setTargetEntityId(boxId);

        const filteredFields = boxes.filter(b => b.id === boxId)[0].fields;

        if(filteredFields.length > 0){
            const nestableFields = filteredFields.filter(f => (f.type === fieldTypes.REPEATER || f.type === fieldTypes.FLEXIBLE));

            if(nestableFields.length > 0){
                setFields(nestableFields);
            }
        }
    };

    const handleFieldChange = (fieldId) => {
        setTargetEntityType("field");
        setTargetEntityId(fieldId);
    };

    const handleSubmit = () => {
        wpAjaxRequest('copyMetaFieldAction', {
            fieldId: field.id,
            targetEntityType: targetEntityType,
            targetEntityId: targetEntityId,
            delete: deleteField
        })
            .then(res => {
                if(res.success){
                    toast.success(`${useTranslation("Meta field was successfully copied")}.${useTranslation("The browser will refresh after 5 seconds.")}`);
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
                title={useTranslation('Copy this meta field')}
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
                    {targetEntityType && targetEntityId && (
                        <div>
                            <div className="w-100 i-flex-center s-4 mb-8">
                                <input type="checkbox" defaultValue={deleteField} onClick={() => setDeleteField(!deleteField)} id="deleteField" />
                                <label htmlFor="deleteField">
                                    {useTranslation("Delete the meta field after copying")}
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

CopyMetaFieldModal.propTypes = {
    field: PropTypes.object.isRequired,
};

export default CopyMetaFieldModal;


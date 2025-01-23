import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import Modal from "../../../components/Modal";
import {useFormContext} from "react-hook-form";
import {useParams} from "react-router-dom";
import {fetchMeta} from "../../../redux/reducers/fetchMetaSlice";
import {hydrateState} from "../../../redux/reducers/metaStateSlice";
import {useDispatch} from "react-redux";

const CopyMetaBlocksModal = ({blockIds, modalOpen, setModalOpen}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    const { setValue } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    // mange local state
    const {id} = useParams();
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
            .catch(err => console.error(err))
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

                    if(id === group){
                        dispatch(fetchMeta({
                            id: id
                        }))
                            .then(res => {
                                dispatch(hydrateState(res.payload));

                                // Set initial values
                                setValue('id', id);
                                setValue('name', res.payload.name);
                                setValue('label', res.payload.label);
                                setValue('display', res.payload.display);
                                res.payload.belongs && res.payload.belongs.map((belong, index) => {
                                    setValue(`belongs.${index}.id`, belong.id);
                                    setValue(`belongs.${index}.belongsTo`, belong.belongsTo);
                                    setValue(`belongs.${index}.operator`, belong.operator);
                                    setValue(`belongs.${index}.find`, belong.find);
                                    setValue(`belongs.${index}.logic`, belong.logic);
                                });
                                res.payload.boxes && res.payload.boxes.map((box, index) => {
                                    setValue(`boxes.${index}`, box);
                                });
                            })
                            .catch(err => {
                                console.error(err);
                            });
                        ;
                    }

                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.error(err))
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
                {fields && fields.length > 0 && (
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
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {useDispatch} from "react-redux";
import {fetchMeta} from "../../../redux/reducers/fetchMetaSlice";
import {hydrateState} from "../../../redux/reducers/metaStateSlice";
import {useFormContext} from "react-hook-form";
import {metaFieldProps} from "../../../props/metaProps.js";
import {hydrateFormBoxes} from "../../../utils/flattenFields.jsx";

const CopyMetaFieldModal = ({field}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    const { setValue } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    // mange local state
    const {id} = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [fields, setFields] = useState([]);
    const [nestedFields, setNestedFields] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [targetEntityType, setTargetEntityType] = useState(null);
    const [targetEntityId, setTargetEntityId] = useState(null);
    const [deleteField, setDeleteField] = useState(false);
    const [position, setPosition] = useState(null);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setNestedFields([]);
        setBlocks([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setPosition(null);
        setDeleteField(false);
    }, [modalOpen]);

    const handleGroupChange = (groupId) => {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setNestedFields([]);
        setBlocks([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setPosition(null);
        setDeleteField(false);

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

        setNestedFields([]);
        setBlocks([]);
        setTargetEntityType("box");
        setTargetEntityId(boxId);

        const filteredFields = boxes.filter(b => b.id === boxId)[0].fields;

        setFields(filteredFields);

        if(filteredFields && filteredFields.length > 0){
            const nestableFields = filteredFields.filter(f => (false));

            if(nestableFields && nestableFields.length > 0){
                setNestedFields(nestableFields);
            }
        }
    };

    const handleFieldChange = (fieldId) => {
        setTargetEntityType("field");
        setTargetEntityId(fieldId);

        const filteredBlocks = nestedFields.filter(f => f.id === fieldId)[0].blocks;

        if(filteredBlocks && filteredBlocks.length > 0){
            setBlocks(filteredBlocks);
        }
    };

    const handleBlockChange = (blockId) => {
        setTargetEntityType("block");
        setTargetEntityId(blockId);
    };

    const handleSubmit = () => {

        wpAjaxRequest('copyMetaFieldAction', {
            fieldId: field.id,
            targetEntityType: targetEntityType,
            targetEntityId: targetEntityId,
            delete: deleteField,
            position: position
        })
            .then(res => {
                if(res.success){
                    // The modal closes in place, so a cookie message would only
                    // surface on the next navigation -- toast immediately instead.
                    toast.success(`${useTranslation("Meta field was successfully copied")}.`);
                    setModalOpen(!modalOpen);

                    if(id === field.groupId){
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
                                // flatten (see ticket #1231) so a submit right after this
                                // reload doesn't clobber Repeater/Flexible children with []
                                res.payload.boxes && hydrateFormBoxes(res.payload.boxes).forEach((box, index) => {
                                    setValue(`boxes.${index}`, box);
                                });
                            })
                            .catch(err => {
                                toast.error(`${useTranslation("Something went wrong, please retry.")}`);
                            });
                        ;
                    }

                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => {
                toast.error(`${useTranslation("Something went wrong, please retry.")}`);
            })
        ;
    };

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Copy this meta field')}
                visible={modalOpen}
                setVisible={setModalOpen}
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
                                    <option key={g.value} value={g.value}>
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
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {nestedFields && nestedFields.length > 0 && (
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
                                    {nestedFields.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {blocks && blocks.length > 0 && (
                        <div>
                            <label
                                className="form-label i-flex-center s-4"
                                htmlFor="block"
                            >
                                {useTranslation("Meta block")}
                            </label>
                            <div className="acpt-select">
                                <select
                                    id="block"
                                    className="form-control default"
                                    onChangeCapture={e => handleBlockChange(e.target.value) }
                                >
                                    <option value={null}>{useTranslation("Select")}</option>
                                    {blocks.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {targetEntityType && targetEntityId && (
                        <React.Fragment>
                            <div>
                                <label
                                    className="form-label i-flex-center s-4"
                                    htmlFor="position"
                                >
                                    {useTranslation("Copy after")}
                                </label>
                                <div className="acpt-select">
                                    <select
                                        id="position"
                                        className="form-control default"
                                        onChangeCapture={e => setPosition(e.target.value) }
                                    >
                                        <option value={null}>{useTranslation("Select")}</option>
                                        {fields.map((field, index) => (
                                            <option key={field.id ?? index} value={index}>
                                                {field.label ?? field.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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
                        </React.Fragment>
                    )}
                </div>
            </Modal>
            <button
                type="button"
                className="btn-reset"
                aria-label={useTranslation("Copy")}
                onClick={(e) => {
                    e.preventDefault();
                    // Without this the click bubbles to the canvas-root onClick
                    // (Canvas/index.jsx), which unsets the active element and
                    // unmounts this modal before `modalOpen` can render it.
                    e.stopPropagation();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:copy" width={14} />
            </button>
        </React.Fragment>
    );
};

CopyMetaFieldModal.propTypes = {
    field: PropTypes.shape(metaFieldProps).isRequired,
};

export default CopyMetaFieldModal;


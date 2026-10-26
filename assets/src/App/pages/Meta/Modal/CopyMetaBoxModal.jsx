import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import {Icon} from "@iconify/react";
import {primaryColor} from "../../../utils/colors.jsx";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {useFormContext} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchMeta} from "../../../redux/reducers/fetchMetaSlice";
import {hydrateState} from "../../../redux/reducers/metaStateSlice";
import {setCookieMessage} from "../../../utils/cookies.jsx";
import {metaBoxProps} from "../../../props/metaProps.js";

const CopyMetaBoxModal = ({box}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    const { setValue, getValues } = useFormContext();

    // manage global state
    const dispatch = useDispatch();

    // mange local state
    const {id} = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [deleteBox, setDeleteBox] = useState(false);
    const [position, setPosition] = useState(null);

    // reset state on open modal
    useEffect(() => {
        setGroup(null);
        setDeleteBox(false);
    }, [modalOpen]);

    const handleGroupChange = (groupId) => {
        setGroup(groupId);

        if(groupId === box.groupId){
            setBoxes(getValues()?.boxes);
        } else {
            wpAjaxRequest('fetchMetaAction', {
                id: groupId
            })
                .then(res => {
                    setBoxes(res.boxes);
                })
                .catch(err => console.error(err))
            ;
        }
    };

    const handleSubmit = () => {
        wpAjaxRequest('copyMetaBoxAction', {
            boxId: box.id,
            targetGroupId: group,
            delete: deleteBox,
            position: position
        })
            .then(res => {
                if(res.success){
                    setCookieMessage(`${useTranslation("Meta box was successfully copied")}.`);
                    setModalOpen(!modalOpen);

                    if(id === box.groupId){
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
                                onChangeCapture={e => {
                                    handleGroupChange(e.target.value);
                                }}
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
                                        {boxes.map((box, index) => (
                                            <option value={index}>
                                                {box.label ?? box.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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
                        </React.Fragment>
                    )}
                </div>
            </Modal>
            <button
                type="button"
                className="btn-reset"
                aria-label={useTranslation("Copy")}
                onClick={e => {
                    e.preventDefault();
                    // Without this the click bubbles to the canvas-root onClick
                    // (Canvas/index.jsx), which unsets the active element and
                    // unmounts this modal before `modalOpen` can render it.
                    e.stopPropagation();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:copy" width={18} color={primaryColor()} />
            </button>
        </React.Fragment>
    );
};

CopyMetaBoxModal.propTypes = {
    box: PropTypes.shape(metaBoxProps).isRequired,
};

export default CopyMetaBoxModal;

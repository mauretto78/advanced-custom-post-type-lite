import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Modal from "../../../components/Modal";
import useTranslation from "../../../hooks/useTranslation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import CopyElement from "../../../components/CopyElement";
import {useFormContext, useWatch} from "react-hook-form";
import Tooltip from "../../../components/Tooltip";
import {useSelector} from "react-redux";
import {getFormId} from "../../../utils/fields";
import {wpAjaxRequest} from "../../../utils/ajax";
import {Icon} from "@iconify/react";

const MetaFieldShortCodeModal = ({boxId, field, parentFieldId, parentBlockId}) => {

    // manage global state
    const {group} = useSelector(state => state.metaState);
    const boxIndex = group.boxes.findIndex(b => b.id === boxId);
    const formId = getFormId(group.boxes, boxId, field.id);
    const formIdArray = formId.split('.');

    // mange local state
    const [loading, isLoading] = useState(false);
    const [shortCodes, setShortCodes] = useState([]);
    const [metaKey, setMetaKey] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    
    // manage form state
    const { control } = useFormContext();
    const watchedBelongs = useWatch({
        control,
        name: `belongs`
    });
    const watchedBoxName = useWatch({
        control,
        name: `boxes.${boxIndex}.name`
    });
    const watchedField = useWatch({
        control,
        name: formId
    });
    const watchedFieldRootName = useWatch({
        control,
        name: `boxes.${boxIndex}.fields.${formIdArray[3]}.name`
    });

    let watchedParentBlock = null;
    let watchedParentField = null;
    let indexInfo = formIdArray[(formIdArray.length-1)];
    let blockIndexInfo = (parentBlockId) ? formIdArray[(formIdArray.length-3)] : null;

    if(parentBlockId){
        watchedParentBlock = useWatch({
            control,
            name: getFormId(group.boxes, boxId, parentBlockId)
        });
    }

    if(parentFieldId){
        watchedParentField = useWatch({
            control,
            name: getFormId(group.boxes, boxId, parentFieldId)
        });
    }

    useEffect(() => {
        if(modalOpen){
            isLoading(true);

            wpAjaxRequest("calculateShortCodeAction", {
                belongsTo: watchedBelongs,
                boxName: watchedBoxName,
                fieldId: field.id,
                fieldName: watchedField ? watchedField.name : field.name,
                fieldRootName: watchedFieldRootName,
                parentBlockName: watchedParentBlock ? watchedParentBlock.name : null,
                parentFieldName: watchedParentField ? watchedParentField.name : null,
                index: indexInfo,
                blockIndexInfo: blockIndexInfo
            })
                .then(res => {
                    setMetaKey(res.metaKey);
                    setShortCodes(res.shortcodes);
                    isLoading(false);
                })
                .catch(err => {
                    console.error(err.message);
                    isLoading(false);
                })
            ;
        }
    }, [modalOpen]);

    const buttons = [
        <Button style={styleVariants.DANGER} onClick={(e) => {
            e.preventDefault();
            setModalOpen(!modalOpen);
        }}>
            {useTranslation("Close")}
        </Button>,
    ];

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Shortcode preview')}
                visible={modalOpen}
                padding={0}
                buttons={buttons}
            >
                {loading ? (
                    <div className="b-bottom-1 p-24">
                        {useTranslation("Loading...")}
                    </div>
                ) : (
                    <React.Fragment>
                        {metaKey && (
                            <div className="b-bottom-1 p-24">
                                <div className="mb-8 color-black">
                                    <Tooltip
                                        label={useTranslation("Meta-key")}
                                        tip={
                                            <div className="flex-column s-8 color-gray">
                                                <div>{useTranslation("This is the meta-key of this field.")}</div>
                                                <div>{useTranslation("Use it in functions like get_post_meta() to retrieve saved meta field data.")}</div>
                                            </div>
                                        }
                                    />
                                </div>
                                <CopyElement text={metaKey}/>
                            </div>
                        )}
                        {shortCodes && shortCodes.length > 0 && (
                            <div className="p-24">
                                <div className="mb-8 color-black">
                                    <Tooltip
                                        label={shortCodes && shortCodes.length > 1 ? useTranslation("Shortcodes") : useTranslation("Shortcode")}
                                        tip={
                                            <div className="flex-column s-8 color-gray">
                                                <div>{useTranslation("Use this shortcode to display the meta field on your frontend.")}</div>
                                            </div>
                                        }
                                    />
                                </div>
                                {shortCodes && (
                                    <div className="flex-column s-8">
                                        {shortCodes.map((shortCode)=>(
                                            <CopyElement text={shortCode}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                )}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:code-alt" width={18} />
            </a>
        </React.Fragment>
    );
};

MetaFieldShortCodeModal.propTypes = {
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
};

export default MetaFieldShortCodeModal;
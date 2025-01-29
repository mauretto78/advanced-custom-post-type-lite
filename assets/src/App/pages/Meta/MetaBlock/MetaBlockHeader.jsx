import React, {useState} from "react";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {get, useFormContext, useWatch} from "react-hook-form";
import useTranslation from "../../../hooks/useTranslation";
import InputHidden from "../../../components/Forms/InputHidden";
import {useDispatch, useSelector} from "react-redux";
import Input from "../../../components/Forms/Input";
import {alphanumericallyValid} from "../../../utils/validation";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import Tooltip from "../../../components/Tooltip";
import {saveIsClosed} from "../../../utils/localStorage";
import {hideElement, showElement} from "../../../redux/reducers/metaStateSlice";
import {getFormId} from "../../../utils/fields";
import {slugify, transliterate} from 'transliteration';
import ElementSelector from "../BulkActions/ElementSelector";
import MetaBlockActions from "./Commons/MetaBlockActions";

const MetaBlockHeader = ({boxId, block, listeners, attributes, formId, boxIndex, blockIndex, parentFieldIndex, parentFieldId}) => {

    // manage global state
    const {group, closedElements, selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, register, control, resetField, setValue } = useFormContext();

    const watchedBlock = useWatch({
        control,
        name: getFormId(group.boxes, boxId, block.id),
    });
    const watchedName = useWatch({
        control,
        name: formId("name")
    });
    const watchedLabel = useWatch({
        control,
        name: formId("label")
    });

    // manage local state
    const [autoSlug, setAutoSlug] = useState(true);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === block.id);

        return filter.length === 1;
    };

    /**
     *
     * @return {string|*}
     */
    const name = () => {

        const id = formId("name");
        const error = get(errors, id);

        if(error){
            return (
                <span className="invalid-feedback">
                    {useTranslation(error.message)}
                </span>
            );
        }

        return watchedName ? watchedName : block.name;
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {
        return watchedLabel ? watchedLabel : block.label;
    };

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [formVisible, setFormVisible] = useState(false);

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(block.id);

        if((isClosed())){
            dispatch(showElement({id: block.id}));
        } else {
            dispatch(hideElement({id: block.id}));
        }
    };

    /**
     *
     * @return {boolean}
     */
    const canCopyTheBlock = () => {

        if(typeof block.isSaved !== 'undefined' && block.isSaved === false){
            return false
        }

        return true;
    };

    return (
        <div className="flex-between s-8 for-xs">
            <InputHidden
                id={formId("id")}
                value={block.id}
                register={register}
            />
            <span className="i-flex-center s-8">
                <Tooltip
                    label={<Icon icon="hugeicons:blockchain-01" color="#A972CA" width={18} />}
                    tip={useTranslation(`Child block`)}
                    icon={false}
                />
                <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                    <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                </span>
                {selectedElementsType !== 'box' && selectedElementsType !== 'field' && canCopyTheBlock() && (
                    <ElementSelector
                        elementType="block"
                        element={{
                            id: block.id,
                            boxId: boxId,
                            parentFieldId: parentFieldId
                        }}
                    />
                )}
                <h3 className={`${!formVisible ? '' : 'hidden'}`}>
                    {name()}
                </h3>
                <span className={`color-gray ${!formVisible ? '' : 'hidden'}`}>
                    {label()}
                </span>
                <div className={`i-flex-center s-8 ${formVisible ? '' : 'hidden'}`}>
                    <div>
                        <Input
                            size="sm"
                            id={formId("label")}
                            placeholder={useTranslation("Block label, non latin chars allowed.")}
                            defaultValue={block.label}
                            register={register}
                            errors={errors}
                            onChangeCapture={e => {
                                if(autoSlug){
                                    setValue(formId("name"), slugify(transliterate(e.target.value)));
                                }
                            }}
                            onClick={e => {
                                if(e.target.value === 'new-block'){
                                    resetField(formId("label"));
                                }
                            }}
                            validate={{
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Input
                            size="sm"
                            id={formId("name")}
                            placeholder={useTranslation("Block name. Allowed chars: [a-z0-9_-]")}
                            defaultValue={block.name}
                            register={register}
                            errors={errors}
                            required={true}
                            onClick={e => {
                                if(e.target.value === 'new_block'){
                                    resetField(formId("name"));
                                }
                            }}
                            validate={{
                                validate: alphanumericallyValid,
                                required: useTranslation("This field is mandatory"),
                                maxLength: {
                                    value: 255,
                                    message: "max length is 255"
                                }
                            }}
                        />
                    </div>
                    <Tooltip
                        label={
                            <span
                                className={`acpt-btn-switch ${autoSlug === true ? 'active' : ''}`}
                                onClick={e => {
                                    e.preventDefault();
                                    setAutoSlug(!autoSlug);
                                }}
                            >
                                <Icon icon="bx-link" width={18} />
                            </span>
                        }
                        tip={useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                        icon={false}
                    />
                </div>
                <Button style={styleVariants.SECONDARY} size="sm" onClick={(e) => {
                    e.preventDefault();
                    setFormVisible(!formVisible);
                }}>
                    {useTranslation(`${formVisible ? 'Close' : 'Edit'}`)}
                </Button>
            </span>
            <MetaBlockActions
                blockIndex={blockIndex}
                boxId={boxId}
                parentFieldId={parentFieldId}
                block={block}
            />
        </div>
    );
};

MetaBlockHeader.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    blockIndex: PropTypes.number.isRequired,
    formId: PropTypes.func.isRequired,
    boxId: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    block: PropTypes.object.isRequired,
    attributes: PropTypes.object,
    listeners: PropTypes.object
};

export default MetaBlockHeader;
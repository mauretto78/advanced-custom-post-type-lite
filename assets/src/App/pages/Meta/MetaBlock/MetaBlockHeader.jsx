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
import DeleteMetaBlockModal from "../Modal/DeleteMetaBlockModal";
import {cloneBlock} from "../../../utils/cloners";
import {addBlock, hideElement, showElement} from "../../../redux/reducers/metaStateSlice";
import {delay} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import {getFormId} from "../../../utils/fields";
import {slugify, transliterate} from 'transliteration';
import CopyMetaBlockModal from "../Modal/CopyMetaBlockModal";
import ElementSelector from "../BulkActions/ElementSelector";

const MetaBlockHeader = ({boxId, block, view, listeners, attributes, formId, boxIndex, blockIndex, parentFieldIndex, parentFieldId, setActiveTab}) => {

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

    /**
     *
     * @return {string}
     */
    const blockClassName = () => {
        let css = 'flex-between s-8 for-xs';

        if(view === 'accordion'){
            css = css +' p-24 bg-pale-gray';

            if(!isClosed()){
                css = css + ' b-bottom-1';
            }
        }

        return css;
    };

    return (
        <div className={blockClassName()}>
            <InputHidden
                id={formId("id")}
                value={block.id}
                register={register}
            />
            <span className="i-flex-center s-8">
                {view === 'list' && (
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                )}
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
                <span className={`top-1 color-gray ${!formVisible ? '' : 'hidden'}`}>
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
            <span className="i-flex-center s-8">
                <Tooltip
                    label={
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                const duplicatedBlock = cloneBlock(boxId, parentFieldId, watchedBlock);
                                dispatch(addBlock({boxId, parentFieldId, block: duplicatedBlock}));

                                delay(1).then(()=>{
                                    scrollToId(duplicatedBlock.id);
                                });
                            }}
                        >
                            <Icon icon="bx:duplicate" width={18} />
                        </a>
                    }
                    tip={useTranslation("Duplicate this block")}
                    icon={false}
                />
                {canCopyTheBlock() && (
                    <Tooltip
                        label={
                            <CopyMetaBlockModal block={block} />
                        }
                        tip={useTranslation("Copy this meta block")}
                        icon={false}
                    />
                )}
                <Tooltip
                    label={
                        <DeleteMetaBlockModal
                            boxId={boxId}
                            blockId={block.id}
                            blockIndex={blockIndex}
                            parentFieldId={parentFieldId}
                            setActiveTab={setActiveTab}
                        />
                    }
                    tip={useTranslation("Delete this block")}
                    icon={false}
                />
                {(view === 'list' || view === 'accordion') && (
                    <Tooltip
                        label={
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    handleToggleClose();
                                }}
                            >
                                <Icon icon="bx:expand-alt" width={18} />
                            </a>
                        }
                        tip={useTranslation("Hide/show this block")}
                        icon={false}
                    />
                )}
            </span>
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
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    attributes: PropTypes.object,
    listeners: PropTypes.object,
    setActiveTab: PropTypes.func,
};

export default MetaBlockHeader;
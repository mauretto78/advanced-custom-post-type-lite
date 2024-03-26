import React, {useState} from "react";
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {Icon} from "@iconify/react";
import Input from "../../../components/Forms/Input";
import useTranslation from "../../../hooks/useTranslation";
import Tooltip from "../../../components/Tooltip";
import DeleteMetaBoxModal from "../Modal/DeleteMetaBoxModal";
import CopyMetaBoxModal from "../Modal/CopyMetaBoxModal";
import {useDispatch, useSelector} from "react-redux";
import {addBox, hideElement, showElement} from "../../../redux/reducers/metaStateSlice";
import {alphanumericallyValid} from "../../../utils/validation";
import {saveIsClosed} from "../../../utils/localStorage";
import {get, useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import InputHidden from "../../../components/Forms/InputHidden";
import {cloneBox} from "../../../utils/cloners";
import {scrollToId} from "../../../utils/scroll";
import {delay} from "../../../utils/misc";
import {slugify, transliterate} from 'transliteration';
import {wpAjaxRequest} from "../../../utils/ajax";
import InputDebounced from "../../../components/Forms/InputDebounced";
import ElementSelector from "../BulkActions/ElementSelector";

const MetaBoxHeader = ({index, box, view, listeners, attributes, setActiveTab}) => {

    // manage form state
    const formId = (value) => {
        return `boxes.${index}.${value}`;
    };

    const { register, formState: {errors}, control, setValue, resetField, clearErrors } = useFormContext();
    const watchedName = useWatch({
        control,
        name: formId("name")
    });
    const watchedLabel = useWatch({
        control,
        name: formId("label")
    });
    const watchedBox = useWatch({
        control,
        name: `boxes.${index}`
    });
    const watchedBoxes = useWatch({
        control,
        name: 'boxes'
    });
    const { append } = useFieldArray({
        control,
        name: "boxes",
    });

    // manage global state
    const dispatch = useDispatch();
    const {closedElements, selectedElements, selectedElementsType} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === box.id);

        return filter.length === 1;
    };

    // manage local state
    const [formVisible, setFormVisible] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);

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

        return watchedName ? watchedName : box.name;
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {
        return (typeof watchedLabel === 'string') ? watchedLabel : box.label;
    };

    /**
     * This function avoid any box name collision
     * @param name
     * @return {string}
     */
    const checkIfNameIsValid = async(name) => {

        const slugified = slugify(transliterate(name));

        // check for other box names
        let otherBoxNames = [];

        watchedBoxes.map((box, i) => {
            if(i !== index){
                otherBoxNames.push(box.name);
            }
        });

        if(otherBoxNames.includes(slugified)){
            return useTranslation("Name is already taken");
        }

        // check if the name already exists
        if(box.name !== slugified){
            // the following function will be executed every half second
            const res = await wpAjaxRequest("checkMetaBoxNameAction", {boxName: slugified});

            if(res.exists === true){
                return useTranslation("Name is already taken");
            }
        }

        return true;
    };

    /**
     * Toggle close box
     */
    const handleToggleClose = () => {
        saveIsClosed(box.id);

        if((isClosed())){
            dispatch(showElement({id: box.id}));
        } else {
            dispatch(hideElement({id: box.id}));
        }
    };

    /**
     *
     * @return {boolean}
     */
    const canCopyTheBox = () => {

        if(typeof box.isSaved !== 'undefined' && box.isSaved === false){
            return false
        }

        return true;
    };

    const onChangeLabel = (value) => {
        if(autoSlug){
            const slugified = slugify(transliterate(value));

            if(checkIfNameIsValid(slugified)){
                clearErrors(formId("name"));
                setValue(formId("name"), slugified);
            }
        }
    };

    /**
     *
     * @return {boolean}
     */
    const isSelected = () => {
        const filter = selectedElements.filter(el => el.id === box.id );

        return filter.length > 0
    };

    return (
        <div className="flex-between s-8 for-xs">
            <InputHidden
                id={formId("id")}
                value={box.id}
                register={register}
            />
            <span className="i-flex-center s-8">
                {view === 'list' && (
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                )}
                {selectedElementsType !== 'field' && selectedElementsType !== 'block' && canCopyTheBox() && (
                    <ElementSelector
                        elementType="box"
                        element={{
                            id: box.id
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
                        <InputDebounced
                            size="sm"
                            control={control}
                            id={formId("label")}
                            placeholder={useTranslation("Box label, non latin chars allowed.")}
                            onChangeCapture={onChangeLabel}
                            defaultValue={box.label}
                            validate={{
                                validate: checkIfNameIsValid,
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
                            placeholder={useTranslation("Box name. Allowed chars: [a-z0-9_-]")}
                            defaultValue={box.name}
                            register={register}
                            errors={errors}
                            required={true}
                            onClick={e => {
                                if(e.target.value === 'meta_box_field'){
                                    resetField(formId("name"));
                                }
                            }}
                            validate={{
                                validate: {
                                    alphanumericallyValid,
                                    checkIfNameIsValid
                                },
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
                                const duplicatedBox = cloneBox(watchedBox);
                                dispatch(addBox(duplicatedBox));
                                append(duplicatedBox);

                                delay(1).then(()=>{
                                    scrollToId(duplicatedBox.id);
                                });
                            }}
                        >
                            <Icon icon="bx:duplicate" width={18} />
                        </a>
                    }
                    tip={useTranslation("Duplicate this meta box")}
                    icon={false}
                />
                {canCopyTheBox() && (
                    <React.Fragment>
                        <Tooltip
                            label={
                                <CopyMetaBoxModal
                                    box={box}
                                />
                            }
                            tip={useTranslation("Copy this meta box")}
                            icon={false}
                        />
                    </React.Fragment>
                )}
                <Tooltip
                    label={
                        <DeleteMetaBoxModal
                            index={index}
                            setActiveTab={setActiveTab}
                            boxId={box.id}
                        />
                    }
                    tip={useTranslation("Delete this meta box")}
                    icon={false}
                />
                {view === 'list' && (
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
                        tip={useTranslation("Hide/show this meta box")}
                        icon={false}
                    />
                )}
            </span>
        </div>
    );
};

MetaBoxHeader.propTypes = {
    box: PropTypes.object.isRequired,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    setActiveTab: PropTypes.func,
    attributes: PropTypes.object,
    listeners: PropTypes.object,
};

export default MetaBoxHeader;
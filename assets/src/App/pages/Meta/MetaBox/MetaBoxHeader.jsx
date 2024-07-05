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
import {addBox, hideElement, selectElement, showElement} from "../../../redux/reducers/metaStateSlice";
import {alphanumericallyValid} from "../../../utils/validation";
import {saveIsClosed} from "../../../utils/localStorage";
import {get, useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import InputHidden from "../../../components/Forms/InputHidden";
import {cloneBox} from "../../../utils/cloners";
import {scrollToId} from "../../../utils/scroll";
import {delay} from "../../../utils/misc";
import {slugify, transliterate} from 'transliteration';
import {wpAjaxRequest} from "../../../utils/ajax";
import ElementSelector from "../BulkActions/ElementSelector";
import {debounce} from "../../../utils/debounce";

const MetaBoxHeader = ({index, box, view, listeners, attributes, setActiveTab}) => {

    // manage form state
    const formId = (value) => {
        return `boxes.${index}.${value}`;
    };

    const { register, formState: {errors}, control, setValue, resetField, clearErrors, setError } = useFormContext();
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
     *
     * @param label
     * @return {Promise<void>}
     */
    const onChangeLabel = async(label) => {
        if(autoSlug){
            const slugified = slugify(transliterate(label));
            setValue(formId("name"), slugified);

            if(await checkIfNameIsValid(slugified)){
                setError(
                    formId("name"),
                    {message: useTranslation("Name is already taken")}
                );
            } else {
                clearErrors(formId("name"));
            }
        }
    };

    /**
     * This function avoid any box name collision
     * @param name
     * @return {string}
     */
    const checkIfNameIsValid = async(name) => {

        // check for other box names
        let otherBoxNames = [];

        watchedBoxes.map((box, i) => {
            if(i !== index){
                otherBoxNames.push(box.name);
            }
        });

        if(otherBoxNames.includes(name)){
            return useTranslation("Name is already taken");
        }

        // check if the name already exists
        if(box.name !== name){
            // the following function will be executed every half second
            const res = await wpAjaxRequest("checkMetaBoxNameAction", {boxName: name});

            if(res.exists === true){
                return useTranslation("Name is already taken");
            }
        }
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

    /**
     * Handle select/deselect all fields
     */
    const handleSelectAllFields = () => {

        /**
         *
         * @return {boolean}
         */
        const isFirstFieldSelected = () => {

            const firstFieldId  = (box && box.fields && box.fields.length > 0) ? box.fields[0].id : null;
            const selectedFields = selectedElements.filter(f => f.id === firstFieldId);

            if(selectedFields && selectedFields.length === 1){
                return true;
            }

            return false;
        };

        box && box.fields && box.fields.map((f) => {
            dispatch(selectElement({
                    element: f,
                    selected: !isFirstFieldSelected(),
                    type: 'field'
                }
            ));
        });
    };

    /**
     *
     * @return {string}
     */
    const boxClassName = () => {
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
        <div className={boxClassName()}>
            <InputHidden
                id={formId("id")}
                value={box.id}
                register={register}
            />
            <span className="i-flex-center s-8">
                {(view === 'list' || view === 'accordion') && (
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
                        <Input
                            size="sm"
                            id={formId("label")}
                            placeholder={useTranslation("Box label, non latin chars allowed.")}
                            defaultValue={box.name}
                            register={register}
                            errors={errors}
                            required={true}
                            onChangeCapture={debounce(e => {
                                onChangeLabel(e.target.value);
                            }, 300)}
                            onClick={e => {
                                if(e.target.value === 'meta_box_title' || e.target.value === 'meta box title'){
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
                            placeholder={useTranslation("Box name. Allowed chars: [a-z0-9_-]")}
                            defaultValue={box.name}
                            register={register}
                            errors={errors}
                            required={true}
                            onClick={e => {
                                if(e.target.value === 'meta_box_title'){
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
                                handleSelectAllFields();
                            }}
                        >
                            <Icon icon="bx:checkbox-checked" width={24} />
                        </a>
                    }
                    tip={useTranslation("Select/deselect all fields")}
                    icon={false}
                />
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
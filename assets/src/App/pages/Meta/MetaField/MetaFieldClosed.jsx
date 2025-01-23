import React, {useRef, useState} from "react";
import PropTypes from 'prop-types';
import {arrayMove, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import useTranslation from "../../../hooks/useTranslation";
import {get, useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {
    canCopyTheField,
    canFieldHaveValidationAndLogicRules,
    fieldNestingLevel,
    formatFieldForSelection,
    getFormId,
    metaFieldFormId
} from "../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import ElementSelector from "../BulkActions/ElementSelector";
import MetaFieldType from "../../../components/MetaFieldType";
import MetaFieldActions from "./Commons/MetaFieldActions";
import MetaFieldSwitches from "./Commons/MetaFieldSwitches";
import MetaFieldIds from "./Commons/MetaFieldIds";
import {useOutsideClick} from "../../../hooks/useOutsideClick";
import {fieldIsFlexible, fieldIsRepeater, fieldsList, fieldTypes} from "../../../constants/fields";
import Select from "../../../components/Forms/Select";
import {setBlocks, setFields, updateField} from "../../../redux/reducers/metaStateSlice";
import {debounce} from "../../../utils/debounce";
import Input from "../../../components/Forms/Input";
import {slugify, transliterate} from "transliteration";
import {wpAjaxRequest} from "../../../utils/ajax";
import {alphanumericallyValid} from "../../../utils/validation";
import Tooltip from "../../../components/Tooltip";
import SortableList from "../../../components/SortableList";
import MetaField from "./index";
import MetaBlock from "../MetaBlock";

const MetaFieldClosed = ({boxIndex, fieldIndex, boxId, field, parentFieldIndex, parentFieldId, parentBlockId, isMainView}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const dispatch = useDispatch();
    const {group, selectedElementsType} = useSelector(state => state.metaState);

    // manage form state
    const { formState: {errors}, register, unregister, resetField, setError, clearErrors, setValue, control } = useFormContext();

    const { move: moveChildren } = useFieldArray({
        control,
        name: `${getFormId(group.boxes, boxId, field.id)}.children`,
    });

    const { move: moveBlocks } = useFieldArray({
        control,
        name: `${getFormId(group.boxes, boxId, field.id)}.blocks`,
    });

    // manage local state
    const [autoSlug, setAutoSlug] = useState(true);
    const [editLabelAndName, setEditLabelAndName] = useState(false);
    const [editType, setEditType] = useState(false);
    const [labelFocus, setLabelFocus] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const editTypeNode = useRef();
    const editLabelNode = useRef();
    const editNameNode = useRef();

    useOutsideClick([editTypeNode], () => {
        setEditType(false);
    });

    useOutsideClick([editLabelNode, editNameNode], () => {
        setEditLabelAndName(false);
        setLabelFocus(false);
        setNameFocus(false);
    });

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return metaFieldFormId(group.boxes, boxId, field.id,value);
    };

    const watchedFields = useWatch({
        control,
        name: `boxes.${boxIndex}.fields`
    });

    const watchedBoxName = useWatch({
        control,
        name: `boxes.${boxIndex}.name`
    });

    const watchedName = useWatch({
        control,
        name: formId("name")
    });

    const watchedLabel = useWatch({
        control,
        name: formId("label")
    });

    const watchedType = useWatch({
        control,
        name: formId("type")
    });

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

        return watchedName ? watchedName : field.name;
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {
        return (typeof watchedLabel === 'string') ? watchedLabel : field.label;
    };

    /**
     *
     * @return {*}
     */
    const fieldType = () => {
        return watchedType ? watchedType : field.type;
    };

    // calculate nesting levels
    const nestingLevel = fieldNestingLevel(group.boxes, boxId, field.id);

    // handle field type change (update redux state)
    const handleFieldTypeChange = (type) => {
        if(fieldType() !== type){
            const updatedField = {...field};
            updatedField.type = type;

            if(type !== fieldTypes.REPEATER){
                updatedField.children = [];
            }

            if(type !== fieldTypes.FLEXIBLE){
                updatedField.blocks = [];
            }

            if(type !== fieldTypes.POST){
                updatedField.relations = [];
            }

            if(!canFieldHaveValidationAndLogicRules(type)){
                unregister(formId("relations"));
                unregister(formId("visibilityConditions"));
                unregister(formId("validationRules"));
                updatedField.visibilityConditions = [];
                updatedField.validationRules = [];
                updatedField.relations = [];
            }

            unregister(formId("relations"));
            unregister(formId("blocks"));
            unregister(formId("children"));

            if(!updatedField['children']){
                updatedField.children = [];
            }

            if(!updatedField['blocks']){
                updatedField.blocks = [];
            }

            if(!updatedField['relations']){
                updatedField.relations = [];
            }

            if(!updatedField['visibilityConditions']){
                updatedField.visibilityConditions = [];
            }

            if(!updatedField['validationRules']){
                updatedField.validationRules = [];
            }

            dispatch(updateField({field: updatedField, boxId}));
        }
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
     * This function avoid any field name collision
     * @param name
     * @return {string}
     */
    const checkIfNameIsValid = async(name) => {

        const slugified = slugify(transliterate(name));

        // check for other box names
        let otherFieldNames = [];

        watchedFields.map((field, i) => {
            if(i !== fieldIndex){
                otherFieldNames.push(field.name);
            }
        });

        if(otherFieldNames.includes(slugified)){
            return useTranslation("Name is already taken");
        }

        // check if the name already exists
        if(field.name !== slugified){

            const res = await wpAjaxRequest("checkMetaBoxFieldNameAction", {
                boxName: watchedBoxName ? watchedBoxName : field.boxName,
                fieldName: slugified
            });

            if(res.exists === true){
                return useTranslation("Name is already taken");
            }
        }
    };

    /**
     * Sort nested blocks in a flexible field
     * @param event
     */
    const handleNestedBlocksDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const blocks = field.blocks;

        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        const sortedBlocks = arrayMove(blocks, oldIndex, newIndex);
        moveBlocks(oldIndex, newIndex);

        dispatch(setBlocks({boxId, parentFieldId: field.id, sortedBlocks}));
    };

    /**
     * Sort nested fields in a repeater field
     * @param event
     */
    const handleNestedFieldsDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const fields = field.children;

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        moveChildren(oldIndex, newIndex);

        dispatch(setFields({boxId, parentFieldId: field.id, parentBlockId: null, sortedFields}));
    };

    /**
     *
     * @return {string|null}
     */
    const rowColor = () => {

        if(!isMainView){
            return null;
        }

        if(!nestingLevel || nestingLevel === 0){
            return null;
        }

        let color = "#02C39A";

        switch (nestingLevel) {
            case 1:
                return "#02C39A";

            case 2:
                return "#029c7b";

            case 3:
                return "#01755c";

            default:
            case 4:
                return "#01624d";
        }

        return color;
    };

    /**
     *
     * @return {null|number}
     */
    const paddingLeft = () => {

        if(!isMainView){
            return null;
        }

        if(!nestingLevel || nestingLevel < 2){
            return 24;
        }

        return 24 * nestingLevel;
    };

    return (
        <React.Fragment>
            <MetaFieldIds
                boxId={boxId}
                field={field}
                parentFieldId={parentFieldId}
                parentBlockId={parentBlockId}
            />
            <tr
                id={field.id}
                ref={setNodeRef}
                style={style}
                className={`bg-white b-rounded ${isDragging ? "z-100 with-drop-shadow" : ""}`}
            >
                <td
                    style={{
                        borderLeft: `5px solid ${rowColor()}`,
                        paddingLeft: `${paddingLeft()}px`
                    }}
                >
                    <div className="i-flex-center s-8">
                        {(parentFieldId || parentBlockId) && (
                            <Tooltip
                                label={<Icon icon="tabler:arrow-guide" color={rowColor()} width={18} />}
                                tip={useTranslation(`Child field`)}
                                icon={false}
                            />
                        )}
                        <span className="cursor-move handle top-2" {...attributes} {...listeners}>
                            <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                        </span>
                        {selectedElementsType !== 'box' && selectedElementsType !== 'block' && canCopyTheField(field.isSaved) && (
                            <ElementSelector
                                elementType="field"
                                element={formatFieldForSelection(field, boxId, parentFieldId, parentBlockId)}
                            />
                        )}
                    </div>
                </td>
                <td className="hidden-xs">
                    {editLabelAndName
                        ?
                        <div
                            ref={editLabelNode}
                            className="w-100 i-flex-center s-8"
                        >
                            <Input
                                id={formId("label")}
                                register={register}
                                errors={errors}
                                autoFocus={labelFocus}
                                defaultValue={field.label}
                                placeholder={useTranslation("The field label, non latin characters are allowed")}
                                onChangeCapture={debounce(e => {
                                    onChangeLabel(e.target.value);
                                }, 300)}
                                onClick={e => {
                                    if(e.target.value === 'meta box field'){
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
                        :
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                if(window.innerWidth >= 960){
                                    setEditLabelAndName(!editLabelAndName);
                                    setLabelFocus(!labelFocus);
                                    setNameFocus(false);
                                }
                            }}
                        >
                            {label()}
                        </div>
                    }
                </td>
                <td>
                    {editLabelAndName
                        ?
                        <div
                            ref={editNameNode}
                        >
                            <Input
                                id={formId("name")}
                                register={register}
                                errors={errors}
                                autoFocus={nameFocus}
                                placeholder={useTranslation("Field slug (Ex. gallery or text_1)")}
                                defaultValue={field.name}
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
                        :
                        <div
                            className="text-bold color-black cursor-pointer"
                            onClick={() => {
                                if(window.innerWidth >= 960){
                                    setEditLabelAndName(!editLabelAndName);
                                    setNameFocus(!nameFocus);
                                    setLabelFocus(false);
                                }
                            }}
                        >
                            {name()}
                        </div>
                    }
                </td>
                <td className="hidden-xs">
                    <MetaFieldSwitches
                        field={field}
                        boxId={boxId}
                    />
                </td>
                <td>
                    {editType ?
                        <div
                            ref={editTypeNode}
                            style={{maxWidth: "200px"}}
                        >
                            <Select
                                register={register}
                                id={formId("type")}
                                errors={errors}
                                defaultValue={field.type}
                                values={fieldsList(nestingLevel)}
                                onChangeCapture={e => {
                                    handleFieldTypeChange(e.target.value);
                                }}
                            />
                        </div>
                        :
                        <div
                            className="i-flex-center s-8 cursor-pointer"
                            onClick={() => {
                                if(window.innerWidth >= 960){
                                    setEditType(!editType);
                                }
                            }}
                        >
                            <MetaFieldType
                                fieldType={fieldType()}
                                css="with-border b-rounded p-8"
                            />
                            {watchedType === fieldTypes.REPEATER && field.children && field.children.length > 0 && (
                                <span className="px-8 py-4 font-sm bg-light-gray text-normal b-rounded">
                                    {field.children.length}
                                </span>
                            )}
                            {watchedType === fieldTypes.FLEXIBLE && field.blocks && field.blocks.length > 0 && (
                                <span className="px-8 py-4 font-sm bg-light-gray text-normal b-rounded">
                                    {field.blocks.length}
                                </span>
                            )}
                        </div>
                    }
                </td>
                <td>
                    <MetaFieldActions
                        boxIndex={boxIndex}
                        field={field}
                        boxId={boxId}
                        fieldIndex={fieldIndex}
                        parentFieldIndex={parentFieldIndex}
                        parentFieldId={parentFieldId}
                        parentBlockId={parentBlockId}
                    />
                </td>
            </tr>
            {fieldIsRepeater(fieldType()) && field.children && (
                <SortableList
                    onDragEnd={handleNestedFieldsDragEnd}
                    items={field.children}
                >
                    <React.Fragment>
                        {field.children && field.children.length > 0 && field.children.map((child, childIndex) => (
                            <MetaField
                                isMainView={true}
                                boxIndex={boxIndex}
                                fieldIndex={childIndex}
                                boxId={boxId}
                                field={child}
                                parentFieldIndex={fieldIndex}
                                parentFieldId={field.id}
                            />
                        ))}
                    </React.Fragment>
                </SortableList>
            )}
            {fieldIsFlexible(fieldType()) && field.blocks && (
                <SortableList
                    onDragEnd={handleNestedBlocksDragEnd}
                    items={field.blocks}
                >
                    <React.Fragment>
                        {field.blocks && field.blocks.length > 0 && field.blocks.map((block, childBlockIndex) => (
                            <MetaBlock
                                isMainView={true}
                                blockIndex={childBlockIndex}
                                block={block}
                                boxIndex={boxIndex}
                                boxId={boxId}
                                parentFieldIndex={parentFieldIndex}
                                parentFieldId={field.id}
                            />
                        ))}
                    </React.Fragment>
                </SortableList>
            )}
        </React.Fragment>
    );
};

MetaFieldClosed.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string
};

export default MetaFieldClosed;
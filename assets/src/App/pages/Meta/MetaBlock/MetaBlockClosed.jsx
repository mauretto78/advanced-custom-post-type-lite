import React, {useRef, useState} from "react";
import PropTypes from 'prop-types';
import {fieldNestingLevel, getFormId} from "../../../utils/fields";
import {useDispatch, useSelector} from "react-redux";
import {useOutsideClick} from "../../../hooks/useOutsideClick";
import {Icon} from "@iconify/react";
import useTranslation from "../../../hooks/useTranslation";
import Tooltip from "../../../components/Tooltip";
import {arrayMove, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ElementSelector from "../BulkActions/ElementSelector";
import MetaBlockActions from "./Commons/MetaBlockActions";
import MetaField from "../MetaField";
import SortableList from "../../../components/SortableList";
import {setFields} from "../../../redux/reducers/metaStateSlice";
import MetaBlockHeader from "./MetaBlockHeader";
import InputHidden from "../../../components/Forms/InputHidden";
import {get, useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {slugify, transliterate} from "transliteration";
import Input from "../../../components/Forms/Input";
import {alphanumericallyValid} from "../../../utils/validation";

const MetaBlockClosed = ({blockIndex, block, boxIndex, boxId, parentFieldIndex, parentFieldId, isMainView}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: block.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // manage global state
    const {group, closedElements, selectedElementsType} = useSelector(state => state.metaState);
    const dispatch = useDispatch();

    // calculate nesting levels
    const nestingLevel = fieldNestingLevel(group.boxes, boxId, block.id);

    // manage form state
    const { formState: {errors}, register, control, resetField, setValue } = useFormContext();

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, block.id)}.${value}`;
    };

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

    const { move } = useFieldArray({
        control,
        name: formId("fields"),
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

        return watchedName ? watchedName : block.name;
    };

    /**
     *
     * @return {null|*}
     */
    const label = () => {
        return watchedLabel ? watchedLabel : block.label;
    };

    // manage local state
    const [autoSlug, setAutoSlug] = useState(true);
    const [editLabelAndName, setEditLabelAndName] = useState(false);
    const [labelFocus, setLabelFocus] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const editLabelNode = useRef();
    const editNameNode = useRef();

    useOutsideClick([editLabelNode, editNameNode], () => {
        setEditLabelAndName(false);
        setLabelFocus(false);
        setNameFocus(false);
    });


    const handleNestedFieldsDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const fields = block.fields;

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setFields({boxId, parentFieldId: null, parentBlockId: block.id, sortedFields}));
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

        let color = "#a972ca";

        switch (nestingLevel) {

            case 1:
                return "#a972ca";

            case 2:
                return "#875ba2";

            case 3:
                return "#654479";

            default:
            case 4:
                return "#553965";
        }

        return color;
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

    if(isMainView){
        return (
            <React.Fragment>
                <InputHidden
                    id={formId("id")}
                    value={block.id}
                    register={register}
                />
                <tr
                    id={block.id}
                    ref={setNodeRef}
                    style={style}
                    className={`bg-white b-rounded ${isDragging ? "z-100 with-drop-shadow" : ""}`}
                >
                    <td
                        style={{
                            borderLeft: `5px solid ${rowColor()}`
                        }}
                    >
                        <div className="i-flex-center s-8">
                            <Tooltip
                                label={<Icon icon="hugeicons:blockchain-01" color={rowColor()} width={18} />}
                                tip={useTranslation(`Child block`)}
                                icon={false}
                            />
                            <span className="cursor-move handle top-2" {...attributes} {...listeners}>
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
                        </div>
                    </td>
                    <td>
                        {editLabelAndName ?
                            <div
                                ref={editLabelNode}
                                className="w-100 i-flex-center s-8"
                            >
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
                    <td className="hidden-xs">
                        {editLabelAndName
                            ?
                            <div ref={editNameNode}>
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
                    <td/>
                    <td/>
                    <td>
                        <MetaBlockActions
                            blockIndex={blockIndex}
                            boxId={boxId}
                            parentFieldId={parentFieldId}
                            block={block}
                        />
                    </td>
                </tr>
                {block.fields && block.fields.length > 0 && (
                    <SortableList
                        onDragEnd={handleNestedFieldsDragEnd}
                        items={block.fields}
                    >
                        <React.Fragment>
                            {block.fields && block.fields.length > 0 && block.fields.map((child, childIndex) => (
                                <MetaField
                                    isMainView={true}
                                    boxIndex={boxIndex}
                                    fieldIndex={childIndex}
                                    boxId={boxId}
                                    field={child}
                                    parentBlockId={block.id}
                                />
                            ))}
                        </React.Fragment>
                    </SortableList>
                )}
            </React.Fragment>
        );
    }

    return (
        <div
            id={block.id}
            className={`bg-white b-rounded with-shadow p-24 ${isDragging ? "z-100 with-drop-shadow" : ""}`}
            ref={setNodeRef}
            style={style}
        >
            <MetaBlockHeader
                formId={formId}
                boxIndex={boxIndex}
                attributes={attributes}
                listeners={listeners}
                boxId={boxId}
                block={block}
                blockIndex={blockIndex}
                parentFieldId={parentFieldId}
            />
        </div>
    );
};

MetaBlockClosed.propTypes = {
    isMainView: PropTypes.bool,
    blockIndex: PropTypes.number.isRequired,
    block: PropTypes.object.isRequired,
    boxId: PropTypes.string.isRequired,
    boxIndex: PropTypes.string.isRequired,
    parentFieldIndex: PropTypes.number.isRequired,
    parentFieldId: PropTypes.string.isRequired
};

export default MetaBlockClosed;
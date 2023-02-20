import React, {useEffect, useRef, useState} from 'react';
import {fieldsList, SELECT} from "../../../../constants/fields";
import arrayMove from "array-move";
import {useDispatch, useSelector} from "react-redux";
import {
    createOption,
    setFields,
    setOptions,
    toggleFieldIsRequired,
    toggleFieldShowInArchive,
    updateFieldDefaultValue,
    updateFieldDescription,
    updateFieldName,
    updateFieldType
} from "../../../../redux/actions/metaStateActions";
import {filterById, filterByLabel, filterByValue, isset} from "../../../../utils/objects";
import {isAValidValueForThisType} from "../../../../utils/validation";
import {Icon} from "@iconify/react";
import Accordion from "../../../reusable/Accordion";
import Tippy from "../../../reusable/Tippy";
import {isMetaClosed, saveMetaIsClosed} from "../../../../utils/localStorage";
import MetaBasic from "./MetaBasic";
import DeleteMetaFieldModal from "./Modal/DeleteMetaFieldModal";
import {metaTypes} from "../../../../constants/metaTypes";

const MetaBoxField = ({id, boxId, parentId, position, dragHandle, isSaved}) => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched: fetchedMeta} = useSelector(state => state.fetchMetaReducer);
    const {validationErrors, values, fields, options, relations, visibilityConditions, selectedElement} = useSelector(state => state.metaStateReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
    const box = filterById(values, boxId);
    const fieldValues = (isset(box, "fields")) ? filterById(box.fields, id): {};
    const optionValues = (isset(fieldValues, "options")) ? fieldValues.options : [];
    const activeTab = (isset(fieldValues, "activeTab")) ? fieldValues.activeTab : 0;
    const name = (isset(fieldValues, "name")) ? fieldValues.name : 'new_field';
    const type = (isset(fieldValues, "type")) ? fieldValues.type : null;
    const defaultFieldValue = (isset(fieldValues, "type")) ? filterByValue(fieldsList, fieldValues.type) : null;
    const description = (isset(fieldValues, "description")) ? fieldValues.description : null;
    const defaultValue = (isset(fieldValues, "defaultValue")) ? fieldValues.defaultValue : null;
    const showInArchive = (isset(fieldValues, "showInArchive")) ? fieldValues.showInArchive : false;
    const isRequired = (isset(fieldValues, "isRequired")) ? fieldValues.isRequired : false;
    const deleteMetadataOption = filterByLabel(settings, 'key', 'delete_metadata').value;
    const isChildElement = typeof parentId !== 'undefined';
    const belongsTo = box.belongsTo;

    const fieldsBlocks = fields.filter((field) => {
        return (field.props.boxId === boxId);
    });

    const optionBlocks = options.filter((option) => {
        return (option.props.boxId === boxId && option.props.fieldId === id);
    });

    const relationBlocks = relations.filter((relation) => {
        return (relation.props.boxId === boxId && relation.props.fieldId === id);
    });

    const childrenFieldsBlocks = fields.filter((field) => {
        return (field.props.boxId === boxId && field.props.parentId === id);
    });

    const blankName = () => {
        if (isset(fieldValues, "name") && nameRef.current.value === 'new_field') {
            nameRef.current.value = '';
        }
    };

    const handleChangeFieldName = (n) => {
        dispatch(updateFieldName(id, boxId, n));
    };

    const handleChangeFieldDefaultValue = (v) => {
        setDefaultValueError((isAValidValueForThisType(type, v, optionValues)) ? null : 'Invalid value for this type.');
        dispatch(updateFieldDefaultValue(id, boxId, v));
    };

    const handleChangeFieldDescription = (d) => {
        dispatch(updateFieldDescription(id, boxId, d));
    };

    const handleToggleShowInArchive = (s) => {
        dispatch(toggleFieldShowInArchive(id, boxId, s));
    };

    const handleToggleIsRequired = (r) => {
        dispatch(toggleFieldIsRequired(id, boxId, r));
    };

    const handleUpdateFieldType = (t) => {
        // dispatch events only if the type was changed
        if(!isset(fieldValues, "type") || t !== fieldValues.type){
            dispatch(updateFieldType(id, boxId, t));
            setDefaultValueError((isAValidValueForThisType(t, defaultValue, optionValues)) ? null : 'Invalid value for this type.');

            if(t === SELECT){
                dispatch(createOption(boxId, id));
            }
        }
    };

    // manage local state
    const [closed, setClosed] = useState(isMetaClosed(id));
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [copyModalVisible, setCopyModalVisible] = useState(false);
    const [defaultValueError, setDefaultValueError] = useState(null);

    // refs
    const showInArchiveRef = useRef();
    const isRequiredRef = useRef();
    const nameRef = useRef();
    const fieldRef = useRef();
    const descriptionRef = useRef();
    const defaultValueRef = useRef();

    // sortable
    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(setOptions(boxId, id, arrayMove(options, oldIndex, newIndex)));
    };

    const onChildrenSortEnd = ({oldIndex, newIndex}) => {

        // remove from fieldsBlocks elements with parentId = id
        const filteredFields = fieldsBlocks.filter((fieldsBlock) => fieldsBlock.props.parentId !== id);

        // sort children array
        const sortedChildren = arrayMove(childrenFieldsBlocks, oldIndex, newIndex);

        // merge arrays
        const merged = [...filteredFields, ...sortedChildren];

        dispatch(setFields(boxId, merged));
    };

    // update fields
    useEffect(()=>{
        fieldRef.current && fieldRef.current.select.setValue(defaultFieldValue);

        if(nameRef.current){
            nameRef.current.value = name;
        }

        if(descriptionRef.current){
            descriptionRef.current.value = description;
        }

        if(defaultValueRef.current){
            defaultValueRef.current.value = defaultValue;
        }

        if(isRequiredRef.current){
            isRequiredRef.current.checked = isRequired;
        }

        if(typeof parentId === 'undefined' && belongsTo !== metaTypes.TAXONOMY && showInArchiveRef.current){
            showInArchiveRef.current.checked = showInArchive;
        }

    }, [name, defaultFieldValue, showInArchive, isRequired, description, defaultValue]);

    // accordion tab change
    const handleAccordionClick = (index) => {
        dispatch(changeAccordionFieldTab(boxId, id, index));
    };

    return(
        <React.Fragment>
            <DeleteMetaFieldModal
                id={id}
                boxId={boxId}
                fieldName={name}
                modalVisible={deleteModalVisible}
                setModalVisible={setDeleteModalVisible}
                deleteMetadataOption={deleteMetadataOption}
            />
            <div
                className={`acpt-meta-field ${isChildElement ? 'is-children' : ''} ${id === selectedElement ? 'selected' : ''}`}
                id={id}
            >
                <div className="space-between">
                    <h3 className="vertical-center">
                        {dragHandle}
                        <div className="flex-center">
                            {(name !== '') ? <span>{name}</span> : <span className="error-message">Field name cannot be blank&nbsp;</span>}
                            {name && name.length > 255 && <span className="error-message">Field name max length is 255 characters</span>}
                            {isChildElement && (
                                <small className="children-label">child element</small>
                            )}
                            {type && <span className="acpt-badge no-border"><span className="label">{filterByValue(fieldsList, type).label}</span></span>}
                            {typeof parentId === 'undefined' && belongsTo !== metaTypes.TAXONOMY && (
                                <React.Fragment>
                                    <Tippy title="Show in Wordpress admin post lists page">
                                    <span className="switch-button">
                                        <input type="checkbox"
                                               ref={showInArchiveRef}
                                               id={`showInArchive${id}`}
                                               defaultChecked={showInArchive}
                                               onClick={(e) => {
                                                   handleToggleShowInArchive(e.target.checked);
                                               }}
                                        />
                                        <label htmlFor={`showInArchive${id}`}>
                                            <Icon icon="bxl:wordpress" width="14px" />
                                        </label>
                                    </span>
                                    </Tippy>
                                </React.Fragment>
                            )}
                            <Tippy title="Field required">
                                <span className="switch-button">
                                    <input type="checkbox"
                                       ref={isRequiredRef}
                                       id={`isRequired${id}`}
                                       defaultChecked={isRequired}
                                       onClick={(e) => {
                                           handleToggleIsRequired(e.target.checked);
                                       }}
                                    />
                                    <label htmlFor={`isRequired${id}`}>
                                        <Icon icon="foundation:asterisk" width="14px" />
                                    </label>
                                </span>
                            </Tippy>
                        </div>
                    </h3>
                    <div className="icons">
                        {isSaved && (
                            <Tippy title={`Copy this meta field to another meta box`}>
                                <a
                                    className=""
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCopyModalVisible(!copyModalVisible);
                                    }}
                                >
                                    <Icon icon="bx:copy" width="18px"/>
                                </a>
                            </Tippy>
                        )}
                        <Tippy title="Delete this meta field">
                            <a
                                className=""
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDeleteModalVisible(!deleteModalVisible);
                                }}
                            >
                                <Icon icon="bx:bx-trash" width="18px"/>
                            </a>
                        </Tippy>
                        <Tippy title="Hide/show this meta field">
                            <a
                                className=""
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setClosed(!closed);
                                    saveMetaIsClosed(id, closed);
                                } }
                            >
                                <Icon icon="bx:bx-expand-alt" width="18px"/>
                            </a>
                        </Tippy>
                    </div>
                </div>
                <div className={`acpt-meta-field__inner mt-2 ${closed ? 'hidden' : 'visible' }`}>
                    <MetaBasic
                        title="BASIC"
                        fieldType={type}
                        nameRef={nameRef}
                        name={name}
                        blackName={blankName}
                        handleChangeFieldName={handleChangeFieldName}
                        fieldRef={fieldRef}
                        defaultValue={defaultValue}
                        description={description}
                        defaultFieldValue={defaultFieldValue}
                        handleUpdateFieldType={handleUpdateFieldType}
                        parentId={parentId}
                        defaultValueRef={defaultValueRef}
                        handleChangeFieldDefaultValue={handleChangeFieldDefaultValue}
                        defaultValueError={defaultValueError}
                        descriptionRef={descriptionRef}
                        handleChangeFieldDescription={handleChangeFieldDescription}
                        optionBlocks={optionBlocks}
                        onSortEnd={onSortEnd}
                        boxId={boxId}
                        fieldId={id}
                        relationBlocks={relationBlocks}
                        childrenFieldsBlocks={childrenFieldsBlocks}
                        onChildrenSortEnd={onChildrenSortEnd}
                        validationErrors={validationErrors}
                        belongsTo={belongsTo}
                    />
                </div>
            </div>
        </React.Fragment>
    )
};

export default MetaBoxField;
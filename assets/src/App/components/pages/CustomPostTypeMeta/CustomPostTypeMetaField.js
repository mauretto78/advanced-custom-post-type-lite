import React, {useEffect, useRef, useState} from 'react';
import {reactSelectStyles} from "../../../constants/styles";
import Select from "react-select";
import {fieldsList, fieldsListGroupedOptions, POST, SELECT, SELECT_MULTI} from "../../../constants/fields";
import Modal from "../../reusable/Modal";
import {SortableList} from "../../reusable/Sortable";
import arrayMove from "array-move";
import {useDispatch, useSelector} from "react-redux";
import {
    createOption,
    createRelation,
    deleteField,
    setOptions,
    toggleFieldIsRequired,
    toggleFieldShowInArchive,
    updateFieldDefaultValue,
    updateFieldDescription,
    updateFieldName,
    updateFieldType
} from "../../../redux/actions/metaStateActions";
import {filterById, filterByValue, isset} from "../../../utils/objects";
import {isAValidValueForThisType} from "../../../utils/validation";
import {Icon} from "@iconify/react";
import {isMetaClosed, saveMetaIsClosed} from "../../../utils/localStorage";
import Tippy from "../../reusable/Tippy";

const CustomPostTypeMetaField = ({id, boxId, position, dragHandle}) => {

    // manage global state
    const dispatch = useDispatch();
    const {values, options, relations} = useSelector(state => state.metaStateReducer);
    const box = filterById(values, boxId);
    const fieldValues = (isset(box, "fields")) ? filterById(box.fields, id): {};
    const optionValues = (isset(fieldValues, "options")) ? fieldValues.options : [];
    const name = (isset(fieldValues, "name")) ? fieldValues.name : 'New Field';
    const type = (isset(fieldValues, "type")) ? fieldValues.type : null;
    const defaultFieldValue = (isset(fieldValues, "type")) ? filterByValue(fieldsList, fieldValues.type) : null;
    const description = (isset(fieldValues, "description")) ? fieldValues.description : null;
    const defaultValue = (isset(fieldValues, "defaultValue")) ? fieldValues.defaultValue : null;
    const showInArchive = (isset(fieldValues, "showInArchive")) ? fieldValues.showInArchive : false;
    const isRequired = (isset(fieldValues, "isRequired")) ? fieldValues.isRequired : false;
    const optionBlocks = options.filter((option) => {
        return (option.props.boxId === boxId && option.props.fieldId === id);
    });
    const relationBlocks = relations.filter((relation) => {
        return (relation.props.boxId === boxId && relation.props.fieldId === id);
    });

    const blackName = () => {
        if (isset(fieldValues, "name")) {
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

            if(t === SELECT || t === SELECT_MULTI){
                dispatch(createOption(boxId, id));
            }

            if(t === POST){
                dispatch(createRelation(boxId, id));
            }
        }
    };

    // manage local state
    const [closed, setClosed] = useState(isMetaClosed(id));
    const [modalVisible, setModalVisible] = useState(false);
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

    // update fields
    useEffect(()=>{
        fieldRef.current.select.setValue(defaultFieldValue);
        nameRef.current.value = name;
        descriptionRef.current.value = description;
        defaultValueRef.current.value = defaultValue;
        isRequiredRef.current.checked = isRequired;
        showInArchiveRef.current.checked = showInArchive;
    }, [name, defaultFieldValue, showInArchive, isRequired, description, defaultValue]);

    return(
        <React.Fragment>
            <Modal title={`Confirm deleting field "${name}"`} visible={modalVisible}>
                <p>Are you sure?</p>
                <p>
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(deleteField(boxId, id));
                        }}
                    >
                        Yes
                    </a>
                    &nbsp;
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary-o"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        No
                    </a>
                </p>
            </Modal>
            <div className="acpt-meta-field">
                <div className="space-between">
                    <h3 className="vertical-center">
                        {dragHandle}
                        {(name !== '') ? name : <span className="error-message">Field name cannot be blank&nbsp;</span>}
                        {name && name.length > 255 && <span className="error-message">Field name max length is 255 characters</span>}
                        {type && <span className="ml-1 acpt-badge"><span className="label">{filterByValue(fieldsList, type).label}</span></span>}
                        &nbsp;
                        <div className="">
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
                            &nbsp;
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
                        <a
                            className=""
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Icon icon="bx:bx-trash" width="18px"/>
                        </a>
                        &nbsp;
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
                    </div>
                </div>
                <div className={`acpt-meta-field__inner mt-3 ${closed ? 'hidden' : 'visible' }`}>
                    <div className="acpt-row">
                        <div className="acpt-col acpt-col-sm">
                            <input
                                ref={nameRef}
                                defaultValue={name}
                                onClick={e => blackName()}
                                onChange={e => handleChangeFieldName(e.target.value)}
                                className={`acpt-form-control ${name === '' ? ' has-errors' : ''}`}
                                type="text"
                            />
                        </div>
                        <div className="acpt-col acpt-col-sm">
                            <Select
                                ref={fieldRef}
                                defaultValue={defaultFieldValue}
                                placeholder="Select field type from list"
                                onChange={(obj) => handleUpdateFieldType(obj.value) }
                                styles={reactSelectStyles}
                                options={fieldsListGroupedOptions}
                            />
                        </div>
                    </div>
                    {type &&
                        <React.Fragment>
                            <div className="mt-3 acpt-row">
                                <div className="acpt-col acpt-col-sm">
                                    <input
                                        ref={defaultValueRef}
                                        defaultValue={defaultValue}
                                        placeholder="Default value"
                                        onChange={e => handleChangeFieldDefaultValue(e.target.value)}
                                        className={`acpt-form-control ${defaultValueError ? ' has-errors' : ''}`}
                                        type="text"
                                    />
                                    {defaultValueError && <div className="invalid-feedback">{defaultValueError}</div>}
                                </div>
                                <div className="acpt-col acpt-col-sm">
                                    <input
                                        ref={descriptionRef}
                                        defaultValue={description}
                                        placeholder="A brief description"
                                        onChange={e => handleChangeFieldDescription(e.target.value)}
                                        className={`acpt-form-control`}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    {(type === SELECT || type === SELECT_MULTI) && (
                        <div className="acpt-meta-options">
                            {optionBlocks && optionBlocks.length > 0
                                ? (
                                    <React.Fragment>
                                        <h4>Option list</h4>
                                        <SortableList
                                            items={optionBlocks}
                                            onSortEnd={onSortEnd}
                                            useDragHandle
                                            lockAxis="y"
                                            helperClass="dragging-helper-class"
                                            disableAutoscroll={false}
                                            useWindowAsScrollContainer={true}
                                        />
                                    </React.Fragment>
                                )
                                : (
                                    <div className="">
                                        No options already created. Create the first one now by clicking the button "Add option"!
                                    </div>
                                )
                            }
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    dispatch(createOption(boxId, id));
                                }}
                            >
                                <Icon icon="bx:bx-plus-circle" /> Add option
                            </a>
                        </div>
                    )}
                    {(type === POST) && (
                        relationBlocks && relationBlocks.length > 0 && relationBlocks[0]
                    )}
                </div>
            </div>
        </React.Fragment>
    )
};

export default CustomPostTypeMetaField;
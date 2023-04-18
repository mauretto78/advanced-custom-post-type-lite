import React, {useRef, useState} from 'react';
import Modal from "../../../../reusable/Modal";
import Tippy from "../../../../reusable/Tippy";
import {useDispatch, useSelector} from "react-redux";
import {deleteOption, updateOptionLabel, updateOptionValue} from "../../../../../redux/actions/metaStateActions";
import {filterById, isset} from "../../../../../utils/objects";
import {Icon} from "@iconify/react";

const MetaOption  = ({id, position, boxId, fieldId, dragHandle, isNew}) => {

    // manage global state
    const dispatch = useDispatch();
    const {validationErrors, values, selectedElement} = useSelector(state => state.metaStateReducer);
    const box = filterById(values, boxId);
    const fieldValues = (isset(box, "fields")) ? filterById(box.fields, fieldId): {};
    const optionValues = (isset(fieldValues, "options")) ? filterById(fieldValues.options, id): {};
    const fetchedLabel = (isset(optionValues, "label")) ? optionValues.label : 'label';
    const fetchedValue = (isset(optionValues, "value")) ? optionValues.value : 'value';

    const labelRef = useRef();
    const valueRef = useRef();

    const defaultLinkedOptionValue = () => {
        if(isNew){
            return true;
        }

        if(!isset(optionValues, "label") && !isset(optionValues, "value")){
            return true;
        }

        return optionValues.label === optionValues.value;
    };

    const blankLabel = () => {
        if (isset(optionValues, "label") && labelRef.current.value === 'label') {
            labelRef.current.value = '';
        }
    };

    const blankValue = () => {
        if (isset(optionValues, "value") && valueRef.current.value === 'value') {
            valueRef.current.value = '';
        }
    };

    const handleChangeOptionLabel = (l) => {
        if(linkedOption){
            valueRef.current.value = l;
            dispatch(updateOptionValue(id, boxId, fieldId, l));
        }

        dispatch(updateOptionLabel(id, boxId, fieldId, l));
    };

    const handleChangeOptionValue = (v) => {
        if(linkedOption){
            labelRef.current.value = v;
            dispatch(updateOptionLabel(id, boxId, fieldId, v));
        }

        dispatch(updateOptionValue(id, boxId, fieldId, v));
    };

    // manage local state
    const [linkedOption, setLinkedOption] = useState(defaultLinkedOptionValue());
    const [modalVisible, setModalVisible] = useState(false);
    const hasErrors = typeof validationErrors[id] !== 'undefined';

    const hasErrorType = (type) => {

        if(!hasErrors){
            return false;
        }

        return validationErrors[id].filter((validationError)=>{
            return validationError.type === type
        }).length > 0;
    };

    return(
        <React.Fragment>
            <Modal title={`Confirm deleting field "${fetchedLabel}"`} visible={modalVisible}>
                <p>Are you sure?</p>
                <p className="acpt-buttons">
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(deleteOption(boxId, fieldId, id));
                        }}
                    >
                        Yes
                    </a>
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
            <div
                className={`acpt-meta-option ${id === selectedElement ? 'selected' : ''}`}
                id={id}
            >
                <div className="acpt-row flex-center">
                    {dragHandle}
                    <div className="acpt-col acpt-col-sm">
                        <input
                            id={`option_label_${id}`}
                            ref={labelRef}
                            onClick={e => blankLabel()}
                            onChange={e => handleChangeOptionLabel(e.target.value)}
                            defaultValue={fetchedLabel}
                            className={`acpt-form-control ${hasErrorType('label') ? ' has-errors' : ''}`}
                            type="text"
                        />
                        {hasErrorType('label') && (
                            <div className="invalid-feedback">
                                <ul>
                                    {validationErrors[id]
                                        .filter((validationError) => {
                                            return validationError.type === 'label'
                                        }).
                                        map((validationError, index)=>(
                                            <li key={index}>
                                                {validationError.message}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div>
                        <Tippy title={linkedOption ? 'Label and value are linked' : 'Label and value are unlinked'}>
                            <a
                                className={`link-option ${linkedOption ? 'is-linked' : ''}`}
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    setLinkedOption(!linkedOption);
                                }}
                            >
                                <Icon icon="bx:bx-link" width="18px"/>
                            </a>
                        </Tippy>
                    </div>
                    <div className="acpt-col acpt-col-sm">
                        <input
                            id={`option_value_${id}`}
                            ref={valueRef}
                            onClick={e => blankValue()}
                            onChange={e => handleChangeOptionValue(e.target.value)}
                            defaultValue={fetchedValue}
                            className={`acpt-form-control ${hasErrorType('value') ? ' has-errors' : ''}`}
                            type="text"
                        />
                        {hasErrorType('value') && (
                            <div className="invalid-feedback">
                                <ul>
                                    {validationErrors[id]
                                        .filter((validationError) => {
                                            return validationError.type === 'value'
                                        }).
                                        map((validationError, index)=>(
                                            <li key={index}>
                                                {validationError.message}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <a
                        className=""
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Icon icon="bx:bx-trash" width="18px"/>
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
};

export default MetaOption;
import React, {useRef, useState} from 'react';
import Modal from "../../reusable/Modal";
import {useDispatch, useSelector} from "react-redux";
import {filterById, isset} from "../../../utils/objects";
import {Icon} from "@iconify/react";
import {deleteWooCommerceProductDataOption, updateWooCommerceProductDataOptionLabel, updateWooCommerceProductDataOptionValue} from "../../../redux/actions/WooCommerceFieldsStateAction";

const WooCommerceProductDataOption  = ({id, position, fieldId, dragHandle}) => {

    // manage global state
    const dispatch = useDispatch();
    const {values} = useSelector(state => state.WooCommerceFieldsStateReducer);
    const field = filterById(values, fieldId);
    const optionValues = (isset(field, "options")) ? filterById(field.options, id): [];
    const fetchedLabel = (isset(optionValues, "label")) ? optionValues.label : 'label';
    const fetchedValue = (isset(optionValues, "value")) ? optionValues.value : 'value';

    const labelRef = useRef();
    const valueRef = useRef();

    const blackLabel = () => {
        if (isset(optionValues, "label")) {
            labelRef.current.value = '';
        }
    };

    const blackValue = () => {
        if (isset(optionValues, "value")) {
            valueRef.current.value = '';
        }
    };

    const handleChangeOptionLabel = (l) => {
        dispatch(updateWooCommerceProductDataOptionLabel(id, field.productData, fieldId, l));
    };

    const handleChangeOptionValue = (v) => {
        dispatch(updateWooCommerceProductDataOptionValue(id, field.productData, fieldId, v));
    };

    // manage local state
    const [modalVisible, setModalVisible] = useState(false);

    return(
        <React.Fragment>
            <Modal title={`Confirm deleting field "${fetchedLabel}"`} visible={modalVisible}>
                <p>Are you sure?</p>
                <p>
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(deleteWooCommerceProductDataOption(fieldId, id));
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
            <div className="acpt-meta-option">
                <div className="acpt-row flex-center">
                    {dragHandle}
                    <div className="acpt-col acpt-col-sm">
                        <input
                            ref={labelRef}
                            onClick={e => blackLabel()}
                            onChange={e => handleChangeOptionLabel(e.target.value)}
                            defaultValue={fetchedLabel}
                            className={`acpt-form-control ${(fetchedLabel === '' || fetchedLabel && fetchedLabel.length > 255) ? ' has-errors' : ''}`}
                            type="text"
                        />
                        {fetchedLabel === '' && <span className="error-message">Option label cannot be blank</span>}
                        {fetchedLabel && fetchedLabel.length > 255 && <span className="error-message">Option label max length is 255 characters</span>}
                    </div>
                    <div className="acpt-col acpt-col-sm">
                        <input
                            ref={valueRef}
                            onClick={e => blackValue()}
                            onChange={e => handleChangeOptionValue(e.target.value)}
                            defaultValue={fetchedValue}
                            className={`acpt-form-control ${(fetchedValue === '' || fetchedValue && fetchedValue.length > 255) ? ' has-errors' : ''}`}
                            type="text"
                        />
                        {fetchedValue === '' && <span className="error-message">Option value cannot be blank</span>}
                        {fetchedValue && fetchedValue.length > 255 && <span className="error-message">Option value max length is 255 characters</span>}
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

export default WooCommerceProductDataOption;
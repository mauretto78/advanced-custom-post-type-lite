import React from "react";

import {
    CREATE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
    CREATE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
    DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
    DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
    DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_SUCCESS,
    DELETE_WOOCOMMERCE_PRODUCT_DATA_FIELD,
    DELETE_WOOCOMMERCE_PRODUCT_DATA_OPTION,
    HYDRATE_WOOCOMMERCE_PRODUCT_DATA_VALUES,
    SET_WOOCOMMERCE_PRODUCT_DATA_FIELDS,
    SET_WOOCOMMERCE_PRODUCT_DATA_OPTIONS,
    SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_INVALID,
    SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_SAVED,
    SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_VALID,
    SUBMIT_WOOCOMMERCE_PRODUCT_DATA_FAILURE,
    SUBMIT_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS,
    SUBMIT_WOOCOMMERCE_PRODUCT_DATA_SUCCESS,
    TOGGLE_WOOCOMMERCE_PRODUCT_DATA_FIELD_IS_REQUIRED,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DEFAULT_VALUE,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DESCRIPTION,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_NAME,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_TYPE,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_LABEL,
    UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_VALUE
} from "../actions/WooCommerceFieldsStateAction";

import {filterById, isset} from "../../utils/objects";
import {v4 as uuidv4} from 'uuid';
import {isAValidValueForThisType} from "../../utils/validation";
import WooCommerceProductDataField from "../../components/pages/WooCommerceProductDataFields/WooCommerceProductDataField";
import {TEXT} from "../../constants/fields";
import WooCommerceProductDataOption from "../../components/pages/WooCommerceProductDataFields/WooCommerceProductDataOption";

const initialState = {
    loading: false,
    success: false,
    errors: [],
    isValid: false,
    isSaved: true,
    fields: [],
    options: [],
    values: []
};

/**
 * This function checks if the state is valid or not
 *
 * @return boolean
 */
const stateIsValid = (state) => {

    if(state.values.length === 0){
        return false;
    }

    let errors = 0;

    state.values.map((field) => {
        if(field.name === '' || field.name === null || field.name.length > 255){
            errors++;
        }

        if(false === isAValidValueForThisType(field.type, field.defaultValue, field.options)){
            errors++;
        }

        field.options && field.options.map((option)=>{
            if(option.label === '' || option.label === null || (option.label && option.label.length > 255) ) {
                errors++;
            }

            if(option.value === '' || option.value === null || (option.value && option.value.length > 255) ) {
                errors++;
            }
        });
    });

    return errors === 0;
};

const validateState = (state) => {
    return {
        ...state,
        isValid: stateIsValid( state )
    };
};

export const WooCommerceFieldsStateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type)
    {
        /**
         * Create a field
         */
        case CREATE_WOOCOMMERCE_PRODUCT_DATA_FIELD:
            const id = uuidv4();
            const position = state.fields.length + 1;

            return validateState({
                ...state,
                isSaved: false,
                values: [
                    ...state.values,
                    {
                        id: id,
                        name: 'New Field',
                        isRequired: false,
                        type: TEXT,
                        postDataId: payload.postDataId
                    }
                ],
                fields: [
                    ...state.fields,
                    <WooCommerceProductDataField postDataId={payload.postDataId} id={id} position={position} />
                ]
            });

        /**
         * Create an option
         */
        case CREATE_WOOCOMMERCE_PRODUCT_DATA_OPTION:

            const oid = uuidv4();
            const oposition = state.options.length + 1;
            state.options.push(<WooCommerceProductDataOption id={oid} fieldId={payload.fieldId} position={oposition} />);

            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if(field.id === payload.fieldId){
                        if(!isset(field, "options")){
                            field.options = [];
                        }

                        if(field.id === payload.fieldId){
                            field.options.push({
                                id: oid,
                                fieldId: payload.fieldId,
                                label: 'label',
                                value: 'value'
                            });
                        }

                        return field;
                    } else {
                        return field;
                    }
                })
            });

        case DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS:
            console.log('delete of all WooCommerce product data in progress...');

            return {
                ...state,
                loading: true
            };

        case DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_FAILURE:
            console.error(payload.error);

            const prevErrs = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrs.includes(payload.error)){
                prevErrs.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrs
            };

        case DELETE_ALL_WOOCOMMERCE_PRODUCT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        /**
         * Delete a field
         */
        case DELETE_WOOCOMMERCE_PRODUCT_DATA_FIELD:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((field) => {
                    return field.id !== payload.fieldId;
                }),
                fields: state.fields.filter((field) => {
                    return field.props.id !== payload.fieldId;
                }),
                options: state.options.filter((option) => {
                    return option.props.fieldId !== payload.fieldId;
                }),
            });

        /**
         * Delete an option
         */
        case DELETE_WOOCOMMERCE_PRODUCT_DATA_OPTION:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((field) => {
                    if(field.id === payload.fieldId){
                        field.options = field.options.filter((option) => {
                            return option.id !== payload.id;
                        });

                        if(field.options.length === 0) {
                            delete field.options;
                        }

                        return field;
                    } else {
                        return field;
                    }
                }),
                options: state.options.filter((option) => {
                    return option.props.id !== payload.id;
                })
            });

        /**
         * Hydrate state values
         * and set UI
         */
        case HYDRATE_WOOCOMMERCE_PRODUCT_DATA_VALUES:

            // for UI
            let fields = [];
            let options = [];

            payload.values.map((field, index) => {

                fields.push(<WooCommerceProductDataField id={field.id} position={(index+1)} />);

                // options
                (isset(field, "options")) && field.options.map((option, index) => {
                    options.push(<WooCommerceProductDataOption id={option.id} fieldId={option.fieldId} position={(index+1)} />);
                });
            });

            return validateState({
                ...state,
                fields: fields,
                options: options,
                values: payload.values
            });

        /**
         * Set/sort boxes
         */
        case SET_WOOCOMMERCE_PRODUCT_DATA_FIELDS:

            let sortedFieldValues = [];

            payload.fields.map((field) => {
                sortedFieldValues.push(filterById(state.values, field.props.id));
            });

            return validateState({
                ...state,
                isSaved: false,
                values: sortedFieldValues,
                fields: payload.fields
            });

        /**
         * Set/sort options
         */
        case SET_WOOCOMMERCE_PRODUCT_DATA_OPTIONS:

            let sortedOptionsValues = [];

            const parentField = filterById(state.values, payload.fieldId);

            payload.options.map((option) => {
                const aaa = filterById(parentField.options, option.props.id);

                if(typeof aaa !== 'undefined'){
                    sortedOptionsValues.push(filterById(parentField.options, option.props.id));
                }
            });

            const parentFieldIndex = state.values.findIndex((obj => obj.id === payload.fieldId));

            state.values[parentFieldIndex].options = sortedOptionsValues;

            return validateState({
                ...state,
                isSaved: false,
                options: payload.options
            });


        case SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_SAVED:
            return {
                ...state,
                isSaved: true
            };

        case SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_VALID:
            return {
                ...state,
                isValid: true
            };

        case SET_WOOCOMMERCE_PRODUCT_DATA_STATUS_INVALID:
            return {
                ...state,
                isValid: false
            };

        case SUBMIT_WOOCOMMERCE_PRODUCT_DATA_IN_PROGRESS:
            console.log('submission of meta values in progress...');

            return {
                ...state,
                loading: true
            };

        case SUBMIT_WOOCOMMERCE_PRODUCT_DATA_FAILURE:
            console.error(payload.error);

            const prevErrors = (state.errors.length > 0) ? state.errors : [];
            if(!prevErrors.includes(payload.error)){
                prevErrors.push(payload.error);
            }

            return {
                ...state,
                loading: false,
                success: false,
                errors: prevErrors
            };

        case SUBMIT_WOOCOMMERCE_PRODUCT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        case TOGGLE_WOOCOMMERCE_PRODUCT_DATA_FIELD_IS_REQUIRED:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if(field.id === payload.id){
                        return  {
                            ...field,
                            id: payload.id,
                            postDataId: payload.postDataId,
                            isRequired: payload.isRequired,
                            name: (isset(field, "name")) ? field.name : null,
                            type: (isset(field, "type")) ? field.type : null,
                        };
                    } else {
                        return field;
                    }
                })
            });

        /**
         * Update a field name
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_NAME:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.id) {
                        return  {
                            ...field,
                            id: payload.id,
                            postDataId: payload.postDataId,
                            name: payload.name,
                            description: (isset(field, "description")) ? field.description : null,
                            defaultValue: (isset(field, "defaultValue")) ? field.defaultValue : null,
                            isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                            type: (isset(field, "type")) ? field.type : null,
                        };
                    } else {
                        return field;
                    }
                })
            });

        /**
         * Update a field default value
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DEFAULT_VALUE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.id) {
                        return  {
                            ...field,
                            id: payload.id,
                            postDataId: payload.postDataId,
                            name: (isset(field, "name")) ? field.name : null,
                            description: (isset(field, "description")) ? field.description : null,
                            defaultValue: payload.value,
                            isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                            type: (isset(field, "type")) ? field.type : null,
                        };
                    } else {
                        return field;
                    }
                })
            });

        /**
         * Update a field description
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_DESCRIPTION:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.id) {
                        return  {
                            ...field,
                            id: payload.id,
                            postDataId: payload.postDataId,
                            name: (isset(field, "name")) ? field.name : null,
                            description: payload.description,
                            defaultValue: (isset(field, "defaultValue")) ? field.defaultValue : null,
                            showInArchive: (isset(field, "showInArchive")) ? field.showInArchive : false,
                            isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                            type: (isset(field, "type")) ? field.type : null,
                        };
                    } else {
                        return field;
                    }
                })
            });

        /**
         * Update a field type
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_FIELD_TYPE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.id) {
                        return  {
                            ...field,
                            id: payload.id,
                            postDataId: payload.postDataId,
                            name: (isset(field, "name")) ? field.name : null,
                            description: (isset(field, "description")) ? field.description : null,
                            defaultValue: (isset(field, "defaultValue")) ? field.defaultValue : null,
                            isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                            type: payload.type,
                        };
                    } else {
                        return field;
                    }
                })
            });

        /**
         * Update an option label
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_LABEL:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.fieldId) {
                        field.options = field.options.map((option)=> {
                            if (option.id === payload.id) {
                                return  {
                                    id: payload.id,
                                    postDataId: payload.postDataId,
                                    fieldId: payload.fieldId,
                                    value: (isset(option, "value")) ? option.value : null,
                                    label: payload.label,
                                };
                            } else {
                                return option;
                            }
                        });
                    }
                })
            });

        /**
         * Update an option value
         */
        case UPDATE_WOOCOMMERCE_PRODUCT_DATA_OPTION_VALUE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((field) => {
                    if (field.id === payload.fieldId) {
                        field.options = field.options.map((option)=> {
                            if (option.id === payload.id) {
                                return  {
                                    id: payload.id,
                                    postDataId: payload.postDataId,
                                    fieldId: payload.fieldId,
                                    label: (isset(option, "label")) ? option.label : null,
                                    value: payload.value,
                                };
                            } else {
                                return option;
                            }
                        });
                    }
                })
            });
    }

    return state;
};
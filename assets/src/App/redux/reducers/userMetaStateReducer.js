import React from "react";
import UserMetaBox from "../../components/pages/UserMeta/UserMetaBox";
import UserMetaField from "../../components/pages/UserMeta/UserMetaField";
import UserMetaOption from "../../components/pages/UserMeta/UserMetaOption";
import {
    CREATE_USER_META_BOX,
    CREATE_USER_META_FIELD,
    CREATE_USER_META_OPTION,
    DELETE_ALL_USER_META_FAILURE,
    DELETE_ALL_USER_META_IN_PROGRESS,
    DELETE_ALL_USER_META_SUCCESS,
    DELETE_USER_META_BOX,
    DELETE_USER_META_FIELD,
    DELETE_USER_META_OPTION,
    HYDRATE_USER_META_VALUES,
    SET_USER_META_BOXES,
    SET_USER_META_FIELDS,
    SET_USER_META_OPTIONS,
    SET_USER_META_STATUS_INVALID,
    SET_USER_META_STATUS_SAVED,
    SET_USER_META_STATUS_VALID,
    SUBMIT_USER_META_FAILURE,
    SUBMIT_USER_META_IN_PROGRESS,
    SUBMIT_USER_META_SUCCESS,
    TOGGLE_USER_META_FIELD_IS_REQUIRED,
    TOGGLE_USER_META_FIELD_SHOW_IN_ARCHIVE,
    UPDATE_USER_META_BOX_TITLE,
    UPDATE_USER_META_FIELD_DEFAULT_VALUE,
    UPDATE_USER_META_FIELD_DESCRIPTION,
    UPDATE_USER_META_FIELD_NAME,
    UPDATE_USER_META_FIELD_TYPE,
    UPDATE_USER_META_OPTION_LABEL,
    UPDATE_USER_META_OPTION_VALUE
} from "../actions/userMetaStateActions";
import {filterById, isset} from "../../utils/objects";
import {TEXT} from "../../constants/fields";
import {v4 as uuidv4} from 'uuid';
import {isAValidValueForThisType} from "../../utils/validation";

const initialState = {
    loading: false,
    success: false,
    errors: [],
    isValid: false,
    isSaved: true,
    boxes: [],
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

    state.values.map((box) => {
        if(box.name === '' || box.name === null || box.name.length > 255){
            errors++;
        }

        box.fields && box.fields.map((field) => {
            if(field.name === '' || field.name === null || field.name.length > 255){
                errors++;
            }

            if(false === isAValidValueForThisType(field.type, field.defaultValue, field.options)){
                errors++;
            }

            field.options && field.options.map((option)=>{
                if(option.label === '' || option.label === null || option.label.length > 255) {
                    errors++;
                }

                if(option.value === '' || option.value === null || option.value.length > 255) {
                    errors++;
                }
            });
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

export const userMetaStateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        /**
         * Create a box
         */
        case CREATE_USER_META_BOX:
            const id = uuidv4();
            const position = state.boxes.length + 1;

            return validateState({
                ...state,
                isSaved: false,
                values: [
                    ...state.values,
                    {
                        id: id,
                        name: 'User meta box name'
                    }
                ],
                boxes: [
                    ...state.boxes,
                    <UserMetaBox id={id} position={position} />
                ]
            });

        /**
         * Create a field
         */
        case CREATE_USER_META_FIELD:

            const fid = uuidv4();
            const fposition = state.fields.length + 1;
            state.fields.push(<UserMetaField id={fid} boxId={payload.boxId} position={fposition} />);

            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){

                        if(!isset(box, "fields")){
                            box.fields = [];
                        }

                        box.fields.push({
                            id: fid,
                            boxId: payload.boxId,
                            name: 'New Field',
                            showInArchive: false,
                            isRequired: false,
                            type: TEXT,
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Create an option
         */
        case CREATE_USER_META_OPTION:

            const oid = uuidv4();
            const oposition = state.options.length + 1;
            state.options.push(<UserMetaOption id={oid} boxId={payload.boxId} fieldId={payload.fieldId} position={oposition} />);

            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        isset(box, "fields") && box.fields.map((field) => {
                            if(!isset(field, "options")){
                                field.options = [];
                            }

                            if(field.id === payload.fieldId){
                                field.options.push({
                                    id: oid,
                                    boxId: payload.boxId,
                                    fieldId: payload.fieldId,
                                    label: 'label',
                                    value: 'value'
                                });
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        case DELETE_ALL_USER_META_IN_PROGRESS:
            console.log('delete of all user meta values in progress...');

            return {
                ...state,
                loading: true
            };

        case DELETE_ALL_USER_META_FAILURE:
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

        case DELETE_ALL_USER_META_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        /**
         * Delete a box
         */
        case DELETE_USER_META_BOX:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((box) => {
                    return box.id !== payload.id;
                }),
                boxes: state.boxes.filter( ( box ) => {
                    return box.props.id !== payload.id;
                } ),
                fields: state.fields.filter((field) => {
                    return field.props.boxId !== payload.id;
                }),
                options: state.options.filter((option) => {
                    return option.props.boxId !== payload.id;
                }),
            });

        /**
         * Delete a field
         */
        case DELETE_USER_META_FIELD:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.filter((field) => {
                            return field.id !== payload.fieldId;
                        });

                        if(box.fields.length === 0) {
                            delete box.fields;
                        }

                        return box;
                    } else {
                        return box;
                    }
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
        case DELETE_USER_META_OPTION:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((box) => {
                    if(box.id === payload.boxId){
                        box.fields.filter((field) => {
                            if(field.id === payload.fieldId) {
                                field.options = field.options.filter((option) => {
                                    return option.id !== payload.id;
                                });

                                if(field.options.length === 0) {
                                    delete field.options;
                                }
                            }
                        });

                        return box;
                    } else {
                        return box;
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
        case HYDRATE_USER_META_VALUES:

            // for UI
            let boxes = [];
            let fields = [];
            let options = [];

            payload.values.map((box, index) => {

                // boxes
                boxes.push(<UserMetaBox id={box.id} position={(index+1)} />);

                // fields
                (isset(box, "fields")) && box.fields.map((field, index) => {

                    fields.push(<UserMetaField id={field.id} boxId={field.boxId} position={(index+1)} />);

                    // options
                    (isset(field, "options")) && field.options.map((option, index) => {
                        options.push(<UserMetaOption id={option.id} boxId={field.boxId} fieldId={option.fieldId} position={(index+1)} />);
                    });
                });
            });

            return validateState({
                ...state,
                boxes: boxes,
                fields: fields,
                options: options,
                values: payload.values
            });

        /**
         * Set/sort boxes
         */
        case SET_USER_META_BOXES:

            let sortedBoxesValues = [];

            payload.boxes.map((box) => {
                sortedBoxesValues.push(filterById(state.values, box.props.id));
            });

            return validateState({
                ...state,
                isSaved: false,
                values: sortedBoxesValues,
                boxes: payload.boxes
            });

        /**
         * Set/sort field
         */
        case SET_USER_META_FIELDS:

            let sortedFieldsValues = [];

            const box = filterById(state.values, payload.boxId);

            payload.fields.map((field) => {
                sortedFieldsValues.push(filterById(box.fields, field.props.id));
            });

            box.fields = sortedFieldsValues;
            const objIndex = state.values.findIndex((obj => obj.id === box.id));
            state.values[objIndex] = box;

            return validateState({
                ...state,
                isSaved: false,
                fields: payload.fields
            });

        /**
         * Set/sort options
         */
        case SET_USER_META_OPTIONS:

            let sortedOptionsValues = [];

            const parentBox = filterById(state.values, payload.boxId);
            const parentFields = filterById(parentBox.fields, payload.fieldId);

            payload.options.map((option) => {
                const aaa = filterById(parentFields.options, option.props.id);

                if(typeof aaa !== 'undefined'){
                    sortedOptionsValues.push(filterById(parentFields.options, option.props.id));
                }
            });

            const parentBoxIndex = state.values.findIndex((obj => obj.id === payload.boxId));
            const parentFieldIndex = state.values[parentBoxIndex].fields.findIndex((obj => obj.id === payload.fieldId));

            state.values[parentBoxIndex].fields[parentFieldIndex].options = sortedOptionsValues;

            return validateState({
                ...state,
                isSaved: false,
                options: payload.options
            });

        case SET_USER_META_STATUS_SAVED:
            return {
                ...state,
                isSaved: true
            };

        case SET_USER_META_STATUS_VALID:
            return {
                ...state,
                isValid: true
            };

        case SET_USER_META_STATUS_INVALID:
            return {
                ...state,
                isValid: false
            };

        case SUBMIT_USER_META_IN_PROGRESS:
            console.log('submission of user meta values in progress...');

            return {
                ...state,
                loading: true
            };

        case SUBMIT_USER_META_FAILURE:
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

        case SUBMIT_USER_META_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        /**
         * Toggle show in archive
         */
        case TOGGLE_USER_META_FIELD_SHOW_IN_ARCHIVE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
                                    showInArchive: payload.show,
                                    isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                                    name: (isset(field, "name")) ? field.name : null,
                                    type: (isset(field, "type")) ? field.type : null,
                                };
                            } else {
                                return field;
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        case TOGGLE_USER_META_FIELD_IS_REQUIRED:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
                                    isRequired: payload.isRequired,
                                    showInArchive: (isset(field, "showInArchive")) ? field.showInArchive : false,
                                    name: (isset(field, "name")) ? field.name : null,
                                    type: (isset(field, "type")) ? field.type : null,
                                };
                            } else {
                                return field;
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update box title
         */
        case UPDATE_USER_META_BOX_TITLE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map(
                    (box) => box.id === payload.id ? {...box, name: payload.name} : box
                )
            });

        /**
         * Update a field name
         */
        case UPDATE_USER_META_FIELD_NAME:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
                                    name: payload.name,
                                    description: (isset(field, "description")) ? field.description : null,
                                    defaultValue: (isset(field, "defaultValue")) ? field.defaultValue : null,
                                    showInArchive: (isset(field, "showInArchive")) ? field.showInArchive : false,
                                    isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                                    type: (isset(field, "type")) ? field.type : null,
                                };
                            } else {
                                return field;
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update a field default value
         */
        case UPDATE_USER_META_FIELD_DEFAULT_VALUE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
                                    name: (isset(field, "name")) ? field.name : null,
                                    description: (isset(field, "description")) ? field.description : null,
                                    defaultValue: payload.value,
                                    showInArchive: (isset(field, "showInArchive")) ? field.showInArchive : false,
                                    isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                                    type: (isset(field, "type")) ? field.type : null,
                                };
                            } else {
                                return field;
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update a field description
         */
        case UPDATE_USER_META_FIELD_DESCRIPTION:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
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
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update a field type
         */
        case UPDATE_USER_META_FIELD_TYPE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields = box.fields.map((field) => {
                            if (field.id === payload.id) {
                                return  {
                                    ...field,
                                    id: payload.id,
                                    boxId: payload.boxId,
                                    name: (isset(field, "name")) ? field.name : null,
                                    description: (isset(field, "description")) ? field.description : null,
                                    defaultValue: (isset(field, "defaultValue")) ? field.defaultValue : null,
                                    showInArchive: (isset(field, "showInArchive")) ? field.showInArchive : false,
                                    isRequired: (isset(field, "isRequired")) ? field.isRequired : false,
                                    type: payload.type,
                                };
                            } else {
                                return field;
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update an option label
         */
        case UPDATE_USER_META_OPTION_LABEL:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields.map((field) => {
                            if (field.id === payload.fieldId) {
                                field.options = field.options.map((option)=> {
                                    if (option.id === payload.id) {
                                        return  {
                                            id: payload.id,
                                            boxId: payload.boxId,
                                            fieldId: payload.fieldId,
                                            value: (isset(option, "value")) ? option.value : null,
                                            label: payload.label,
                                        };
                                    } else {
                                        return option;
                                    }
                                });
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });

        /**
         * Update an option value
         */
        case UPDATE_USER_META_OPTION_VALUE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields.map((field) => {
                            if (field.id === payload.fieldId) {
                                field.options = field.options.map((option)=> {
                                    if (option.id === payload.id) {
                                        return  {
                                            id: payload.id,
                                            boxId: payload.boxId,
                                            fieldId: payload.fieldId,
                                            label: (isset(option, "label")) ? option.label : null,
                                            value: payload.value,
                                        };
                                    } else {
                                        return option;
                                    }
                                });
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                })
            });
    }

    return state;
};
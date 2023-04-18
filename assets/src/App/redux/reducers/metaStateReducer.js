import React from "react";
import MetaBox from "../../components/reusable/Meta/MetaBox";
import MetaBoxField from "../../components/reusable/Meta/MetaBoxField";
import MetaOption from "../../components/reusable/Meta/MetaBoxField/MetaOption";

import {
    CREATE_BOX,
    CREATE_FIELD,
    CREATE_OPTION,
    DELETE_ALL_FAILURE,
    DELETE_ALL_IN_PROGRESS,
    DELETE_ALL_SUCCESS,
    DELETE_BOX,
    DELETE_FIELD,
    DELETE_OPTION,
    HYDRATE_VALUES,
    SET_BOXES,
    SET_FIELDS,
    SET_OPTIONS,
    SET_STATUS_INVALID,
    SET_STATUS_SAVED,
    SET_STATUS_VALID,
    SUBMIT_FAILURE,
    SUBMIT_IN_PROGRESS,
    SUBMIT_SUCCESS,
    TOGGLE_FIELD_IS_REQUIRED,
    TOGGLE_FIELD_SHOW_IN_ARCHIVE,
    UPDATE_BOX_TITLE,
    UPDATE_BOX_LABEL,
    UPDATE_FIELD_DEFAULT_VALUE,
    UPDATE_FIELD_DESCRIPTION,
    UPDATE_FIELD_NAME,
    UPDATE_FIELD_TYPE,
    UPDATE_OPTION_LABEL,
    UPDATE_OPTION_VALUE,
} from "../actions/metaStateActions";
import {filterById, isset} from "../../utils/objects";
import {TEXT} from "../../constants/fields";
import {v4 as uuidv4} from 'uuid';
import {alphanumericallyValid, isAValidValueForThisType} from "../../utils/validation";

const initialState = {
    loading: false,
    success: false,
    errors: [],
    isValid: false,
    isSaved: true,
    selectedElement: null,
    boxes: [],
    fields: [],
    options: [],
    relations: [],
    validationErrors: [],
    visibilityConditions: [],
    values: []
};

/**
 **********************************************************
 * HELPER FUNCTIONS
 * *********************************************************
 */

/**
 * 1. Validation
 * This function checks if the state is valid or not
 *
 * @return boolean
 */
const stateIsValid = (state) => {

    const validationErrors = [];
    const maxLengthSupport = 255;

    if(state.values.length === 0){
        return false;
    }

    let errors = 0;

    state.values.map((box) => {
        if(box.title.length > maxLengthSupport){
            validationErrors.push({id: box.id, type: 'title', message: `Box title too long (max ${maxLengthSupport} characters)`});
            errors++;
        }

        if(box.title === '' || box.title === null){
            validationErrors.push({id: box.id, type: 'title', message: `Box title cannot be black`});
            errors++;
        }

        if(true !== alphanumericallyValid(box.title)){
            validationErrors.push({id: box.id, type: 'title', message: "Box title is not alphanumerically [0-9a-zA-Z_-]"});
            errors++;
        }

        if(box.label && box.label.length > maxLengthSupport){
            validationErrors.push({id: box.id, type: 'label', message: `Box label too long (max ${maxLengthSupport} characters)`});
            errors++;
        }

        box.fields && box.fields.map((field) => {
            if(field.name.length > maxLengthSupport){
                validationErrors.push({id: field.id, type: 'name', message: `Field slug too long (max ${maxLengthSupport} characters)`});
                errors++;
            }

            if(field.name === '' || field.name === null){
                validationErrors.push({id: field.id, type: 'name', message: `Field slug cannot be blank`});
                errors++;
            }

            if(true !== alphanumericallyValid(field.name)){
                validationErrors.push({id: field.id, type: 'name', message: "Field slug is not alphanumerically [0-9a-zA-Z_-]"});
                errors++;
            }

            if(false === isAValidValueForThisType(field.type, field.defaultValue, field.options)){
                validationErrors.push({id: field.id, type: 'defaultValue', message: "Invalid default field value"});
                errors++;
            }

            field.options && field.options.map((option)=>{

                if(option.label.length > maxLengthSupport) {
                    validationErrors.push({id:option.id, type: 'label', message: `Option label too long (max ${maxLengthSupport} characters)`});
                    errors++;
                }

                if(option.label === '' || option.label === null) {
                    validationErrors.push({id:option.id, type: 'label', message: `Option label cannot be blank`});
                    errors++;
                }

                if(option.value.length > maxLengthSupport) {
                    validationErrors.push({id:option.id, type: 'value', message: `Option value too long (max ${maxLengthSupport} characters)`});
                    errors++;
                }

                if(option.value === '' || option.value === null) {
                    validationErrors.push({id:option.id, type: 'value', message: `Option value cannot be blank`});
                    errors++;
                }
            });
        });
    });

    updateValidationErrors(validationErrors, state);

    return errors === 0;
};

const updateValidationErrors = (validationErrors, state) => {

    state.validationErrors = [];

    validationErrors.map((validationError) => {

        if(typeof state.validationErrors[validationError.id] === 'undefined'){
            state.validationErrors[validationError.id] = [];
        }

        state.validationErrors[validationError.id].push({message: validationError.message, type: validationError.type});
    });
};

const validateState = (state) => {
    return  {
        ...state,
        isValid: stateIsValid( state )
    };
};

export const metaStateReducer = ( state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {

        /**
         * Create a box
         */
        case CREATE_BOX:
            const id = uuidv4();
            const position = state.boxes.length + 1;

            return validateState({
                ...state,
                isSaved: false,
                values: [
                    ...state.values,
                    {
                        id: id,
                        title: 'meta_box_title',
                        belongsTo: payload.belongsTo,
                        find: payload.find,
                    }
                ],
                boxes: [
                    ...state.boxes,
                    <MetaBox
                        belongsTo={payload.belongsTo}
                        find={payload.find}
                        id={id}
                        position={position}
                        isSaved={false}
                    />
                ]
            });

        /**
         * Create a field
         */
        case CREATE_FIELD:

            const fid = uuidv4();
            const fposition = state.fields.length + 1;

            state.fields.push(<MetaBoxField id={fid} parentId={payload.parentId} boxId={payload.boxId} position={fposition} isSaved={false} />);

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
                            parentId: payload.parentId,
                            name: 'new_field',
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
        case CREATE_OPTION:

            const oid = uuidv4();
            const oposition = state.options.length + 1;
            state.options.push(<MetaOption id={oid} boxId={payload.boxId} fieldId={payload.fieldId} position={oposition} isNew={true} />);

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

        case DELETE_ALL_IN_PROGRESS:
            console.log('delete of all meta values in progress...');

            return {
                ...state,
                loading: true
            };

        case DELETE_ALL_FAILURE:
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

        case DELETE_ALL_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        /**
         * Delete a box
         */
        case DELETE_BOX:
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
                relations: state.relations.filter((option) => {
                    return option.props.boxId !== payload.id;
                })
            });

        /**
         * Delete a field
         */
        case DELETE_FIELD:
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
                relations: state.relations.filter((relation) => {
                    return relation.props.fieldId !== payload.fieldId;
                })
            });

        /**
         * Delete an option
         */
        case DELETE_OPTION:
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
        case HYDRATE_VALUES:

            // for UI
            let boxes = [];
            let fields = [];
            let options = [];

            /**
             * This function converts extract meta field children and put them in the main `fields` array
             *
             * @param values
             * @return {*}
             */
            const convertValues = (values) => {

                let converted = [];

                values.map((box)=>{
                    box.fields.map((field)=>{
                        convertField(box, field);
                    });

                    converted.push(box);
                });

                return converted;
            };

            /**
             * Recursively push field to box.fields array
             *
             * @param box
             * @param field
             */
            const convertField = (box, field) => {
                if(field.hasChildren){
                    field.children.map((child)=>{
                        box.fields.push(child);
                        convertField(box, child);
                    });
                }
            };

            /**
             * Hydrate field
             *
             * @param field
             * @param index
             */
            const hydrateField = (field, index) => {

                // parent
                if(field.parentId !== null){
                    fields.push(<MetaBoxField id={field.id} boxId={field.boxId} parentId={field.parentId} position={(index+1)} isSaved={true} />);
                } else {
                    fields.push(<MetaBoxField id={field.id} boxId={field.boxId} position={(index+1)} isSaved={true} />);
                }

                // options
                (isset(field, "options")) && field.options.map((option, index) => {
                    options.push(<MetaOption id={option.id} boxId={field.boxId} fieldId={option.fieldId} position={(index+1)} isNew={false} />);
                });

                // children
                if(field.hasChildren){
                    field.children.map((child, childIndex) => {
                        hydrateField(child, childIndex);
                    });
                }
            };

            payload.values.map((box, index) => {

                // boxes
                boxes.push(<MetaBox
                    belongsTo={box.belongsTo}
                    find={box.find}
                    id={box.id}
                    position={(index+1)}
                    isSaved={true}
                />);

                // fields
                (isset(box, "fields")) && box.fields.map((field, index) => {
                    hydrateField(field, index);
                });
            });

            return validateState({
                ...state,
                boxes: boxes,
                fields: fields,
                options: options,
                values: convertValues(payload.values)
            });

        /**
         * Set/sort boxes
         */
        case SET_BOXES:

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
        case SET_FIELDS:

            let sortedFieldsValues = [];

            const box = filterById(state.values, payload.boxId);

            payload.fields.map((field) => {
                sortedFieldsValues.push(filterById(box.fields, field.props.id));
            });

            box.fields = sortedFieldsValues;
            const objIndex = state.values.findIndex((obj => obj.id === box.id));
            state.values[objIndex] = box;

            // merge state.fields and payload.fields
            const newFieldsIds = payload.fields.map((field) => field.props.id);
            const otherFields = state.fields.filter((field) => false === newFieldsIds.includes(field.props.id));
            const mergedFields = [...payload.fields, ...otherFields];

            return validateState({
                ...state,
                isSaved: false,
                fields: mergedFields
            });

        /**
         * Set/sort options
         */
        case SET_OPTIONS:

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

        case SET_STATUS_SAVED:
            return {
                ...state,
                isSaved: true
            };

        case SET_STATUS_VALID:
            return {
                ...state,
                isValid: true
            };

        case SET_STATUS_INVALID:
            return {
                ...state,
                isValid: false
            };

        case SUBMIT_IN_PROGRESS:
            console.log('submission of meta values in progress...');

            return {
                ...state,
                loading: true
            };

        case SUBMIT_FAILURE:
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

        case SUBMIT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                errors: []
            };

        /**
         * Toggle show in archive
         */
        case TOGGLE_FIELD_SHOW_IN_ARCHIVE:
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

        case TOGGLE_FIELD_IS_REQUIRED:
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
        case UPDATE_BOX_TITLE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map(
                    (box) => box.id === payload.id ? {...box, title: payload.title} : box
                )
            });

        /**
         * Update box label
         */
        case UPDATE_BOX_LABEL:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map(
                    (box) => box.id === payload.id ? {...box, label: payload.label} : box
                )
            });

        /**
         * Update a field name
         */
        case UPDATE_FIELD_NAME:
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
        case UPDATE_FIELD_DEFAULT_VALUE:
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
        case UPDATE_FIELD_DESCRIPTION:
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
        case UPDATE_FIELD_TYPE:
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
        case UPDATE_OPTION_LABEL:
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
        case UPDATE_OPTION_VALUE:
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
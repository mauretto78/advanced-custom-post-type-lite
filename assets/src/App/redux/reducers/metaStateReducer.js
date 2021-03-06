import React from "react";
import CustomPostTypeMetaBox from "../../components/pages/CustomPostTypeMeta/CustomPostTypeMetaBox";
import CustomPostTypeMetaField from "../../components/pages/CustomPostTypeMeta/CustomPostTypeMetaField";
import CustomPostTypeMetaOption from "../../components/pages/CustomPostTypeMeta/CustomPostTypeMetaOption";
import {
    CREATE_BOX,
    CREATE_FIELD,
    CREATE_OPTION,
    CREATE_RELATION,
    DELETE_ALL_FAILURE,
    DELETE_ALL_IN_PROGRESS,
    DELETE_ALL_SUCCESS,
    DELETE_BOX,
    DELETE_FIELD,
    DELETE_OPTION,
    DELETE_RELATION,
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
    UPDATE_FIELD_DEFAULT_VALUE,
    UPDATE_FIELD_DESCRIPTION,
    UPDATE_FIELD_NAME,
    UPDATE_FIELD_TYPE,
    UPDATE_OPTION_LABEL,
    UPDATE_OPTION_VALUE,
    UPDATE_RELATION_INVERSED_FIELD,
    UPDATE_RELATION_POST,
    UPDATE_RELATION_TYPE,
} from "../actions/metaStateActions";
import {filterById, isset} from "../../utils/objects";
import CustomPostTypeMetaRelationship from "../../components/pages/CustomPostTypeMeta/CustomPostTypeRelationship";
import {TEXT} from "../../constants/fields";
import {isBidirectional} from "../../utils/relations";
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
    relations: [],
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
        if(box.title === '' || box.title === null || box.title.length > 255){
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

            field.relations && field.relations.map((relation)=>{

                if(!isset(relation, "relatedPostType") || relation.relatedPostType === '' || relation.relatedPostType === null) {
                    errors++;
                }

                if(!isset(relation, "type") || relation.type === '' || relation.type === null) {
                    errors++;
                }

                if(relation.type && isBidirectional(relation.type)){

                    if(!isset(relation, "inversedBoxId") || relation.inversedBoxId === '' || relation.inversedBoxId === null) {
                        errors++;
                    }

                    if(!isset(relation, "inversedFieldId") || relation.inversedFieldId === '' || relation.inversedFieldId === null) {
                        errors++;
                    }

                    if(!isset(relation, "inversedFieldName") || relation.inversedFieldName === '' || relation.inversedFieldName === null || relation.inversedFieldName.length > 255) {
                        errors++;
                    }
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
                        title: 'Meta box title',
                        postType: payload.postType
                    }
                ],
                boxes: [
                    ...state.boxes,
                    <CustomPostTypeMetaBox postType={payload.postType} id={id} position={position} />
                ]
            });

        /**
         * Create a field
         */
        case CREATE_FIELD:

            const fid = uuidv4();
            const fposition = state.fields.length + 1;
            state.fields.push(<CustomPostTypeMetaField id={fid} boxId={payload.boxId} position={fposition} />);

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
        case CREATE_OPTION:

            const oid = uuidv4();
            const oposition = state.options.length + 1;
            state.options.push(<CustomPostTypeMetaOption id={oid} boxId={payload.boxId} fieldId={payload.fieldId} position={oposition} />);

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

        /**
         * Create an option
         */
        case CREATE_RELATION:

            const rid = uuidv4();

            // destroy relations with selected boxId/fieldId
            state.relations.map((relation, index)=>{
                if (relation.props.boxId === payload.boxId && relation.props.fieldId === payload.fieldId){
                    state.relations.splice(index, 1);
                }
            });
            state.relations.push(<CustomPostTypeMetaRelationship id={rid} boxId={payload.boxId} fieldId={payload.fieldId} />);

            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        isset(box, "fields") && box.fields.map((field) => {
                            if(!isset(field, "relations")){
                                field.relations = [];
                            }

                            if(field.id === payload.fieldId){
                                field.relations.push({
                                    id: rid,
                                    boxId: payload.boxId,
                                    fieldId: payload.fieldId,
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
         * Delete a relation
         */
        case DELETE_RELATION:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.filter((box) => {
                    if(box.id === payload.boxId){
                        box.fields.filter((field) => {
                            if(field.id === payload.fieldId) {

                                field.relations = field.relations.filter((relation) => {
                                    return relation.id !== payload.id;
                                });

                                if(field.relations.length === 0) {
                                    delete field.relations;
                                }
                            }
                        });

                        return box;
                    } else {
                        return box;
                    }
                }),
                relations: state.relations.filter((relation) => {
                    return relation.props.id !== payload.id;
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
            let relations = [];

            payload.values.map((box, index) => {

                // boxes
                boxes.push(<CustomPostTypeMetaBox postType={box.postType} id={box.id} position={(index+1)} />);

                // fields
                (isset(box, "fields")) && box.fields.map((field, index) => {

                    fields.push(<CustomPostTypeMetaField id={field.id} boxId={field.boxId} position={(index+1)} />);

                    // options
                    (isset(field, "options")) && field.options.map((option, index) => {
                        options.push(<CustomPostTypeMetaOption id={option.id} boxId={field.boxId} fieldId={option.fieldId} position={(index+1)} />);
                    });

                    // relations
                    (isset(field, "relations")) && field.relations.map((relation, index) => {
                        relations.push(<CustomPostTypeMetaRelationship id={relation.id} boxId={field.boxId} fieldId={relation.fieldId} />);
                    });
                });
            });

            return validateState({
                ...state,
                boxes: boxes,
                fields: fields,
                options: options,
                relations: relations,
                values: payload.values
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

            return validateState({
                ...state,
                isSaved: false,
                fields: payload.fields
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

        case UPDATE_RELATION_POST:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields.map((field) => {
                            if (field.id === payload.fieldId) {
                                field.relations = field.relations.map((relation)=> {
                                    if (relation.id === payload.id) {
                                        return  {
                                            id: payload.id,
                                            boxId: payload.boxId,
                                            fieldId: payload.fieldId,
                                            relatedPostType: payload.relatedPostType,
                                            type: (isset(relation, "type")) ? relation.type : null,
                                        };
                                    } else {
                                        return relation;
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

        case UPDATE_RELATION_TYPE:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields.map((field) => {
                            if (field.id === payload.fieldId) {
                                field.relations = field.relations.map((relation)=> {
                                    if (relation.id === payload.id) {
                                        return  {
                                            id: payload.id,
                                            boxId: payload.boxId,
                                            fieldId: payload.fieldId,
                                            relatedPostType: (isset(relation, "relatedPostType")) ? relation.relatedPostType : null,
                                            type: payload.type,
                                        };
                                    } else {
                                        return relation;
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

        case UPDATE_RELATION_INVERSED_FIELD:
            return validateState({
                ...state,
                isSaved: false,
                values: state.values.map((box) => {
                    if(box.id === payload.boxId){
                        box.fields.map((field) => {
                            if (field.id === payload.fieldId) {
                                field.relations = field.relations.map((relation)=> {
                                    if (relation.id === payload.id) {
                                        return  {
                                            id: payload.id,
                                            boxId: payload.boxId,
                                            fieldId: payload.fieldId,
                                            relatedPostType: (isset(relation, "relatedPostType")) ? relation.relatedPostType : null,
                                            type: (isset(relation, "type")) ? relation.type : null,
                                            inversedBoxId: payload.inversedBoxId,
                                            inversedBoxName: payload.inversedBoxName,
                                            inversedFieldId: payload.inversedFieldId ? payload.inversedFieldId : uuidv4(),
                                            inversedFieldName: payload.inversedFieldName,
                                        };
                                    } else {
                                        return relation;
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
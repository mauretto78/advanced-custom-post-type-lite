export const CREATE_BOX = 'CREATE_BOX';
export const CREATE_FIELD = 'CREATE_FIELD';
export const CREATE_OPTION = 'CREATE_OPTION';
export const DELETE_ALL_FAILURE = 'DELETE_ALL_FAILURE';
export const DELETE_ALL_IN_PROGRESS = 'DELETE_ALL_IN_PROGRESS';
export const DELETE_ALL_SUCCESS = 'DELETE_ALL_SUCCESS';
export const DELETE_BOX = 'DELETE_BOX';
export const DELETE_FIELD = 'DELETE_FIELD';
export const DELETE_OPTION = 'DELETE_OPTION';
export const HYDRATE_VALUES = 'HYDRATE_VALUES';
export const SET_BOXES = 'SET_BOXES';
export const SET_FIELDS = 'SET_FIELDS';
export const SET_OPTIONS = 'SET_OPTIONS';
export const SET_STATUS_INVALID = 'SET_STATUS_INVALID';
export const SET_STATUS_SAVED = 'SET_STATUS_SAVED';
export const SET_STATUS_VALID = 'SET_STATUS_VALID';
export const SUBMIT_IN_PROGRESS = 'SUBMIT_IN_PROGRESS';
export const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'SUBMIT_FAILURE';
export const TOGGLE_FIELD_SHOW_IN_ARCHIVE = 'TOGGLE_FIELD_SHOW_IN_ARCHIVE';
export const TOGGLE_FIELD_IS_REQUIRED = 'TOGGLE_FIELD_IS_REQUIRED';
export const UPDATE_BOX_TITLE = 'UPDATE_BOX_TITLE';
export const UPDATE_BOX_LABEL = 'UPDATE_BOX_LABEL';
export const UPDATE_FIELD_NAME = 'UPDATE_FIELD_NAME';
export const UPDATE_FIELD_DEFAULT_VALUE = 'UPDATE_FIELD_DEFAULT_VALUE';
export const UPDATE_FIELD_DESCRIPTION = 'UPDATE_FIELD_DESCRIPTION';
export const UPDATE_FIELD_TYPE = 'UPDATE_FIELD_TYPE';
export const UPDATE_OPTION_LABEL = 'UPDATE_OPTION_LABEL';
export const UPDATE_OPTION_VALUE = 'UPDATE_OPTION_VALUE';

export const createBox = (belongsTo, find) => {
    return {
        type: CREATE_BOX,
        payload: {
            belongsTo: belongsTo,
            find: find,
        },
    };
};

export const createField = (boxId, parentId) => {
    return {
        type: CREATE_FIELD,
        payload: {
            boxId: boxId,
            parentId: parentId
        },
    };
};

export const createOption = (boxId, fieldId) => {
    return {
        type: CREATE_OPTION,
        payload: {
            boxId: boxId,
            fieldId: fieldId
        },
    };
};

export const deleteAllInProgress = () => {
    return {
        type: DELETE_ALL_IN_PROGRESS,
    };
};

export const deleteAllSuccess = () => {
    return {
        type: DELETE_ALL_SUCCESS
    };
};

export const deleteAllFailure = (error) => {
    return {
        type: DELETE_ALL_FAILURE,
        payload: {
            error: error
        },
    };
};

export const deleteBox = (id) => {
    return {
        type: DELETE_BOX,
        payload: {
            id: id
        },
    };
};

export const deleteField = (boxId, fieldId) => {
    return {
        type: DELETE_FIELD,
        payload: {
            boxId: boxId,
            fieldId: fieldId,
        },
    };
};

export const deleteOption = (boxId, fieldId, id) => {
    return {
        type: DELETE_OPTION,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
        },
    };
};

export const hydrateValues = (values) => {
    return {
        type: HYDRATE_VALUES,
        payload: {
            values: values
        },
    };
};

export const setBoxes = (boxes) => {
    return {
        type: SET_BOXES,
        payload: {
            boxes: boxes
        },
    };
};

export const setFields = (boxId, fields) => {
    return {
        type: SET_FIELDS,
        payload: {
            boxId: boxId,
            fields: fields
        },
    };
};

export const setOptions = (boxId, fieldId, options) => {
    return {
        type: SET_OPTIONS,
        payload: {
            boxId: boxId,
            fieldId: fieldId,
            options: options
        },
    };
};

export const setStatusSaved = () => {
    return {
        type: SET_STATUS_SAVED
    };
};

export const setStatusValid = () => {
    return {
        type: SET_STATUS_VALID
    };
};

export const setStatusInvalid = () => {
    return {
        type: SET_STATUS_INVALID
    };
};

export const submitInProgress = () => {
    return {
        type: SUBMIT_IN_PROGRESS,
    };
};

export const submitSuccess = () => {
    return {
        type: SUBMIT_SUCCESS
    };
};

export const submitFailure = (error) => {
    return {
        type: SUBMIT_FAILURE,
        payload: {
            error: error
        },
    };
};

export const toggleFieldShowInArchive = (id, boxId, show) => {
    return {
        type: TOGGLE_FIELD_SHOW_IN_ARCHIVE,
        payload: {
            id: id,
            boxId: boxId,
            show: show
        },
    };
};

export const toggleFieldIsRequired = (id, boxId, isRequired) => {
    return {
        type: TOGGLE_FIELD_IS_REQUIRED,
        payload: {
            id: id,
            boxId: boxId,
            isRequired: isRequired
        },
    };
};

export const updateBoxTitle = (id, title) => {
    return {
        type: UPDATE_BOX_TITLE,
        payload: {
            id: id,
            title: title
        },
    };
};

export const updateBoxLabel = (id, label) => {
    return {
        type: UPDATE_BOX_LABEL,
        payload: {
            id: id,
            label: label
        },
    };
};

export const updateFieldName = (id, boxId, name) => {
    return {
        type: UPDATE_FIELD_NAME,
        payload: {
            id: id,
            boxId: boxId,
            name: name
        },
    };
};

export const updateFieldDefaultValue = (id, boxId, value) => {
    return {
        type: UPDATE_FIELD_DEFAULT_VALUE,
        payload: {
            id: id,
            boxId: boxId,
            value: value
        },
    };
};

export const updateFieldDescription = (id, boxId, description) => {
    return {
        type: UPDATE_FIELD_DESCRIPTION,
        payload: {
            id: id,
            boxId: boxId,
            description: description
        },
    };
};

export const updateFieldType = (id, boxId, type) => {
    return {
        type: UPDATE_FIELD_TYPE,
        payload: {
            id: id,
            boxId: boxId,
            type: type
        },
    };
};

export const updateOptionLabel = (id, boxId, fieldId, label) => {
    return {
        type: UPDATE_OPTION_LABEL,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
            label: label,
        },
    };
};

export const updateOptionValue = (id, boxId, fieldId, value) => {
    return {
        type: UPDATE_OPTION_VALUE,
        payload: {
            id: id,
            boxId: boxId,
            fieldId: fieldId,
            value: value,
        },
    };
};
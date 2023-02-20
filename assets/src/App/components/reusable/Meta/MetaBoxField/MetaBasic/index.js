import React from 'react';
import Select from "react-select";
import {reactSelectStyles} from "../../../../../constants/styles";
import {
    SELECT,
    fieldsListGroupedOptions
} from "../../../../../constants/fields";
import {SortableList} from "../../../../reusable/Sortable";
import {createField, createOption} from "../../../../../redux/actions/metaStateActions";
import {useDispatch} from "react-redux";

const MetaBasic  = (props) => {

    const {
        fieldType,
        nameRef,
        name,
        blackName,
        handleChangeFieldName,
        fieldRef,
        defaultFieldValue,
        handleUpdateFieldType,
        description,
        defaultValue,
        defaultValueRef,
        handleChangeFieldDefaultValue,
        defaultValueError,
        descriptionRef,
        handleChangeFieldDescription,
        optionBlocks,
        onSortEnd,
        boxId,
        fieldId,
        relationBlocks,
        childrenFieldsBlocks,
        onChildrenSortEnd,
        validationErrors,
        belongsTo
    } = props;

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const hasErrors = typeof validationErrors[fieldId] !== 'undefined';

    const hasErrorType = (type) => {

        if(!hasErrors){
            return false;
        }

        return validationErrors[fieldId].filter((validationError)=>{
            return validationError.type === type
        }).length > 0;
    };

    return (
        <div className="fields-wrapper">
            <div className="acpt-row">
                <div className="acpt-col acpt-col-sm">
                    <label className="acpt-form-label" htmlFor={`fieldSlug_${fieldId}`}>
                        Field slug. Only alphanumeric (latin) characters allowed, without spaces<span className="required">*</span>
                    </label>
                    <input
                        id={`fieldSlug_${fieldId}`}
                        ref={nameRef}
                        defaultValue={name}
                        placeholder="Field slug (Ex. gallery or text_1)"
                        onClick={e => blackName()}
                        onChange={e => handleChangeFieldName(e.target.value)}
                        className={`acpt-form-control ${(name === '' || hasErrorType('name')) ? ' has-errors' : ''}`}
                        type="text"
                    />
                    {hasErrorType('name') && (
                        <div className="invalid-feedback">
                            <ul>
                                {validationErrors[fieldId]
                                    .filter((validationError) => {
                                        return validationError.type === 'name'
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
                <div className="acpt-col acpt-col-sm">
                    <label className="acpt-form-label" htmlFor={`fieldType_${fieldId}`}>
                        Choose the field type <span className="required">*</span>
                    </label>
                    <Select
                        id={`fieldType_${fieldId}`}
                        ref={fieldRef}
                        defaultValue={defaultFieldValue}
                        placeholder="Select field type from list"
                        onChange={(obj) => handleUpdateFieldType(obj.value) }
                        styles={reactSelectStyles}
                        options={fieldsListGroupedOptions}
                    />
                </div>
            </div>
            {fieldType &&
            <React.Fragment>
                <div className="acpt-row">
                    <div className="acpt-col acpt-col-sm">
                        <label className="acpt-form-label" htmlFor={`defaultValue_${fieldId}`}>
                            The default value for this field
                        </label>
                        <input
                            id={`defaultValue_${fieldId}`}
                            ref={defaultValueRef}
                            defaultValue={defaultValue}
                            placeholder="Default value"
                            onChange={e => handleChangeFieldDefaultValue(e.target.value)}
                            className={`acpt-form-control ${(defaultValueError || hasErrorType('defaultValue')) ? ' has-errors' : ''}`}
                            type="text"
                        />
                        {defaultValueError && <div className="invalid-feedback">{defaultValueError}</div>}
                        {hasErrorType('defaultValue') && (
                            <div className="invalid-feedback">
                                <ul>
                                    {validationErrors[fieldId]
                                        .filter((validationError) => {
                                            return validationError.type === 'defaultValue'
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
                    <div className="acpt-col acpt-col-sm">
                        <label className="acpt-form-label" htmlFor={`description_${fieldId}`}>
                            The description of this field (showed only on admin panel)
                        </label>
                        <input
                            id={`description_${fieldId}`}
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
            {(fieldType === SELECT) && (
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
                            <div className="mb-2">
                                No options already created. Create the first one now by clicking the button "Add option"!
                            </div>
                        )
                    }
                    <a
                        className="acpt-btn acpt-btn-primary-o"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            dispatch(createOption(boxId, fieldId));
                        }}
                    >
                        Add option
                    </a>
                </div>
            )}
        </div>
    );
};

export default MetaBasic;
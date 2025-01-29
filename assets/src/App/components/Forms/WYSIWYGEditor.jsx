import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../scss/quill.scss";
import {QUILL_FORMATS, QUILL_MODULES} from "../../constants/quill";

const WYSIWYGEditor = ({id, setValue, placeholder, validate, register, defaultValue, description, characterLimit = null, className = null}) => {

    useEffect(() => {
        register(id, validate);
    }, [register]);

    const [editorValue, setEditorValue] = useState(defaultValue ? defaultValue : null);

    const onEditorStateChange = (editorState) => {
        setEditorValue(editorState);
        setValue(id, editorState);
    };

    const checkCharacterCount = (event) => {
        if(!characterLimit){
            return;
        }

        if (editorValue.length > characterLimit && event.key !== 'Backspace') {
            event.preventDefault();
        }
    };

    return (
        <React.Fragment>
            <ReactQuill
                className={className}
                theme="snow"
                value={editorValue}
                onKeyDown={checkCharacterCount}
                onChange={onEditorStateChange}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder={placeholder}
            />
            {description && (
                <div className="form-description">{description}</div>
            )}
        </React.Fragment>
    );
};

WYSIWYGEditor.propTypes = {
    id: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    validate: PropTypes.func,
    register: PropTypes.func.isRequired,
    description: PropTypes.string,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    characterLimit: PropTypes.number
};

export default WYSIWYGEditor;
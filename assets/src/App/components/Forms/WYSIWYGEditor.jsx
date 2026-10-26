import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../scss/quill.scss";
import {QUILL_FORMATS, QUILL_MODULES, QUILL_FORMATS_COMPACT, QUILL_MODULES_COMPACT} from "../../constants/quill";
import useTranslation from "../../hooks/useTranslation";

// react-quill / Quill 1.3.7's default snow toolbar renders icon-only
// buttons/pickers with no accessible name at all — this is the "workaround"
// referenced by the a11y roadmap's Phase 3, applied once here for every
// WYSIWYGEditor instance rather than per call site.
const TOOLBAR_BUTTON_LABELS = {
    'ql-bold': 'Bold',
    'ql-italic': 'Italic',
    'ql-underline': 'Underline',
    'ql-strike': 'Strikethrough',
    'ql-blockquote': 'Blockquote',
    'ql-list[value="ordered"]': 'Numbered list',
    'ql-list[value="bullet"]': 'Bulleted list',
    'ql-indent[value="-1"]': 'Decrease indent',
    'ql-indent[value="+1"]': 'Increase indent',
    'ql-link': 'Insert link',
    'ql-image': 'Insert image',
    'ql-video': 'Insert video',
    'ql-clean': 'Remove formatting',
};

const TOOLBAR_PICKER_LABELS = {
    'ql-header': 'Heading style',
    'ql-font': 'Font',
    'ql-size': 'Font size',
};

const WYSIWYGEditor = ({id, ariaLabel, setValue, placeholder, validate, register, defaultValue, description, characterLimit = null, className = null, compact = false}) => {

    const quillRef = useRef(null);

    useEffect(() => {
        register(id, validate);
    }, [register]);

    // label the actual contentEditable region and the toolbar controls —
    // react-quill exposes neither via a prop, so it's applied directly to
    // the underlying Quill DOM once the editor instance mounts.
    useEffect(() => {
        const editor = quillRef.current?.getEditor?.();

        if(!editor){
            return;
        }

        if(ariaLabel){
            // .ql-editor is a bare contentEditable div; give it an explicit
            // textbox role so the aria-label is valid on it (#1282).
            editor.root.setAttribute('role', 'textbox');
            editor.root.setAttribute('aria-multiline', 'true');
            editor.root.setAttribute('aria-label', ariaLabel);
        }

        const toolbarEl = editor.getModule('toolbar')?.container;

        if(!toolbarEl){
            return;
        }

        Object.entries(TOOLBAR_BUTTON_LABELS).forEach(([selector, label]) => {
            toolbarEl.querySelectorAll(`button.${selector}`).forEach((btn) => {
                if(!btn.getAttribute('aria-label')){
                    btn.setAttribute('aria-label', useTranslation(label));
                }
            });
        });

        Object.entries(TOOLBAR_PICKER_LABELS).forEach(([className, label]) => {
            toolbarEl.querySelectorAll(`.${className} .ql-picker-label`).forEach((el) => {
                if(!el.getAttribute('aria-label')){
                    el.setAttribute('aria-label', useTranslation(label));
                }
            });
        });
    }, [ariaLabel]);

    const [editorValue, setEditorValue] = useState(defaultValue ? defaultValue : null);

    const onEditorStateChange = (editorState) => {
        setEditorValue(editorState);
        setValue(id, editorState);
    };

    const checkCharacterCount = (event) => {
        if(!characterLimit){
            return;
        }

        if ((editorValue?.length ?? 0) > characterLimit && event.key !== 'Backspace') {
            event.preventDefault();
        }
    };

    return (
        <React.Fragment>
            <ReactQuill
                ref={quillRef}
                className={className}
                theme="snow"
                value={editorValue}
                onKeyDown={checkCharacterCount}
                onChange={onEditorStateChange}
                modules={compact ? QUILL_MODULES_COMPACT : QUILL_MODULES}
                formats={compact ? QUILL_FORMATS_COMPACT : QUILL_FORMATS}
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
    ariaLabel: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    validate: PropTypes.object,
    register: PropTypes.func.isRequired,
    description: PropTypes.string,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    characterLimit: PropTypes.number,
    compact: PropTypes.bool
};

export default WYSIWYGEditor;
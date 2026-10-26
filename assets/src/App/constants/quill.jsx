
// Quill 1.3.7's own default keyboard module binds Tab to insert a literal
// tab character and calls preventDefault() unconditionally (both Tab and
// Shift+Tab) — a genuine WCAG 2.1.2 keyboard trap, since a keyboard user
// can never Tab focus out of the editor once inside it. Overriding the
// named "tab" binding (Quill merges bindings by name, so this replaces
// rather than adds to the default) with a handler that returns true tells
// Quill's keyboard module not to preventDefault, letting the browser's
// normal Tab focus-navigation proceed instead. The toolbar's own
// indent/outdent buttons already cover the "insert a tab" use case, so
// nothing is lost.
const QUILL_KEYBOARD_TAB_ESCAPE = {
    bindings: {
        tab: {
            key: 9,
            handler: () => true,
        },
    },
};

/**
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
export const QUILL_MODULES = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
    keyboard: QUILL_KEYBOARD_TAB_ESCAPE
};

/**
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
export const QUILL_FORMATS = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

/**
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
export const QUILL_MODULES_COMPACT = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
    keyboard: QUILL_KEYBOARD_TAB_ESCAPE
};

/**
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
export const QUILL_FORMATS_COMPACT = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link'
];

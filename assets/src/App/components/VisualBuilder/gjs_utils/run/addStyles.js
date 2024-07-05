
export const addStyles = (editor) => {

    editor.StyleManager.addProperty('extra', { extend: 'filter' });
    editor.StyleManager.addProperty('extra', { extend: 'filter', property: 'backdrop-filter' });
};
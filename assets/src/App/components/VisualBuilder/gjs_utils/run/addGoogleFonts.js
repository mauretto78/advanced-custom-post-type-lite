
export const addGoogleFonts = (editor) => {

    editor.on('load', () => {
        const styleManager = editor.StyleManager;
        const fontProperty = styleManager.getProperty('typography', 'font-family');

        const fontList = [
            fontProperty.addOption({value: "'Lato', sans-serif", name: 'Lato'}),
            fontProperty.addOption({value: "'Montserrat', sans-serif", name: 'Montserrat'}),
            fontProperty.addOption({value: "'Open Sans', sans-serif", name: 'Open Sans'}),
            fontProperty.addOption({value: "'Oswald', sans-serif", name: 'Oswald'}),
            fontProperty.addOption({value: "'Poppins', sans-serif", name: 'Poppins'}),
            fontProperty.addOption({value: "'Raleway', sans-serif", name: 'Raleway'}),
            fontProperty.addOption({value: "'Roboto', sans-serif", name: 'Roboto'}),
        ];

        fontProperty.set('list', fontList);
        styleManager.render();
    });
};
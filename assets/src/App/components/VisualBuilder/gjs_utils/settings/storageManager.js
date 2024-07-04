
export const storageManager = (template) => {

    const globals = document.globals;
    const urlStore = `${globals.globals.site_url}${globals.globals.rest_route_url}/template/store`;
    const urlLoad = `${globals.globals.site_url}${globals.globals.rest_route_url}/template/load/${template.id}`;

    return {
        autosave: false,
        type: 'remote',
        stepsBeforeSave: 3,
        options: {
            remote: {
                urlLoad: urlLoad,
                urlStore: urlStore,
                contentTypeJson: true,
                onStore: (data, editor) => {

                    const pagesHtml = editor.Pages.getAll().map(page => {
                        const component = page.getMainComponent();
                        return {
                            html: editor.getHtml({ component }),
                            css: editor.getCss({ component })
                        }
                    });

                    return { data, pagesHtml, template };
                },
                onLoad: result => {
                    return result.data;
                },
            }
        }
    };
};
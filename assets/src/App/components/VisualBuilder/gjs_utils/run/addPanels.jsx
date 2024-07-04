import useTranslation from "../../../../hooks/useTranslation";

export const addPanels = (editor) => {

    editor.Panels.addPanel(
        {
            id: 'basic-actions',
            el: '.gjs-basic-actions',
            buttons: [
                {
                    id: 'visibility',
                    active: true,
                    className: 'btn-toggle-borders',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 19h2v2h-2zm-8 0h2v2h-2zm4 0h2v2h-2zm-8 0h2v2H7zm-4 0h2v2H3zM3 7h2v2H3zm0 8h2v2H3zm0-4h2v2H3zm0-8h2v2H3zm4 0h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm-8-8h2v2h-2zm0 8h2v2h-2zm-4-4h2v2H7zm8 0h2v2h-2zm-4 0h2v2h-2z"/></svg>',
                    command: 'sw-visibility',
                    attributes: { title: useTranslation("Toggle guides") }
                },
                {
                    id: 'preview',
                    active: false,
                    className: 'btn-toggle-borders',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5c-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1ZM12.22 17c-4.31.1-7.12-3.59-8-5c1-1.61 3.61-4.9 7.61-5c4.29-.11 7.11 3.59 8 5c-1.03 1.61-3.61 4.9-7.61 5Z"/><path fill="currentColor" d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5Zm0 5a1.5 1.5 0 1 1 1.5-1.5a1.5 1.5 0 0 1-1.5 1.5Z"/></svg>',
                    command: 'core:preview',
                    attributes: { title: useTranslation('Preview') }
                },
                {
                    id: 'fullscreen',
                    active: false,
                    className: 'btn-toggle-borders',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h5V3H3v7h2zm5 14H5v-5H3v7h7zm11-5h-2v5h-5v2h7zm-2-4h2V3h-7v2h5z"/></svg>',
                    command: 'core:fullscreen',
                    attributes: { title: useTranslation('Fullscreen mode') }
                },
                {
                    id: 'export',
                    active: false,
                    className: 'btn-open-export',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="m7.375 16.781l1.25-1.562L4.601 12l4.024-3.219l-1.25-1.562l-5 4a1 1 0 0 0 0 1.562l5 4zm9.25-9.562l-1.25 1.562L19.399 12l-4.024 3.219l1.25 1.562l5-4a1 1 0 0 0 0-1.562l-5-4zm-1.649-4.003l-4 18l-1.953-.434l4-18z"/></svg>',
                    command: 'export-template',
                    context: 'export-template',
                    attributes: { title: useTranslation('Export HTML/CSS code') }
                },
                {
                    id: 'undo',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z"/></svg>',
                    command: 'core:undo',
                    attributes: { title: useTranslation('Undo') }
                },
                {
                    id: 'redo',
                    label: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4l-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5z"/></svg>',
                    command: 'core:redo',
                    attributes: { title: useTranslation('Redo') }
                },
                {
                    id: 'save',
                    className: 'save',
                    command: 'save',
                    label: `<button class="primary">${useTranslation("Save")}</button>`,
                    attributes: { title: useTranslation("Save") }
                },
                {
                    id: 'exit',
                    className: 'exit',
                    command: 'exit',
                    label: `<button class="primary-o">${useTranslation("Exit")}</button>`,
                    attributes: { title: useTranslation("Exit") }
                },
            ],
        });
};

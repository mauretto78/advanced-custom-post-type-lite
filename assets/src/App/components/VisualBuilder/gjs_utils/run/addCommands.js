import {isset} from "../../../../utils/objects";
import {toast} from "react-hot-toast";
import useTranslation from "../../../../hooks/useTranslation";

export const addCommands = (editor, exitLink) => {

    editor.Commands.add('set-device-desktop', {
        run: editor => editor.setDevice('Desktop')
    });

    editor.Commands.add('set-device-tablet', {
        run: editor => editor.setDevice('Tablet')
    });

    editor.Commands.add('set-device-mobile', {
        run: editor => editor.setDevice('Mobile')
    });

    editor.Commands.add('show-layers', {
        getRowEl(editor) { return editor.getContainer().closest('.gjs-main'); },
        getLayersEl(row) { return row.querySelector('.gjs-layers-container') },

        run(editor, sender) {
            const lmEl = this.getLayersEl(this.getRowEl(editor));
            lmEl.style.display = '';
        },
        stop(editor, sender) {
            const lmEl = this.getLayersEl(this.getRowEl(editor));
            lmEl.style.display = 'none';
        },
    });

    editor.Commands.add('show-styles', {
        getRowEl(editor) { return editor.getContainer().closest('.gjs-main'); },
        getStyleEl(row) { return row.querySelector('.gjs-styles-container') },

        run(editor, sender) {
            const smEl = this.getStyleEl(this.getRowEl(editor));
            smEl.style.display = '';
        },
        stop(editor, sender) {
            const smEl = this.getStyleEl(this.getRowEl(editor));
            smEl.style.display = 'none';
        },
    });

    editor.Commands.add('show-traits', {
        getTraitsEl(editor) {
            const row = editor.getContainer().closest('.gjs-main');
            return row.querySelector('.gjs-traits-container');
        },
        run(editor, sender) {
            this.getTraitsEl(editor).style.display = '';
        },
        stop(editor, sender) {
            this.getTraitsEl(editor).style.display = 'none';
        },
    });

    editor.Commands.add('show-blocks', {
        getTraitsEl(editor) {
            const row = editor.getContainer().closest('.gjs-main');
            return row.querySelector('.gjs-blocks-container');
        },
        run(editor, sender) {
            this.getTraitsEl(editor).style.display = '';
        },
        stop(editor, sender) {
            this.getTraitsEl(editor).style.display = 'none';
        },
    });

    editor.on("run:core:preview", () => {
        document.getElementById("gjs-top").classList.add('hidden');
        document.getElementById("gjs-sidebar").classList.add('hidden');
    });

    editor.on("stop:core:preview", () => {
        document.getElementById("gjs-top").classList.remove('hidden');
        document.getElementById("gjs-sidebar").classList.remove('hidden');
    });

    editor.Commands.add('save', {
        run: editor => {
            editor.store({})
                .then( res => {
                    if(isset(res, "assets") && isset(res, "styles") && isset(res, "pages")){
                        toast.success(useTranslation("Template saved successfully"));
                    }
                })
                .catch(err => {
                    toast.success(useTranslation("Error during saving the template"));
                })
            ;
        }
    });

    editor.Commands.add('exit', {
        run: editor => {
            const globals = document.globals;
            document.body.style.overflow = 'scroll';
            window.location.replace(`${globals.globals.admin_url}${exitLink}`);
        }
    });
};
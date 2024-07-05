import BasicBlocksPlugin from "grapesjs-blocks-basic";
import CustomCodePlugin from "grapesjs-custom-code";
import GridBlockPlugin from "grapesjs-plugin-toolbox";
import StyleFilterPlugin from "grapesjs-style-filter";
import RteEditorPlugin from "grapesjs-rte-extensions";
import TabsPlugin from "grapesjs-tabs";

import 'grapesjs-plugin-toolbox/dist/grapesjs-plugin-toolbox.min.css';
import 'grapesjs-rte-extensions/dist/grapesjs-rte-extensions.min.css';
import 'grapick/dist/grapick.min.css';

export const plugins = () => {

    return [
        editor => BasicBlocksPlugin(editor, {
            stylePrefix: '',
            flexGrid: 1,
        }),
        editor => CustomCodePlugin(editor, {}),
        editor => GridBlockPlugin(editor, {
            traitsInSm: false
        }),
        editor => StyleFilterPlugin(editor, {}),
        editor => RteEditorPlugin(editor, {
            fonts: {
                fontSize: true,
                fontColor: true,
                hilite: false,
            },
            list: true,
            align: true,
            actions: true,
        }),
        editor => TabsPlugin(editor, {
            tabsBlock: { category: 'Extra' }
        }),
    ];
};
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// Styles
import 'grapesjs/dist/css/grapes.min.css';
import "../../scss/gjs.scss";
// GrapesJS
import grapesjs from 'grapesjs';
import {deviceManager} from "./gjs_utils/settings/deviceManager";
import {blockManager} from "./gjs_utils/settings/blockManager";
import {layerManager} from "./gjs_utils/settings/layerManager";
import {styleManager} from "./gjs_utils/settings/styleManager";
import {traitManager} from "./gjs_utils/settings/traitManager";
import {selectorManager} from "./gjs_utils/settings/selectorManager";
import {panels} from "./gjs_utils/settings/panels";
import {plugins} from "./gjs_utils/settings/plugins";
import {styles} from "./gjs_utils/settings/styles";
import {storageManager} from "./gjs_utils/settings/storageManager";
import {addCommands} from "./gjs_utils/run/addCommands";
import {addGoogleFonts} from "./gjs_utils/run/addGoogleFonts";
import {addPanels} from "./gjs_utils/run/addPanels";
import {addBlocks} from "./gjs_utils/run/addBlocks";
import {addStyles} from "./gjs_utils/run/addStyles";
import {addTraits} from "./gjs_utils/run/addTraits";
import Canvas from "./gjs_utils/components/Canvas";
import Sidebar from "./gjs_utils/components/Sidebar";
import Top from "./gjs_utils/components/Top";
import useTranslation from "../../hooks/useTranslation";
import Loader from "../Loader";
import {Toaster} from "react-hot-toast";

const VisualBuilder = ({template, exitLink}) => {

    // Visual Builder cannot be used under 960px resolution
    window.addEventListener("resize", function () {
        setBrowserWidth(document.body.clientWidth);
    });

    // manage local state
    const [browserWidth, setBrowserWidth] = useState(document.body.clientWidth);
    const [editor, setEditor] = useState(null);
    const [blocks, setBlocks] = useState(null);
    const [loadingBlocks, setLoadingBlocks] = useState(false);

    // Fetching blocks
    useEffect(() => {
        if(template.id){
            const globals = document.globals;
            const blocksApiUrl = `${globals.globals.site_url}${globals.globals.rest_route_url}/template/block/${template.id}`;
            setLoadingBlocks(true);

            fetch(blocksApiUrl)
                .then(response => response.json())
                .then(res => {
                    setBlocks(res);
                    setLoadingBlocks(false);
                })
                .catch(err => console.log(err))
            ;
        }
    }, []);

    // init GrapesJS
    useEffect(()=>{

        if(blocks !== null){

            // Disable body scroll
            document.body.style.overflow = 'hidden';

            // Init editor
            const editor = grapesjs.init({
                container: '.gjs-editor',
                fromElement: true,
                canvas: styles(),
                plugins: plugins(),
                blockManager: blockManager(),
                deviceManager: deviceManager(),
                layerManager: layerManager(),
                styleManager: styleManager(),
                selectorManager: selectorManager(),
                traitManager: traitManager(),
                storageManager: storageManager(template),
                panels: panels(),
            });

            // Blocks
            addBlocks(editor, blocks);

            // Commands
            addCommands(editor, exitLink);

            // Panels
            addPanels(editor);

            // StyleManager
            addStyles(editor);

            // Traits
            addTraits(editor);

            // Google fonts
            addGoogleFonts(editor);

            setEditor(editor);
        }
    }, [blocks]);

    // Query blocks
    const blockQueryHandle = (query) => {
        const bm = editor.Blocks;
        const all = bm.getAll();
        let filter;
        query && (filter = all.filter(block => {
            return block.get('label').toLowerCase().indexOf(query.toLowerCase()) > -1;
        })) ||
        (filter = all.filter(block => true));
        bm.render(filter);
    };

    if(loadingBlocks){
        return <Loader />;
    }

    return  (
        <React.Fragment>
            <div style={{marginLeft: "22px"}} className={`update-nag notice notice-warning ${browserWidth >= 960 ? 'hidden' : ''}`}>
                {useTranslation("ALERT: The visual builder can be used with a minimum resolution of 960 px wide")}
            </div>
            <div className={`gjs-wrapper ${browserWidth < 960 ? 'hidden' : ''}`}>
                <Top/>
                <div className="gjs-main">
                    <Sidebar blockQueryHandle={blockQueryHandle} />
                    <Canvas template={template} />
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

VisualBuilder.propTypes = {
    template: PropTypes.object.isRequired,
    exitLink: PropTypes.string.isRequired,
};

export default VisualBuilder;
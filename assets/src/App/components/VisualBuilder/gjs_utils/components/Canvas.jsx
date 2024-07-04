import React, {useEffect, useState} from "react";
import useTranslation from "../../../../hooks/useTranslation";
import PropTypes from "prop-types";
import {metaTypes} from "../../../../constants/metaTypes";
import {wpAjaxRequest} from "../../../../utils/ajax";
import {toast} from "react-hot-toast";

const Canvas = ({template}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const findBelongsValues = globals.find;

    // manage local state
    const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);
    const [previewItems, setPreviewItems] = useState([]);

    useEffect(() => {
        if(template.id){

            let items = [];
            const belong = template.belongs[0];

            switch (belong.belongsTo) {

                case metaTypes.CUSTOM_POST_TYPE:
                    items = findBelongsValues["POST_ID"].filter(el => el.label === belong.find);
                    items = items.length > 0 ? items[0].options : [];
                    break;

                case metaTypes.TAXONOMY:
                    items = findBelongsValues["TERM_ID"].filter(el => el.label === belong.find);
                    items = items.length > 0 ? items[0].options : [];
                    break;

                case "TERM_ID":

                   findBelongsValues['TERM_ID']
                        .filter(el => {
                            if(el.options){
                                el.options.map((o) => {
                                    if(o.value == belong.find){
                                        items.push(o);
                                    }
                                });
                            }
                        });

                    break;

                case "POST_ID":

                    findBelongsValues['POST_ID']
                        .filter(el => {
                            if(el.options){
                                el.options.map((o) => {
                                    if(o.value == belong.find){
                                        items.push(o);
                                    }
                                });
                            }
                        });

                    break;
            }

            setSelectedPreviewItem(items.length > 0 ? items[0].value : null);
            setPreviewItems(items);
        }
    }, []);

    return (
        <div className="editor-canvas">
            {previewItems.length > 0 && (
                <div className="gjs-meta">
                    <div className="gjs-meta-element">
                        <select
                            onChangeCapture={e => {
                                setSelectedPreviewItem(e.target.value);
                            }}
                        >
                            {previewItems.map((item) => (
                                <option value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <button
                            className="primary"
                            onClick={e => {
                                e.preventDefault();

                                wpAjaxRequest("fetchPreviewLinkAction", {
                                    id: selectedPreviewItem,
                                    type: template.type,
                                    belongsTo: template.belongs[0].belongsTo,
                                    find: template.belongs[0].find
                                })
                                    .then(res => {
                                        if(res.success === true){
                                            window.open(res.link, "_blank");
                                        } else {
                                            toast.error("Error in generating preview link");
                                        }
                                    })
                                    .catch(err => console.error(err))
                                ;
                            }}
                        >
                            {useTranslation("Preview")}
                        </button>
                    </div>
                </div>
            )}
            <div className="gjs-editor">
                <p>
                    {useTranslation("No content yet. Drag components in this canvas and start building something awesome!")}
                </p>
            </div>
        </div>
    );
};

Canvas.propTypes = {
    template: PropTypes.object.isRequired,
};

export default Canvas;
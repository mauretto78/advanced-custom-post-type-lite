import React, {useEffect} from 'react';
import {useEditor} from "@craftjs/core";
import {Icon} from "@iconify/react";
import {serializeCraftJson} from "../../../../utils/craft";
import {useDispatch, useSelector} from "react-redux";
import {savePostTypeTemplate} from "../../../../redux/thunks/saveCustomPostTemplate";
import {toast} from "react-toastify";

const Buttons = ({postType, templateType, meta, setPristineHandler}) => {

    const { actions, query, enabled, canUndo, canRedo } = useEditor(
        (state, query) => ({
            enabled: state.options.enabled,
            canUndo: state.options.enabled && query.history.canUndo(),
            canRedo: state.options.enabled && query.history.canRedo(),
        })
    );

    // manage global state
    const dispatch = useDispatch();
    const {success, loading, errors} = useSelector(state => state.saveCustomPostTemplateReducer);

    useEffect(()=>{
        if(success){
            toast.success("Template saved.");
            setPristineHandler();
        }

        if(errors.length > 0){
            errors.map((error)=>
                toast.error(error)
            );
        }

    }, [loading]);

    return (
        <div className="buttons space-between">
            <div>
                <button
                    className="acpt-btn acpt-btn-primary-o"
                    onClick={() => actions.history.undo()}
                >
                    <Icon icon="bx:bx-undo" width="24px" />
                </button>
                &nbsp;
                <button
                    onClick={() => actions.history.redo()}
                    className="acpt-btn acpt-btn-primary-o"
                >
                    <Icon icon="bx:bx-redo" width="24px" />
                </button>
            </div>
            <div className="text-right">
                <button
                    className="acpt-btn acpt-btn-primary"
                    onClick={() => {
                        try {
                            const json = query.serialize();
                            dispatch(savePostTypeTemplate(postType, templateType, serializeCraftJson(json), meta));
                        } catch ( e ) {
                            console.error(e.message);
                            toast.error(e.message);
                        }
                    }}
                >
                    <Icon icon="bx:bx-save" width="24px" />
                    &nbsp;
                    <span className="hidden-xs">Save</span>
                </button>
            </div>
        </div>
    );
};

export default Buttons;


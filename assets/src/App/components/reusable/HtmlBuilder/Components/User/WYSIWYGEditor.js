import React, {useEffect, useState} from "react";
import {Editor} from "@tinymce/tinymce-react";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {useNode} from "@craftjs/core";

export const WYSIWYGEditor = ( {text, fontSize, textAlign}) => {

    // manage local state
    const TINY_API_KEY = "2s4a6ct4nhr9bssn3t145mwzx08nzk73tccp5tpj0kpo4ylz";
    const [editable, setEditable] = useState(false);
    const [tinyContent, setTinyContent] = useState(text);

    const { connectors: {connect, drag}, isHover, isActive, actions: {setProp} } = useNode((node) => ({
        isHover: node.events.hovered,
        isActive: node.events.selected
    }));

    useEffect(() => {
        if(!isActive){
            setEditable(false);
            setProp(props =>
                props.text = tinyContent
            );
        }
    }, [isActive]);

    return (
        <KeyboardInteractiveElement>
            <div
                onClick={e => setEditable(true)}
            >
                {editable ?
                    <Editor
                        apiKey={TINY_API_KEY}
                        initialValue={text}
                        init={{
                            menubar: false,
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onChange={e =>
                            setTinyContent(e.target.getContent())
                        }
                    />
                :
                    <div dangerouslySetInnerHTML={{__html: text}}/>
                }
            </div>
        </KeyboardInteractiveElement>
    )
};

const WYSIWYGEditorSettings = () => {
    return null;
};

WYSIWYGEditor.craft = {
    displayName: "WYSIWYG Editor",
    props: {
        text: "Your text here.",
    },
    related: {
        settings: WYSIWYGEditorSettings
    }
};


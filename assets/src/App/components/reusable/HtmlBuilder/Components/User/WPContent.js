import {useSelector} from "react-redux";
import React from "react";
import {useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import TextAlign from "../../SettingsPanel/Form/TextAlign";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const WPContent = ({fontSize, color, margin, padding, textAlign, css}) => {

    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);

    return (
        <KeyboardInteractiveElement>
            <div
                className={css}
                style={{
                    textAlign: textAlign,
                    margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    padding: (typeof padding !== 'undefined') ? squaresToString(padding)  : null,
                    fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                    color: color ? color : null
                }}
                dangerouslySetInnerHTML={{__html: postData.post_content}}
            />
        </KeyboardInteractiveElement>
    )
};

const WPContentSettings = () => {
    const { actions: {setProp}, fontSize, color, margin, padding, textAlign, css } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        color: node.data.props.color,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        textAlign: node.data.props.textAlign,
        css: node.data.props.css,
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Text align</label>
                <TextAlign
                    value={textAlign}
                    onChange={(value) => {
                        setProp(props => props.textAlign = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Color</label>
                <ColorPicker
                    value={color}
                    onChange={(color) => setProp(props => props.color = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Font size</label>
                <Measure
                    value={fontSize}
                    onChange={(value) => {
                        setProp(props => props.fontSize = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Margins</label>
                <FourSquarePixel
                    value={margin}
                    defaultLocked={false}
                    onChange={(values) => {
                        setProp(props => props.margin = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Padding</label>
                <FourSquarePixel
                    value={padding}
                    onChange={(values) => {
                        setProp(props => props.padding = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Additional CSS classes</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={css}
                    onChange={(e) => {
                        const cssValue = e.currentTarget.value;
                        setProp(props => props.css = cssValue);
                    }}
                />
            </div>
        </div>
    )
};

WPContent.craft = {
    displayName: '[wp-content]',
    props: {
        fontSize: "15px",
    },
    related: {
        settings: WPContentSettings
    }
};
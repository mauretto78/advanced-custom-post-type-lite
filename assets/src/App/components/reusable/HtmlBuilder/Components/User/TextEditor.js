import React, {useEffect, useState} from "react";
import {useNode} from "@craftjs/core";
import ContentEditable from 'react-contenteditable'
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import TextAlign from "../../SettingsPanel/Form/TextAlign";
import FontWeight from "../../SettingsPanel/Form/FontWeight";
import FontStyle from "../../SettingsPanel/Form/FontStyle";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const TextEditor = ({text, fontSize, color, tag, margin, padding, textAlign, fontWeight, fontStyle, borderThickness, borderColor, borderRadius, background,  css}) => {

    // manage local state
    const [editable, setEditable] = useState(false);

    const { connectors: {connect, drag}, isHover, isActive, actions: {setProp} } = useNode((node) => ({
        isHover: node.events.hovered,
        isActive: node.events.selected
    }));

    useEffect(() => {!isActive && setEditable(false)}, [isActive]);

    return (
        <KeyboardInteractiveElement display={tag === 'p' ? "block" : "inline-block" }>
            <div onClick={e => setEditable(true)}>
                <ContentEditable
                    disabled={!editable}
                    html={text}
                    onChange={e =>
                        setProp(props =>
                            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                        )
                    }
                    tagName={tag ? tag : 'p'}
                    className={css}
                    style={{
                        textAlign: textAlign,
                        fontStyle:fontStyle,
                        fontWeight: fontWeight,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                        padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                        fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                        borderStyle: (borderThickness) ? "solid" : "hidden",
                        borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                        borderColor: `${borderColor}`,
                        borderWidth: borderThickness ? borderThickness : "hidden",
                        background: background ? background : "transparent",
                        color: color ? color : '#000'
                    }}
                />
            </div>
        </KeyboardInteractiveElement>
    );
};

const TextEditorSettings = () => {
    const { actions: {setProp}, fontSize, color, tag, margin, padding, textAlign, fontWeight, fontStyle, borderColor, borderThickness,background, borderRadius, css } = useNode((node) => ({
        background: node.data.props.background,
        borderColor: node.data.props.borderColor,
        borderThickness: node.data.props.borderThickness,
        borderRadius: node.data.props.borderRadius,
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight,
        fontStyle: node.data.props.fontStyle,
        color: node.data.props.color,
        tag: node.data.props.tag,
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
                <div className="mr-2" style={{display: "inline-block"}}>
                    <label>Font weight</label>
                    <FontWeight
                        value={fontWeight ? fontWeight : 'bold'}
                        onChange={(value) => {
                            setProp(props => props.fontWeight = value);
                        }}
                    />
                </div>
                <div style={{display: "inline-block"}}>
                    <label>Font style</label>
                    <FontStyle
                        value={fontStyle}
                        onChange={(value) => {
                            setProp(props => props.fontStyle = value);
                        }}
                    />
                </div>
            </div>
            <div className="acpt-form-group">
                <label>Tag</label>
                <select
                    className="acpt-form-control"
                    defaultValue={tag}
                    onChange={(e) => {
                        const tagValue = e.currentTarget.value;
                        setProp(props => props.tag = tagValue);
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="span">Span</option>
                </select>
            </div>
            <div className="acpt-form-group">
                <label>Background Color</label>
                <ColorPicker
                    value={background ? background : ''}
                    onChange={(color) => setProp(props => props.background = color) }
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
                <label>Border Color</label>
                <ColorPicker
                    value={borderColor ? borderColor : ''}
                    onChange={(color) => setProp(props => props.borderColor = color) }
                />
            </div>
            <div className="acpt-form-group">
                <label>Border thickness</label>
                <input
                    type="number"
                    min={0}
                    step={1}
                    className="acpt-form-control"
                    defaultValue={borderThickness}
                    onChange={(e) => {
                        const borderThicknessValue = e.currentTarget.value;
                        setProp(props => props.borderThickness = borderThicknessValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Border radius</label>
                <FourSquarePixel
                    value={borderRadius}
                    onChange={(values) => {
                        setProp(props => props.borderRadius = values);
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

TextEditor.craft = {
    props: {
        tag: "p",
        text: "This is a simple text",
        margin: [0,0,10,0, 'px'],
        padding: [0,0,0,0, 'px'],
    },
    related: {
        settings: TextEditorSettings
    }
};


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
import HLevel from "../../SettingsPanel/Form/HLevel";

export const Heading = ({text, fontSize, color, level, margin, padding, textAlign, fontWeight, fontStyle, css}) => {

    // manage local state
    const [editable, setEditable] = useState(false);

    const { connectors: {connect, drag}, isHover, isActive, actions: {setProp} } = useNode((node) => ({
        isHover: node.events.hovered,
        isActive: node.events.selected
    }));

    useEffect(() => {!isActive && setEditable(false)}, [isActive]);

    return (
        <KeyboardInteractiveElement>
            <div onClick={e => setEditable(true)}>
                <ContentEditable
                    disabled={!editable}
                    html={text}
                    onChange={e =>
                        setProp(props =>
                            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                        )
                    }
                    tagName={level ? level : 'h1'}
                    className={css}
                    style={{
                        textAlign: textAlign,
                        fontStyle:fontStyle,
                        fontWeight: fontWeight,
                        margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                        padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                        fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "20px"}`,
                        color: color ? color : '#000'
                    }}
                />
            </div>
        </KeyboardInteractiveElement>
    );
};

const HeadingSettings = () => {
    const { actions: {setProp}, fontSize, color, level, margin, padding, textAlign, fontWeight, fontStyle, css } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        fontWeight: node.data.props.fontWeight,
        fontStyle: node.data.props.fontStyle,
        color: node.data.props.color,
        level: node.data.props.level,
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
                <label>Heading</label>
                <HLevel
                    defaultValue={level}
                    onChange={(value) => {
                        setProp(props => props.level = value);
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

Heading.craft = {
    props: {
        text: "This is a heading",
        fontWeight: "bold",
        margin: [0,0,20,0, 'px'],
        padding: [0,0,0,0, 'px'],
    },
    related: {
        settings: HeadingSettings
    }
};


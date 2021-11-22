import React from "react";
import {useNode} from "@craftjs/core";
import ColorPicker from "../../SettingsPanel/Form/ColorPicker";
import FourSquarePixel from "../../SettingsPanel/Form/FourSquarePixel";
import KeyboardInteractiveElement from "../Editor/KeyboardInteractiveElement";
import {squaresToString} from "../../../../../utils/strings";
import Measure from "../../SettingsPanel/Form/Measure";

export const Button = ({text, link, fontSize, color, borderThickness, borderColor, background, borderRadius, margin, padding, css}) => {

    const redirect = () => {
        location.href=link
    };

    return (
        <KeyboardInteractiveElement display="inline-block">
            <button
                onClick={link ? redirect(): undefined }
                style={{
                    margin: (typeof margin !== 'undefined') ? squaresToString(margin) : null,
                    padding: (typeof padding !== 'undefined') ? squaresToString(padding) : null,
                    borderStyle: (borderThickness) ? "solid" : "hidden",
                    borderRadius: (typeof borderRadius !== 'undefined') ? squaresToString(borderRadius) : null,
                    borderColor: `${borderColor}`,
                    borderWidth: borderThickness ? borderThickness : "hidden",
                    fontSize: `${fontSize !== null && typeof fontSize !== 'undefined' ? fontSize : "14px"}`,
                    background: background ? background : "transparent",
                    color: color ? color : "transparent",
                }}
                className={css}
            >
                {text}
            </button>
        </KeyboardInteractiveElement>
    )
};

const ButtonSettings = () => {
    const { actions: {setProp}, text, link, fontSize, color, borderColor, borderThickness,background, borderRadius, margin, padding, css } = useNode((node) => ({
        text: node.data.props.text,
        link: node.data.props.link,
        fontSize: node.data.props.fontSize,
        borderColor: node.data.props.borderColor,
        color: node.data.props.color,
        background: node.data.props.background,
        borderThickness: node.data.props.borderThickness,
        borderRadius: node.data.props.borderRadius,
        margin: node.data.props.margin,
        padding: node.data.props.padding,
        css: node.data.props.css
    }));

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Text</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={text}
                    onChange={(e) => {
                        const textValue = e.currentTarget.value;
                        setProp(props => props.text = textValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Link</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={link}
                    onChange={(e) => {
                        const linkValue = e.currentTarget.value;
                        setProp(props => props.link = linkValue);
                    }}
                />
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
                    value={color ? color : ''}
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
                    onChange={(values) => {
                        setProp(props => props.margin = values);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Padding</label>
                <FourSquarePixel
                    value={padding}
                    defaultLocked={false}
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

Button.craft = {
    props: {
        background: "#02c39a",
        color: "#ffffff",
        link: null,
        text: "Button text",
        borderRadius: [5,5,5,5, 'px'],
        margin: [0,0,0,0, 'px'],
        padding: [7,14,7,14, 'px'],
        css: ""
    },
    related: {
        settings: ButtonSettings
    }
};